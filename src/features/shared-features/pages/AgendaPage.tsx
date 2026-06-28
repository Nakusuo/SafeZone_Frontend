import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventContentArg, EventDropArg, DatesSetArg, EventResizeArg } from '@fullcalendar/core'
import { CalendarDays, CalendarPlus, Clock3, Sparkles } from 'lucide-react'

import { Button, Input, Modal, Select, TextArea } from '@/shared/components'
import { useAuth } from '@/core/auth/AuthContext'
import {
  agendaService,
  type AgendaEvent,
  type AgendaEventStatus,
  type AgendaEventType,
  type CreateAgendaEventPayload,
} from '@/features/shared-features/services/agendaService'

type CalendarEventInput = {
  id: string
  title: string
  start: string
  end: string
  allDay?: boolean
  extendedProps: {
    tipo: AgendaEventType
    estado: AgendaEventStatus
    descripcion?: string
  }
}

type AgendaFormState = {
  usuarioid: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  tipo: AgendaEventType
  estado: AgendaEventStatus
  descripcion: string
}

const toDateTimeLocal = (value: Date | string): string => {
  const date = typeof value === 'string' ? new Date(value) : value
  const offset = date.getTimezoneOffset() * 60000
  // Sincroniza limpiamente eliminando segundos para evitar falsos cambios en el input
  const localDate = new Date(date.getTime() - offset)
  return localDate.toISOString().slice(0, 16)
}

const formatInitialDate = (baseDate: string) => {
  const date = new Date(baseDate)
  const start = new Date(date)
  start.setHours(9, 0, 0, 0)
  const end = new Date(date)
  end.setHours(10, 0, 0, 0)
  return { start: toDateTimeLocal(start), end: toDateTimeLocal(end) }
}

const eventTypeOptions: Array<{ value: AgendaEventType; label: string }> = [
  { value: 'AUDIENCIA', label: 'Audiencia' },
  { value: 'CITA_PSICOLOGICA', label: 'Cita psicológica' },
  { value: 'PLAZO_LEGAL', label: 'Plazo legal' },
]

const eventStatusOptions: Array<{ value: AgendaEventStatus; label: string }> = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'COMPLETADO', label: 'Completado' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

// Mapea usando de forma segura 'event.id' mapeado desde el backend corregido
const mapAgendaToCalendarEvent = (event: AgendaEvent): CalendarEventInput => ({
  id: event.id, 
  title: event.titulo,
  start: event.fechaInicio,
  end: event.fechaFin,
  extendedProps: {
    tipo: event.tipo,
    estado: event.estado,
    descripcion: event.descripcion,
  },
})

