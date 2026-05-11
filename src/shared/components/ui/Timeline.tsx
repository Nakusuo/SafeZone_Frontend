import { ReactNode } from 'react'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'

type TimelineStatus = 'completed' | 'current' | 'pending' | 'error'

interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: Date | string
  status: TimelineStatus
  icon?: ReactNode
}

interface TimelineProps {
  events: TimelineEvent[]
  orientation?: 'vertical' | 'horizontal'
}

const statusStyles = {
  completed: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    line: 'bg-success',
  },
  current: {
    icon: Circle,
    color: 'text-primary',
    bg: 'bg-primary/10',
    line: 'bg-primary',
  },
  pending: {
    icon: Circle,
    color: 'text-gray-400',
    bg: 'bg-gray-100',
    line: 'bg-gray-300',
  },
  error: {
    icon: AlertCircle,
    color: 'text-accent',
    bg: 'bg-accent/10',
    line: 'bg-accent',
  },
}

export const Timeline = ({ events, orientation = 'vertical' }: TimelineProps) => {
  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {events.map((event, index) => {
          const styles = statusStyles[event.status]
          const Icon = styles.icon

          return (
            <div key={event.id} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex flex-col items-center ${styles.bg} rounded-lg p-3 min-w-max`}>
                <Icon className={`w-5 h-5 ${styles.color}`} />
                <p className="text-xs font-medium text-gray-900 mt-1 text-center">{event.title}</p>
                <p className="text-xs text-gray-600 text-center">
                  {new Date(event.date).toLocaleDateString('es-ES')}
                </p>
              </div>
              {index < events.length - 1 && (
                <div className={`h-1 w-6 ${styles.line} rounded-full`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Línea vertical */}
      <div className="absolute left-5 top-8 bottom-0 w-1 bg-gradient-to-b from-primary to-gray-300" />

      {events.map((event) => {
        const styles = statusStyles[event.status]
        const Icon = styles.icon

        return (
          <div key={event.id} className="flex gap-6 relative">
            {/* Icono */}
            <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full z-10 relative">
              <div className={`${styles.bg} rounded-full p-2`}>
                <Icon className={`w-5 h-5 ${styles.color}`} />
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 pt-1">
              <h4 className="font-semibold text-gray-900">{event.title}</h4>
              {event.description && (
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(event.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
