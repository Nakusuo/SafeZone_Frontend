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
    const { data } = await apiClient.get<any[]>(`/denuncias/${victimId}`)

  return data.map((d) => ({
    id: d.id,
    victimId: d.victimaId,
    title: d.direccion,
    description: d.descripcion,
    type: d.tipoViolencia,
    status:
  d.estado === 'PENDIENTE'
    ? 'PENDING'
    : d.estado === 'ASIGNADO'
    ? 'UNDER_EVALUATION'
    : d.estado,
    priority: d.nivelRiesgo,
    createdAt: d.fechaDenuncia,
    updatedAt: d.fechaDenuncia
  }))
    
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
    const { data } = await apiClient.get<any[]>('/denuncias/listar')

  return data.map((d) => ({
    id: d.id,
    victimId: d.victimaId,
    title: d.direccion,
    description: d.descripcion,
    type: d.tipoViolencia,
    status:
  d.estado === 'PENDIENTE'
    ? 'PENDING'
    : d.estado === 'ASIGNADO'
    ? 'UNDER_EVALUATION'
    : d.estado,
    priority: d.nivelRiesgo,
    createdAt: d.fechaDenuncia,
    updatedAt: d.fechaDenuncia
  }))
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
    const { data } = await apiClient.get<Report>(`/reports/${reportId}`)
    return data
  },

  /**
   * Crear una nueva denuncia.
   * Spring: POST /api/reports
   */
  createReport: async (
    victimId: string,
    reportData: Omit<Report, 'id' | 'victimId' | 'createdAt' | 'updatedAt'>
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
    const storedUser = sessionStorage.getItem("user")

    if (!storedUser) {
      throw new Error("Usuario no autenticado")
    }

    const user = JSON.parse(storedUser)

    console.log(sessionStorage.getItem("user"))

    const payload = {
      usuarioid: user.id,
      victimaId: user.id,
      tipoViolencia: reportData.type,
      descripcion: reportData.description,
      nivelRiesgo: reportData.priority,
      direccion: reportData.title,
      esAnonima: false,

      region: {
        id: "1",
        nombre: "Amazonas"
      }
    }

    console.log("📤 REPORT PAYLOAD:", payload)

    const { data } = await apiClient.post('/denuncias/guardar', payload)

    return data
    
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
    const { data } = await apiClient.put<Report>(`/reports/${reportId}`, updateData)
    return data
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
    const { data } = await apiClient.get<Evaluation[]>(`/reports/${reportId}/evaluations`)
    return data
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
    const { data } = await apiClient.post<Evaluation>(
      `/reports/${evaluationData.reportId}/evaluations`,
      evaluationData
    )
    return data
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
    const { data } = await apiClient.get<LegalUpdate[]>(`/reports/${reportId}/legal-updates`)
    return data
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
    const { data } = await apiClient.post<LegalUpdate>(
      `/reports/${updateData.reportId}/legal-updates`,
      updateData
    )
    return data
  },
  
}
