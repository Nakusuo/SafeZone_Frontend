import { api } from '@/shared/services';
import { CaseFollow, SessionNote, CreateSessionNoteDto, PsychologistStats } from '../types';

// Servicio para casos asignados al psicólogo
export const psychologistService = {
  // GET /api/seguimientos/psicologo/{id}: Lista casos vinculados al profesional
  async getAssignedCases(psychologistId: string): Promise<CaseFollow[]> {
    const response = await api.get<CaseFollow[]>(`/seguimientos/psicologo/${psychologistId}`);
    return response.data;
  },

  // GET /api/seguimientos/{id}: Obtiene detalles de un seguimiento
  async getCaseFollowUp(followUpId: string): Promise<CaseFollow> {
    const response = await api.get<CaseFollow>(`/seguimientos/${followUpId}`);
    return response.data;
  },

  // POST /api/seguimientos/notas: Registra la sesión emocional
  async createSessionNote(followUpId: string, data: CreateSessionNoteDto): Promise<SessionNote> {
    const response = await api.post<SessionNote>(`/seguimientos/${followUpId}/notas`, data);
    return response.data;
  },

  // GET /api/seguimientos/{id}/notas: Obtiene todas las notas de un seguimiento
  async getSessionNotes(followUpId: string): Promise<SessionNote[]> {
    const response = await api.get<SessionNote[]>(`/seguimientos/${followUpId}/notas`);
    return response.data;
  },

  // PUT /api/seguimientos/{id}/notas/{noteId}: Actualiza una nota
  async updateSessionNote(followUpId: string, noteId: string, data: Partial<CreateSessionNoteDto>): Promise<SessionNote> {
    const response = await api.put<SessionNote>(`/seguimientos/${followUpId}/notas/${noteId}`, data);
    return response.data;
  },

  // PUT /api/seguimientos/{id}: Actualiza el estado del seguimiento
  async updateCaseFollowUp(followUpId: string, data: Partial<CaseFollow>): Promise<CaseFollow> {
    const response = await api.put<CaseFollow>(`/seguimientos/${followUpId}`, data);
    return response.data;
  }
};

// Servicio para estadísticas
export const psychologistStatsService = {
  // GET /api/psicologo/estadisticas: Obtiene estadísticas del psicólogo
  async getStats(psychologistId: string): Promise<PsychologistStats> {
    const response = await api.get<PsychologistStats>(`/psicologo/${psychologistId}/estadisticas`);
    return response.data;
  },

  // GET /api/psicologo/evoluciones: Obtiene datos de evolución de casos
  async getEvolutionMetrics(psychologistId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/psicologo/${psychologistId}/evoluciones`);
    return response.data;
  }
};
