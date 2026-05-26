import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { Report, Evaluation, LegalUpdate } from '@/shared/types'

// ============================================================
// Report Service
// USE_MOCK=true  → usa sessionStorage
// USE_MOCK=false → llama al backend Spring Boot
// ============================================================

import mockData from '@/data/mockData.json'

const delay = (ms = config.MOCK_DELAY) => new Promise((r) => setTimeout(r, ms))
const STORAGE_KEY = 'safezone_appdata'

type BackendRegion = {
  id: string
  nombre?: string
}

type BackendDenuncia = {
  id: string
  usuarioid: string
  victimaId: string
  estado?: string
  tipoViolencia?: string
  descripcion?: string
  nivelRiesgo?: string
  fechaDenuncia?: string
  region?: BackendRegion
  direccion?: string
  latitud?: number
  longitud?: number
  precision?: number
  direccionManual?: string
  fuenteUbicacion?: string
}

type CreateReportInput = Omit<Report, 'id' | 'victimId' | 'createdAt' | 'updatedAt'> & {
  location?: string
}

const getMockData = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* empty */ }
  return JSON.parse(JSON.stringify(mockData))
}

const saveMockData = (data: unknown) => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* empty */ }
}

const mapPriority = (nivelRiesgo?: string): Report['priority'] => {
  switch ((nivelRiesgo || '').toUpperCase()) {
    case 'HIGH':
    case 'ALTO':
      return 'HIGH'
    case 'MEDIUM':
    case 'MEDIO':
      return 'MEDIUM'
    case 'CRITICAL':
      return 'CRITICAL'
    default:
      return 'LOW'
  }
}

const mapStatus = (estado?: string): Report['status'] => {
  switch ((estado || '').toUpperCase()) {
    case 'RESUELTO':
    case 'RESOLVED':
      return 'RESOLVED'
    case 'EN_SEGUIMIENTO':
    case 'FOLLOW_UP':
    case 'IN_FOLLOW_UP':
      return 'IN_FOLLOW_UP'
    case 'EN_EVALUACION':
    case 'UNDER_EVALUATION':
      return 'UNDER_EVALUATION'
    case 'CERRADO':
    case 'CLOSED':
      return 'CLOSED'
    default:
      return 'PENDING'
  }
}

const mapBackendDenunciaToReport = (denuncia: BackendDenuncia): Report => ({
  id: denuncia.id,
  victimId: denuncia.victimaId || denuncia.usuarioid,
  title: denuncia.tipoViolencia || 'Denuncia',
  description: denuncia.descripcion || '',
  type: (denuncia.tipoViolencia as Report['type']) || 'OTHER',
  status: mapStatus(denuncia.estado),
  priority: mapPriority(denuncia.nivelRiesgo),
  createdAt: denuncia.fechaDenuncia || new Date().toISOString(),
  updatedAt: denuncia.fechaDenuncia || new Date().toISOString(),
})

