import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

type CardType = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface CardProps {
  children: ReactNode
  title?: string
  type?: CardType
  className?: string
}

const typeStyles: Record<CardType, string> = {
  default: 'bg-white border-l-4 border-primary shadow-soft',
  success: 'bg-white border-l-4 border-success shadow-soft',
  warning: 'bg-white border-l-4 border-warning shadow-soft',
  danger: 'bg-white border-l-4 border-accent shadow-soft',
  info: 'bg-white border-l-4 border-secondary shadow-soft',
}

export const Card = ({ 
  children, 
  title, 
  type = 'default',
  className = '' 
}: CardProps) => {
  const iconMap: Record<CardType, ReactNode> = {
    default: null,
    success: <CheckCircle className="w-5 h-5 text-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    danger: <AlertCircle className="w-5 h-5 text-accent" />,
    info: <Info className="w-5 h-5 text-secondary" />,
  }

  return (
    <div className={`rounded-2xl p-6 ${typeStyles[type]} ${className}`}>
      {(title || type !== 'default') && (
        <div className="flex items-center gap-3 mb-4">
          {iconMap[type]}
          {title && <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  )
}
