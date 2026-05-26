import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { Report, Evaluation, LegalUpdate } from '@/shared/types'
import mockData from '@/data/mockData.json'

const delay = (ms = config.MOCK_DELAY) => new Promise((r) => setTimeout(r, ms))
const STORAGE_KEY = 'safezone_appdata'

const getMockData = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return JSON.parse(JSON.stringify(mockData))
}

const saveMockData = (data: unknown) => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

const mapDenunciaToReport = (d: any): Report => ({
  ...d,
  id: d.id,
  victimId: d.victimaId ?? d.usuarioid,
  status: d.estado,
  description: d.descripcion,
  violenceType: d.tipoViolencia,
  riskLevel: d.nivelRiesgo,
  location: d.direccion,
  createdAt: d.fechaDenuncia,
  updatedAt: d.fechaDenuncia,
})

export const reportService = {
  getVictimReports: async (victimId: string): Promise<Report[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports.filter((r: Report) => r.victimId === victimId)
    }

    const { data } = await apiClient.get<any[]>(`/denuncias/${victimId}`)
    return data.map(mapDenunciaToReport)
  },

  getAllReports: async (): Promise<Report[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports
    }

    const { data } = await apiClient.get<any[]>('/denuncias/listar')
    return data.map(mapDenunciaToReport)
  },

  getReportById: async (reportId: string): Promise<Report | undefined> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports.find((r: Report) => r.id === reportId)
    }

    const { data } = await apiClient.get<any>(`/denuncias/detalle/${reportId}`)
    return mapDenunciaToReport(data)
  },

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

    const payload = {
      usuarioid: victimId,
      victimaId: victimId,
      descripcion: (reportData as any).description,
      tipoViolencia: (reportData as any).violenceType ?? 'PSICOLOGICA',
      nivelRiesgo: (reportData as any).riskLevel ?? 'MEDIO',
      direccion: (reportData as any).location ?? 'Lima',
      esAnonima: false,
      region: {
        id: '15',
        nombre: 'Lima',
      },
    }

    const { data } = await apiClient.post<any>('/denuncias/guardar', payload)
    return mapDenunciaToReport(data)
  },

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

    const payload = {
      tipoViolencia: (updateData as any).violenceType ?? (updateData as any).tipoViolencia,
      descripcion: (updateData as any).description ?? (updateData as any).descripcion,
      nivelRiesgo: (updateData as any).riskLevel ?? (updateData as any).nivelRiesgo,
      direccion: (updateData as any).location ?? (updateData as any).direccion,
    }

    const { data } = await apiClient.put<any>(`/denuncias/violencia/${reportId}`, payload)
    return mapDenunciaToReport(data)
  },

  getEvaluations: async (reportId: string): Promise<Evaluation[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().evaluations.filter((e: Evaluation) => e.reportId === reportId)
    }
    const { data } = await apiClient.get<Evaluation[]>(`/reports/${reportId}/evaluations`)
    return data
  },

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

  getLegalUpdates: async (reportId: string): Promise<LegalUpdate[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().legalUpdates.filter((l: LegalUpdate) => l.reportId === reportId)
    }
    const { data } = await apiClient.get<LegalUpdate[]>(`/reports/${reportId}/legal-updates`)
    return data
  },

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