export const AgendaPage = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEventInput[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [formData, setFormData] = useState<AgendaFormState>({
    usuarioid: user?.id ?? '',
    titulo: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: 'CITA_PSICOLOGICA',
    estado: 'PENDIENTE',
    descripcion: '',
  })
  
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  // Inicializar ID de usuario en el formulario
  useEffect(() => {
    if (!user?.id) return
    const initial = formatInitialDate(new Date().toISOString())
    setFormData((prev) => ({
      ...prev,
      usuarioid: user.id,
      fechaInicio: initial.start,
      fechaFin: initial.end,
    }))
  }, [user?.id])

  // Encapsulado en useCallback para evitar recreaciones infinitas en el ciclo de FullCalendar
  const loadAgenda = useCallback(async (start: string, end: string) => {
    if (!user?.id) return

    setIsLoading(true)
    setError('')

    try {
      const agenda = await agendaService.getAgenda(user.id, start, end)
      setEvents(agenda.map(mapAgendaToCalendarEvent))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la agenda'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      void loadAgenda(dateRange.start, dateRange.end)
    }
  }, [dateRange, loadAgenda])

  const openCreateModal = (selectedDate: string) => {
    const { start, end } = formatInitialDate(selectedDate)
    setFormData({
      usuarioid: user?.id ?? '',
      titulo: '',
      fechaInicio: start,
      fechaFin: end,
      tipo: 'CITA_PSICOLOGICA',
      estado: 'PENDIENTE',
      descripcion: '',
    })
    setError('')
    setSuccess('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user?.id) return setError('Debes iniciar sesión para crear un evento')
    if (!formData.titulo.trim()) return setError('El título es obligatorio')

    setIsSaving(true)
    setError('')

    try {
      const payload: CreateAgendaEventPayload = {
        usuarioid: user.id,
        titulo: formData.titulo.trim(),
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
        tipo: formData.tipo,
        estado: formData.estado,
        descripcion: formData.descripcion.trim() || undefined,
      }

      await agendaService.create(payload)
      setSuccess('Evento creado correctamente')
      setIsModalOpen(false)
      void loadAgenda(dateRange.start, dateRange.end)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear el evento'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEventDrop = async (info: EventDropArg) => {
    if (!user?.id) return
    setError('')
    
    const nuevoStart = info.event.start ?? new Date()
    const nuevoEnd = info.event.end ?? nuevoStart

    try {
      await agendaService.updateDates(info.event.id, user.id, nuevoStart, nuevoEnd)
      setSuccess('Fecha del evento actualizada')
    } catch (err) {
      info.revert() // Revierte el movimiento visual si la API falla por reglas del backend
      const message = err instanceof Error ? err.message : 'No se pudo mover el evento'
      setError(message)
    }
  }

  const handleEventResize = async (info: EventResizeArg) => {
    if (!user?.id) return
    setError('')

    const nuevoStart = info.event.start ?? new Date()
    const nuevoEnd = info.event.end ?? nuevoStart

    try {
      await agendaService.updateDates(info.event.id, user.id, nuevoStart, nuevoEnd)
      setSuccess('Duración del evento actualizada')
    } catch (err) {
      info.revert() // Revierte el cambio de tamaño visual si da error
      const message = err instanceof Error ? err.message : 'No se pudo ajustar la duración'
      setError(message)
    }
  }

  const eventClassNames = (arg: EventContentArg) => {
    const type = arg.event.extendedProps.tipo as AgendaEventType | undefined
    const status = arg.event.extendedProps.estado as AgendaEventStatus | undefined

    const base = 'rounded-md px-2 py-1 text-xs font-semibold shadow-sm border transition-all cursor-pointer'
    const typeClass = {
      AUDIENCIA: 'bg-red-500 border-red-600 text-white hover:bg-red-600',
      CITA_PSICOLOGICA: 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600',
      PLAZO_LEGAL: 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600',
    }[type ?? 'CITA_PSICOLOGICA'] ?? 'bg-slate-500 border-slate-600 text-white'

    const statusClass = status === 'COMPLETADO' ? 'opacity-50 line-through' : ''

    return [base, typeClass, statusClass]
  }

  const handleDatesSet = (info: DatesSetArg) => {
    const startIso = info.start.toISOString()
    const endIso = info.end.toISOString()
    
    // Solo actualiza el rango si es diferente, previniendo llamadas infinitas redundantes
    setDateRange((prev) => {
      if (prev.start === startIso && prev.end === endIso) return prev
      return { start: startIso, end: endIso }
    })
  }

  const headerSummary = useMemo(() => {
    const count = events.length
    return `${count} ${count === 1 ? 'evento' : 'eventos'} registrados`
  }, [events.length])

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-gray-800">Inicia sesión para ver tu agenda</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info Cards */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
              <CalendarDays className="h-4 w-4" />
              Agenda / Calendario
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Gestiona tus citas y trámites</h1>
            <p className="mt-2 text-sm text-gray-600">Arrastra, ajusta y organiza tus compromisos.</p>
          </div>

          <Button
            onClick={() => openCreateModal(new Date().toISOString())}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 transition-colors"
          >
            <CalendarPlus className="h-4 w-4" />
            Nuevo evento
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{isLoading ? 'Cargando...' : headerSummary}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Sugerencia</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Haz clic en un día para agregar un evento nuevo.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Herramienta</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <Clock3 className="h-4 w-4 text-blue-500" />
              Arrastra y estira para mover o ajustar la duración.
            </p>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

      {/* Calendario */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm structure-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          editable={true}
          droppable={true}
          selectable={true}
          events={events}
          eventClassNames={eventClassNames}
          dateClick={(info) => openCreateModal(info.dateStr)}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          datesSet={handleDatesSet}
          height="auto"
        />
      </div>

      {/* Modal de Registro */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear evento"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => formRef.current?.requestSubmit()} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar evento'}
            </Button>
          </div>
        }
      >
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título"
            placeholder="Ej. Audiencia judicial"
            value={formData.titulo}
            onChange={(value) => setFormData((prev) => ({ ...prev, titulo: value }))}
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Inicio"
              type="datetime-local"
              value={formData.fechaInicio}
              onChange={(value) => setFormData((prev) => ({ ...prev, fechaInicio: value }))}
              required
            />
            <Input
              label="Fin"
              type="datetime-local"
              value={formData.fechaFin}
              onChange={(value) => setFormData((prev) => ({ ...prev, fechaFin: value }))}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Tipo"
              options={eventTypeOptions}
              value={formData.tipo}
              onChange={(value) => setFormData((prev) => ({ ...prev, tipo: value as AgendaEventType }))}
            />
            <Select
              label="Estado"
              options={eventStatusOptions}
              value={formData.estado}
              onChange={(value) => setFormData((prev) => ({ ...prev, estado: value as AgendaEventStatus }))}
            />
          </div>

          <TextArea
            label="Descripción"
            placeholder="Agrega información relevante para el evento"
            value={formData.descripcion}
            onChange={(value) => setFormData((prev) => ({ ...prev, descripcion: value }))}
            rows={4}
          />
        </form>
      </Modal>
    </div>
  )
}