import { localStorageService } from './localStorage'

export interface Report {
  id: string
  victimId: string
  title: string
  description: string
  type: 'PHYSICAL_VIOLENCE' | 'PSYCHOLOGICAL_ABUSE' | 'OTHER'
  status: 'PENDING' | 'UNDER_EVALUATION' | 'IN_FOLLOW_UP' | 'RESOLVED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  updatedAt: string
  psychologistId?: string
  defenderId?: string
}

export interface Evaluation {
  id: string
  reportId: string
  psychologistId: string
  date: string
  diagnosis: string
  notes: string
  recommendations: string[]
}

export interface LegalUpdate {
  id: string
  reportId: string
  defenderId: string
  date: string
  status: string
  nextHearing?: string
  notes: string
}

export const reportService = {
  // Reportes
  getVictimReports: async (victimId: string): Promise<Report[]> => {
    return (await localStorageService.getReports(victimId)) as Report[]
  },

  getAllReports: async (): Promise<Report[]> => {
    return (await localStorageService.getReports()) as Report[]
  },

  getReportById: async (reportId: string): Promise<Report | undefined> => {
    return (await localStorageService.getReportById(reportId)) as Report | undefined
  },

  createReport: async (victimId: string, reportData: Omit<Report, 'id' | 'victimId' | 'createdAt' | 'updatedAt'>): Promise<Report> => {
    return localStorageService.createReport({
      victimId,
      ...reportData,
    })
  },

  updateReport: async (reportId: string, updateData: Partial<Report>): Promise<Report> => {
    return (await localStorageService.updateReport(reportId, updateData)) as Report
  },

  // Evaluaciones
  getReportEvaluations: async (reportId: string): Promise<Evaluation[]> => {
    return localStorageService.getEvaluations(reportId)
  },

  createEvaluation: async (evaluationData: Omit<Evaluation, 'id' | 'date'>): Promise<Evaluation> => {
    return localStorageService.createEvaluation(evaluationData)
  },

  // Actualizaciones legales
  getReportLegalUpdates: async (reportId: string): Promise<LegalUpdate[]> => {
    return localStorageService.getLegalUpdates(reportId)
  },

  createLegalUpdate: async (updateData: Omit<LegalUpdate, 'id' | 'date'>): Promise<LegalUpdate> => {
    return localStorageService.createLegalUpdate(updateData)
  },
}
