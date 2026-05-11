import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

type AlertType = 'success' | 'danger' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title?: string
  message: ReactNode
  onClose?: () => void
  dismissible?: boolean
  className?: string
}

const alertStyles = {
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    icon: CheckCircle,
  },
  danger: {
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    text: 'text-accent',
    icon: AlertCircle,
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    icon: Info,
  },
}

export const Alert = ({
  type,
  title,
  message,
  onClose,
  dismissible = true,
  className = '',
}: AlertProps) => {
  const style = alertStyles[type]
  const Icon = style.icon

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4 flex items-start gap-3 ${className}`}>
      <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        {title && <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>}
        <p className={`text-sm ${style.text}`}>{message}</p>
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className={`p-1 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0`}
        >
          <X className={`w-4 h-4 ${style.text}`} />
        </button>
      )}
    </div>
  )
}
