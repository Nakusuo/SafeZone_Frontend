

interface InputProps {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  name?: string
}

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
  name,
}: InputProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-xl border border-slate-600 bg-[#374151] text-slate-100
          ${error ? 'border-red-400' : 'border-slate-600'}
          focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30
          disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#f1f5f9] disabled:border-slate-300 disabled:text-[#475569]
          placeholder:text-slate-400
          transition-all duration-200
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-accent font-medium">{error}</p>
      )}
    </div>
  )
}

interface TextAreaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  maxLength?: number
}

export const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  rows = 4,
  maxLength,
}: TextAreaProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-2 rounded-xl border border-slate-600 bg-[#374151] text-slate-100
          ${error ? 'border-red-400' : 'border-slate-600'}
          focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30
          disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#f1f5f9] disabled:border-slate-300 disabled:text-[#475569]
          placeholder:text-slate-400
          transition-all duration-200
          font-sans
          ${maxLength ? 'resize-none' : 'resize-vertical'}
        `}
      />
      <div className="flex justify-between mt-1">
        {error && (
          <p className="text-sm text-accent font-medium">{error}</p>
        )}
        {maxLength && (
          <p className="text-xs text-gray-500 ml-auto">
            {(value?.length || 0)} / {maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

interface SelectProps {
  label?: string
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder = 'Select an option',
}: SelectProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-xl border border-slate-600 bg-[#374151] text-slate-100
          ${error ? 'border-red-400' : 'border-slate-600'}
          focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30
          disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#f1f5f9] disabled:border-slate-300 disabled:text-[#475569]
          transition-all duration-200
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-accent font-medium">{error}</p>
      )}
    </div>
  )
}
