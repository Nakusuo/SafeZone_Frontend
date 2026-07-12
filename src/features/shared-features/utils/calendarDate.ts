export type CalendarDateInput = string | Date | number[] | null | undefined

const pad = (value: number) => String(value).padStart(2, '0')

export const parseCalendarDate = (value: CalendarDateInput): Date | null => {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
      return null
    }

    return new Date(year, month - 1, day, hour, minute, second)
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) return null

  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const parsed = new Date(trimmed)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const directMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?)?$/)
  if (!directMatch) {
    const parsed = new Date(trimmed)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const [, year, month, day, hour = '0', minute = '0', second = '0'] = directMatch
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))
}

export const toBackendDateTime = (value: CalendarDateInput): string => {
  const date = parseCalendarDate(value)
  if (!date) {
    const fallback = new Date()
    return `${fallback.getFullYear()}-${pad(fallback.getMonth() + 1)}-${pad(fallback.getDate())}T${pad(fallback.getHours())}:${pad(fallback.getMinutes())}:${pad(fallback.getSeconds())}`
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export const toDateTimeInputValue = (value: CalendarDateInput): string => {
  const date = parseCalendarDate(value)
  if (!date) {
    const fallback = new Date()
    return `${fallback.getFullYear()}-${pad(fallback.getMonth() + 1)}-${pad(fallback.getDate())}T${pad(fallback.getHours())}:${pad(fallback.getMinutes())}`
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const formatMonthLabel = (value: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(value)
}

export const getMonthRange = (value: Date) => {
  const start = new Date(value.getFullYear(), value.getMonth(), 1, 0, 0, 0)
  const end = new Date(value.getFullYear(), value.getMonth() + 1, 0, 23, 59, 59)

  return {
    start: toBackendDateTime(start),
    end: toBackendDateTime(end),
  }
}
