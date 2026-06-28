import apiClient from '@/core/api/apiClient'

export type AgendaEventType = 'AUDIENCIA' | 'CITA_PSICOLOGICA' | 'PLAZO_LEGAL'
export type AgendaEventStatus = 'PENDIENTE' | 'COMPLETADO' | 'EN_PROCESO' | 'CANCELADO'

export interface AgendaEvent {
  id: string
  usuarioid: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  tipo: AgendaEventType
  estado: AgendaEventStatus
  descripcion?: string
}

export interface CreateAgendaEventPayload {
  usuarioid: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  tipo: AgendaEventType
  estado: AgendaEventStatus
  descripcion?: string
}

export interface UpdateAgendaEventStatusPayload {
  estado: AgendaEventStatus
}

const normalizeDate = (value: string | Date): string => {
  if (typeof value === 'string') {
    if (!value.endsWith('Z') && !value.includes('+')) {
      return new Date(value).toISOString()
    }
    return value
  }
  return value.toISOString()
}

export const agendaService = {
  getAgenda: async (
    usuarioid: string,
    start: string | Date,
    end: string | Date
  ): Promise<AgendaEvent[]> => {
    // ✅ Corregido: Quitamos el /api redundante
    const { data } = await apiClient.get<AgendaEvent[]>(
      `/agenda/${usuarioid}?start=${encodeURIComponent(normalizeDate(start))}&end=${encodeURIComponent(normalizeDate(end))}`
    )
    return data
  },

  create: async (payload: CreateAgendaEventPayload): Promise<AgendaEvent> => {
    // ✅ Corregido: Quitamos el /api redundante
    const { data } = await apiClient.post<AgendaEvent>('/agenda', payload)
    return data
  },

  updateStatus: async (
    id: string,
    usuarioid: string,
    estado: AgendaEventStatus
  ): Promise<AgendaEvent> => {
    // ✅ Corregido: Quitamos el /api redundante
    const { data } = await apiClient.patch<AgendaEvent>(
      `/agenda/${id}/estado?usuarioid=${encodeURIComponent(usuarioid)}`,
      { estado } satisfies UpdateAgendaEventStatusPayload
    )
    return data
  },

  updateDates: async (
    id: string,
    usuarioid: string,
    fechaInicio: string | Date,
    fechaFin: string | Date
  ): Promise<AgendaEvent> => {
    // ✅ Corregido: Quitamos el /api redundante
    const { data } = await apiClient.patch<AgendaEvent>(
      `/agenda/${id}/fechas?usuarioid=${encodeURIComponent(usuarioid)}`,
      {
        fechaInicio: normalizeDate(fechaInicio),
        fechaFin: normalizeDate(fechaFin),
      }
    )
    return data
  },
}