import apiClient from '@/core/api/apiClient'
import { toBackendDateTime } from '@/features/shared-features/utils/calendarDate'

export type AgendaEventType = 'AUDIENCIA' | 'CITA_PSICOLOGICA' | 'PLAZO_LEGAL'
export type AgendaEventStatus = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'COMPLETADA' | 'CANCELADO'
export type AgendaDateValue = string | number[] | Date | null | undefined

export interface Agenda {
  id: string
  usuarioid: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  tipo: string
  estado: string
  descripcion: string
  linkReunion: string | null
  usuarioNombre: string | null
  profesionalId: string | null
  profesionalNombre: string | null
}

export type AgendaEvent = Agenda

export interface CreateAgendaEventPayload {
  usuarioid: string
  usuarioNombre: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  tipo: AgendaEventType
  estado: AgendaEventStatus
  descripcion?: string
  profesionalId: string
  profesionalNombre: string
}

export interface ManageAgendaEventPayload {
  estado: AgendaEventStatus
  linkReunion?: string
}

const normalizeDate = (value: string | Date): string => {
  return toBackendDateTime(value)
}

export const agendaService = {
  getVictimAgenda: async (): Promise<AgendaEvent[]> => {
    const { data } = await apiClient.get<AgendaEvent[]>('/agenda/mis-citas-victima')
    return data
  },

  getPsychologistAgenda: async (): Promise<AgendaEvent[]> => {
    const { data } = await apiClient.get<AgendaEvent[]>('/agenda/mis-citas-psicologo')
    return data
  },

  getAdminAgenda: async (): Promise<AgendaEvent[]> => {
    const { data } = await apiClient.get<AgendaEvent[]>('/agenda')
    return data
  },

  create: async (payload: CreateAgendaEventPayload): Promise<AgendaEvent> => {
    const { data } = await apiClient.post<AgendaEvent>('/agenda', payload)
    return data
  },

  manage: async (id: string, payload: ManageAgendaEventPayload): Promise<AgendaEvent> => {
    const { data } = await apiClient.put<AgendaEvent>(`/agenda/${id}/gestionar`, payload)
    return data
  },

  updateStatus: async (
    id: string,
    usuarioid: string,
    estado: AgendaEventStatus
  ): Promise<AgendaEvent> => {
    const { data } = await apiClient.patch<AgendaEvent>(
      `/agenda/${id}/estado?usuarioid=${encodeURIComponent(usuarioid)}`,
      { estado } satisfies { estado: AgendaEventStatus }
    )
    return data
  },

  updateDates: async (
    id: string,
    usuarioid: string,
    fechaInicio: string | Date,
    fechaFin: string | Date
  ): Promise<AgendaEvent> => {
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