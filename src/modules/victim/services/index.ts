import { api } from '@/shared/services';
import { Report, CreateReportDto, VictimProfile } from '../types';

// Servicio para reportes de denuncias
export const reportService = {
  // POST /api/denuncias: Registra el incidente
  async createReport(data: CreateReportDto): Promise<Report> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('severity', data.severity);
    
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await api.post<Report>('/denuncias', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // GET /api/denuncias/mis-casos: Recupera el historial solo de esa víctima
  async getMyReports(): Promise<Report[]> {
    const response = await api.get<Report[]>('/denuncias/mis-casos');
    return response.data;
  },

  // GET /api/denuncias/:id: Obtiene detalles de un reporte
  async getReportById(id: string): Promise<Report> {
    const response = await api.get<Report>(`/denuncias/${id}`);
    return response.data;
  },

  // PUT /api/denuncias/:id: Actualiza un reporte
  async updateReport(id: string, data: Partial<CreateReportDto>): Promise<Report> {
    const response = await api.put<Report>(`/denuncias/${id}`, data);
    return response.data;
  },

  // DELETE /api/denuncias/:id: Elimina un reporte
  async deleteReport(id: string): Promise<void> {
    await api.delete(`/denuncias/${id}`);
  },

  // POST /api/evidencias/upload: Sube archivos a Azure Blob Storage
  async uploadEvidence(reportId: string, files: File[]): Promise<ReportAttachment[]> {
    const formData = new FormData();
    formData.append('reportId', reportId);
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await api.post<ReportAttachment[]>('/evidencias/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

// Servicio para perfil de víctima
export const victimService = {
  // GET /api/victimas/perfil: Obtiene el perfil de la víctima
  async getProfile(): Promise<VictimProfile> {
    const response = await api.get<VictimProfile>('/victimas/perfil');
    return response.data;
  },

  // PUT /api/victimas/perfil: Actualiza el perfil
  async updateProfile(data: Partial<VictimProfile>): Promise<VictimProfile> {
    const response = await api.put<VictimProfile>('/victimas/perfil', data);
    return response.data;
  }
};

interface ReportAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}
