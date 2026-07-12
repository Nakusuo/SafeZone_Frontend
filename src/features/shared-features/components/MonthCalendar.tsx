import { useMemo } from 'react'
import type { AgendaEvent, AgendaEventStatus, AgendaEventType } from '@/features/shared-features/services/agendaService'
import { parseCalendarDate, toBackendDateTime } from '@/features/shared-features/utils/calendarDate'

type MonthCalendarProps = {
  currentDate: Date
  events: AgendaEvent[]
  onSelectDate: (date: Date) => void
  onSelectEvent: (event: AgendaEvent) => void
}

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const typeStyles: Record<AgendaEventType, string> = {
  AUDIENCIA: 'bg-red-500/90 text-white',
  CITA_PSICOLOGICA: 'bg-sky-500/90 text-white',
  PLAZO_LEGAL: 'bg-amber-500/90 text-white',
}

const statusStyles: Record<AgendaEventStatus, string> = {
  PENDIENTE: 'opacity-100',
  EN_PROCESO: 'opacity-90',
  COMPLETADO: 'opacity-60 line-through',
  CANCELADO: 'opacity-70 grayscale',
}

const toDayKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const MonthCalendar = ({ currentDate, events, onSelectDate, onSelectEvent }: MonthCalendarProps) => {
  const monthDays = useMemo(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const leadingBlanks = firstDay.getDay()
    const totalCells = Math.ceil((leadingBlanks + lastDay.getDate()) / 7) * 7
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

    for (let index = 0; index < totalCells; index += 1) {
      const dayOffset = index - leadingBlanks + 1
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayOffset)
      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
      })
    }

    return days
  }, [currentDate])

  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, AgendaEvent[]>()

    events.forEach((event) => {
      const startDate = parseCalendarDate(event.fechaInicio)
      const endDate = parseCalendarDate(event.fechaFin)
      const source = startDate ?? endDate ?? new Date()
      const key = toDayKey(source)
      const values = grouped.get(key) ?? []
      values.push(event)
      grouped.set(key, values)
    })

    return grouped
  }, [events])

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        {dayNames.map((day) => (
          <div key={day} className="px-2 py-3">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-white">
        {monthDays.map(({ date, isCurrentMonth }) => {
          const key = toDayKey(date)
          const dayEvents = eventsByDay.get(key) ?? []
          const isToday = toDayKey(date) === toDayKey(new Date())

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`min-h-[110px] border-b border-r border-gray-100 p-2 text-left transition hover:bg-teal-50/70 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50/70 text-gray-400'} ${isToday ? 'ring-1 ring-inset ring-teal-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${isToday ? 'text-teal-700' : 'text-gray-700'}`}>
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-1 overflow-y-auto pr-1" style={{ maxHeight: '60px' }}>
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation()
                      onSelectEvent(event)
                    }}
                    className={`block w-full rounded-md px-2 py-1 text-left text-[11px] font-medium shadow-sm ${typeStyles[event.tipo] ?? 'bg-slate-500/90 text-white'} ${statusStyles[event.estado]}`}
                  >
                    <div className="truncate">{event.titulo}</div>
                    <div className="mt-0.5 truncate text-[10px] opacity-90">
                      {toBackendDateTime(parseCalendarDate(event.fechaInicio) ?? new Date()).slice(11, 16)}
                    </div>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] font-medium text-gray-500">
                    +{dayEvents.length - 3} más
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
