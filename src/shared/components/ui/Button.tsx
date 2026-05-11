import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-opacity-90 disabled:bg-gray-400 shadow-soft hover:shadow-warm',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
  danger: 'bg-accent text-white hover:bg-opacity-90 disabled:bg-gray-400 shadow-soft',
  outline: 'border-2 border-primary text-primary hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400',
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-xl font-medium transition-all duration-300
        disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-60
        ${className}
      `}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
