import { api } from '@/shared/services';
import { LegalCase, LegalFile, CaseHearing, InteroperabilityData } from '../types';

// Servicio para casos legales
export const defenderService = {
  // GET /api/casos/detalle/{id}: Vista completa que incluye las notas del psicólogo (interoperabilidad)
  async getCaseDetail(caseId: string): Promise<InteroperabilityData> {
    const response = await api.get<InteroperabilityData>(`/casos/detalle/${caseId}`);
    return response.data;
  },

  // GET /api/casos: Lista todos los casos del defensor
  async getCases(): Promise<LegalCase[]> {
    const response = await api.get<LegalCase[]>('/casos');
    return response.data;
  },

  // POST /api/casos: Crea un nuevo caso
  async createCase(data: Partial<LegalCase>): Promise<LegalCase> {
    const response = await api.post<LegalCase>('/casos', data);
    return response.data;
  },

  // PUT /api/casos/{id}: Actualiza un caso
  async updateCase(caseId: string, data: Partial<LegalCase>): Promise<LegalCase> {
    const response = await api.put<LegalCase>(`/casos/${caseId}`, data);
    return response.data;
  },

  // GET /api/casos/{id}/expediente: Obtiene el expediente legal completo
  async getLegalFile(caseId: string): Promise<LegalFile> {
    const response = await api.get<LegalFile>(`/casos/${caseId}/expediente`);
    return response.data;
  }
};

// Servicio para audiencias
export const hearingService = {
  // GET /api/audiencias/calendario: Obtiene el calendario de audiencias
  async getSchedule(defenderId?: string): Promise<CaseHearing[]> {
    const url = defenderId 
      ? `/audiencias/calendario?defenderId=${defenderId}`
      : '/audiencias/calendario';
    const response = await api.get<CaseHearing[]>(url);
    return response.data;
  },

  // GET /api/casos/{id}/audiencias: Lista audiencias de un caso
  async getCaseHearings(caseId: string): Promise<CaseHearing[]> {
    const response = await api.get<CaseHearing[]>(`/casos/${caseId}/audiencias`);
    return response.data;
  },

  // POST /api/audiencias: Crea una nueva audiencia
  async createHearing(data: Partial<CaseHearing>): Promise<CaseHearing> {
    const response = await api.post<CaseHearing>('/audiencias', data);
    return response.data;
  },

  // PUT /api/audiencias/{id}: Actualiza una audiencia
  async updateHearing(hearingId: string, data: Partial<CaseHearing>): Promise<CaseHearing> {
    const response = await api.put<CaseHearing>(`/audiencias/${hearingId}`, data);
    return response.data;
  },

  // DELETE /api/audiencias/{id}: Elimina una audiencia
  async deleteHearing(hearingId: string): Promise<void> {
    await api.delete(`/audiencias/${hearingId}`);
  }
};