export const reportService = {
  /**
   * Denuncias de una víctima específica.
   * Spring: GET /api/reports?victimId={id}
   */
  getVictimReports: async (victimId: string): Promise<Report[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports.filter((r: Report) => r.victimId === victimId)
    }
    const { data } = await apiClient.get<BackendDenuncia[]>(`/denuncias/${victimId}`)
    return data.map(mapBackendDenunciaToReport)
  },

  /**
   * Todas las denuncias (admin / psicólogo / defensor).
   * Spring: GET /api/reports
   */
  getAllReports: async (): Promise<Report[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports
    }
    const { data } = await apiClient.get<BackendDenuncia[]>('/denuncias/listar')
    return data.map(mapBackendDenunciaToReport)
  },

  /**
   * Detalle de una denuncia.
   * Spring: GET /api/reports/{id}
   */
  getReportById: async (reportId: string): Promise<Report | undefined> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports.find((r: Report) => r.id === reportId)
    }
    const { data } = await apiClient.get<BackendDenuncia>(`/denuncias/${reportId}`)
    return mapBackendDenunciaToReport(data)
  },

  /**
   * Crear una nueva denuncia.
   * Spring: POST /api/reports
   */
  createReport: async (
    victimId: string,
    reportData: CreateReportInput
  ): Promise<Report> => {
    if (config.USE_MOCK) {
      await delay()
      const appData = getMockData()
      const newReport: Report = {
        id: `report_${Date.now()}`,
        victimId,
        ...reportData,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      appData.reports.push(newReport)
      saveMockData(appData)
      return newReport
    }
    const region = { id: '15', nombre: 'Lima' }
    const backendPayload = {
      usuarioid: victimId,
      victimaId: victimId,
      tipoViolencia: reportData.type,
      descripcion: `${reportData.title}\n\n${reportData.description}`,
      nivelRiesgo: reportData.priority,
      direccion: reportData.location || '',
      esAnonima: false,
      region,
      direccionManual: reportData.location,
      fuenteUbicacion: reportData.location ? 'MANUAL' : 'DESCONOCIDA',
    }
    const { data } = await apiClient.post<BackendDenuncia>('/denuncias/guardar', backendPayload)
    return mapBackendDenunciaToReport(data)
  },

  /**
   * Actualizar estado o datos de un reporte.
   * Spring: PUT /api/reports/{id}
   */
  updateReport: async (reportId: string, updateData: Partial<Report>): Promise<Report> => {
    if (config.USE_MOCK) {
      await delay()
      const appData = getMockData()
      const report = appData.reports.find((r: Report) => r.id === reportId)
      if (!report) throw new Error('Reporte no encontrado')
      Object.assign(report, updateData, { updatedAt: new Date().toISOString() })
      saveMockData(appData)
      return report
    }
    const { data } = await apiClient.get<BackendDenuncia>(`/denuncias/${reportId}`)
    return mapBackendDenunciaToReport({ ...data, ...updateData } as BackendDenuncia)
  },

  // ── Evaluaciones ──────────────────────────────────────────────

  /**
   * Spring: GET /api/reports/{reportId}/evaluations
   */
  getEvaluations: async (reportId: string): Promise<Evaluation[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().evaluations.filter((e: Evaluation) => e.reportId === reportId)
    }
    return []
  },

  /**
   * Spring: POST /api/reports/{reportId}/evaluations
   */
  createEvaluation: async (
    evaluationData: Omit<Evaluation, 'id' | 'date'>
  ): Promise<Evaluation> => {
    if (config.USE_MOCK) {
      await delay()
      const appData = getMockData()
      const newEval: Evaluation = {
        id: `eval_${Date.now()}`,
        ...evaluationData,
        date: new Date().toISOString(),
      }
      appData.evaluations.push(newEval)
      saveMockData(appData)
      return newEval
    }
    return {
      id: `eval_${Date.now()}`,
      ...evaluationData,
      date: new Date().toISOString(),
    }
  },

  // ── Actualizaciones legales ────────────────────────────────────

  /**
   * Spring: GET /api/reports/{reportId}/legal-updates
   */
  getLegalUpdates: async (reportId: string): Promise<LegalUpdate[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().legalUpdates.filter((l: LegalUpdate) => l.reportId === reportId)
    }
    return []
  },

  /**
   * Spring: POST /api/reports/{reportId}/legal-updates
   */
  createLegalUpdate: async (
    updateData: Omit<LegalUpdate, 'id' | 'date'>
  ): Promise<LegalUpdate> => {
    if (config.USE_MOCK) {
      await delay()
      const appData = getMockData()
      const newUpdate: LegalUpdate = {
        id: `legal_${Date.now()}`,
        ...updateData,
        date: new Date().toISOString(),
      }
      appData.legalUpdates.push(newUpdate)
      saveMockData(appData)
      return newUpdate
    }
    return {
      id: `legal_${Date.now()}`,
      ...updateData,
      date: new Date().toISOString(),
    }
  },
}
