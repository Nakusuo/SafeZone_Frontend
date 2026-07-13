import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { Report, Evaluation, LegalUpdate } from '@/shared/types'
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
  title?: string
  estado?: string
  tipoViolencia?: string
  violenceType?: string
  descripcion?: string
  description?: string
  nivelRiesgo?: string
  riskLevel?: string
  fechaDenuncia?: string
  createdAt?: string
  updatedAt?: string
  region?: BackendRegion
  direccion?: string
  location?: string
  latitud?: number
  longitud?: number
  precision?: number
  direccionManual?: string
  fuenteUbicacion?: string
  psychologistId?: string
  defenderId?: string
}

type CreateReportInput = Omit<Report, 'id' | 'victimId' | 'createdAt' | 'updatedAt'> & {
  location?: string
}

type BackendSeguimiento = {
  id: string
  denunciaid?: string
  profesionalid?: string
  tipo?: string
  notas?: string
  estadoanterior?: string
  estadonuevo?: string
  fechaActualizacion?: string
}

const getMockData = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    
  }

  return JSON.parse(JSON.stringify(mockData))
}

const saveMockData = (data: unknown) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    
  }
}

const mapType = (type?: string): Report['type'] => {
  switch ((type || '').toUpperCase()) {
    case 'PHYSICAL_VIOLENCE':
    case 'FISICA':
    case 'FÍSICA':
      return 'PHYSICAL_VIOLENCE'
    case 'PSYCHOLOGICAL_ABUSE':
    case 'PSICOLOGICA':
    case 'PSICOLÓGICA':
      return 'PSYCHOLOGICAL_ABUSE'
    case 'SEXUAL_VIOLENCE':
    case 'SEXUAL':
      return 'SEXUAL_VIOLENCE'
    case 'ECONOMIC_ABUSE':
    case 'ECONOMICA':
    case 'ECONÓMICA':
      return 'ECONOMIC_ABUSE'
    default:
      return 'OTHER'
  }
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

const fetchSeguimientos = async (reportId: string): Promise<BackendSeguimiento[]> => {
  const { data } = await apiClient.get<BackendSeguimiento[]>(`/seguimientos/denuncia/${reportId}`)
  return data ?? []
}

const mapBackendDenunciaToReport = (
  denuncia: BackendDenuncia,
  fallback?: Partial<Report> & { location?: string }
): Report => {
  const typeValue = denuncia.tipoViolencia || denuncia.violenceType || fallback?.type

  return {
    id: denuncia.id,
    victimId: denuncia.victimaId || denuncia.usuarioid,
    title: fallback?.title || denuncia.title || typeValue || 'Denuncia',
    description:
      denuncia.descripcion ||
      denuncia.description ||
      fallback?.description ||
      '',
    type: mapType(typeValue),
    status: mapStatus(denuncia.estado || fallback?.status),
    priority: mapPriority(denuncia.nivelRiesgo || denuncia.riskLevel || fallback?.priority),
    createdAt:
      denuncia.fechaDenuncia || denuncia.createdAt || new Date().toISOString(),
    updatedAt:
      denuncia.updatedAt || denuncia.fechaDenuncia || denuncia.createdAt || new Date().toISOString(),
    psychologistId: denuncia.psychologistId,
    defenderId: denuncia.defenderId,
    location: denuncia.direccion || denuncia.location || fallback?.location,
  }
}

export const reportService = {
  getVictimReports: async (victimId: string): Promise<Report[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports.filter((r: Report) => r.victimId === victimId)
    }

    const { data } = await apiClient.get<BackendDenuncia[]>(`/denuncias/listar?victimId=${victimId}`)
    return data.map((item) => mapBackendDenunciaToReport(item))
  },

  getAllReports: async (): Promise<Report[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports
    }

    const { data } = await apiClient.get<BackendDenuncia[]>('/denuncias/listar')
    return data.map((item) => mapBackendDenunciaToReport(item))
  },

  getReportById: async (reportId: string): Promise<Report | undefined> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().reports.find((r: Report) => r.id === reportId)
    }

    try {
      const { data } = await apiClient.get<BackendDenuncia>(`/denuncias/${reportId}`)
      return mapBackendDenunciaToReport(data)
    } catch {
      const { data } = await apiClient.get<BackendDenuncia>(`/denuncias/detalle/${reportId}`)
      return mapBackendDenunciaToReport(data)
    }
  },

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
      titulo: reportData.title,
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
    return mapBackendDenunciaToReport(data, reportData)
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
      tipoViolencia: updateData.type,
      descripcion: updateData.description,
      nivelRiesgo: updateData.priority,
      direccion: (updateData as any).location ?? (updateData as any).direccion,
    }

    try {
      const { data } = await apiClient.put<BackendDenuncia>(`/denuncias/violencia/${reportId}`, payload)
      return mapBackendDenunciaToReport(data, updateData)
    } catch {
      const { data } = await apiClient.get<BackendDenuncia>(`/denuncias/${reportId}`)
      return mapBackendDenunciaToReport({ ...data, ...updateData } as BackendDenuncia, updateData)
    }
  },

  getEvaluations: async (reportId: string): Promise<Evaluation[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().evaluations.filter((e: Evaluation) => e.reportId === reportId)
    }

    const seguimientos = await fetchSeguimientos(reportId)
    return seguimientos.map((s) => ({
      id: s.id,
      reportId,
      psychologistId: s.profesionalid || '',
      date: s.fechaActualizacion || new Date().toISOString(),
      diagnosis: s.notas || s.tipo || 'Evaluación registrada',
      notes: s.tipo || '',
      recommendations: [],
    }))
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
    return {
      id: `eval_${Date.now()}`,
      ...evaluationData,
      date: new Date().toISOString(),
    }
  },

  getLegalUpdates: async (reportId: string): Promise<LegalUpdate[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().legalUpdates.filter((l: LegalUpdate) => l.reportId === reportId)
    }

    const seguimientos = await fetchSeguimientos(reportId)
    return seguimientos.map((s) => ({
      id: s.id,
      reportId,
      defenderId: s.profesionalid || '',
      date: s.fechaActualizacion || new Date().toISOString(),
      status: s.estadonuevo || s.tipo || 'Actualización',
      notes: s.notas || '',
      nextHearing: undefined,
    }))
  },

  getCaseTimeline: async (reportId: string): Promise<import('@/components/Timeline').TimelineEvent[]> => {
    if (config.USE_MOCK) {
      await delay()
      const evaluations = getMockData().evaluations.filter((e: Evaluation) => e.reportId === reportId)
      const legalUpdates = getMockData().legalUpdates.filter((l: LegalUpdate) => l.reportId === reportId)

      const events: import('@/components/Timeline').TimelineEvent[] = [
        ...evaluations.map((e: Evaluation) => ({
          id: e.id,
          title: 'Evaluación Psicológica',
          description: e.diagnosis,
          date: e.date,
          status: 'completed' as const,
        })),
        ...legalUpdates.map((l: LegalUpdate) => ({
          id: l.id,
          title: 'Actualización Legal',
          description: l.notes,
          date: l.date,
          status: 'completed' as const,
        })),
      ]

      return events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    }

    const seguimientos = await fetchSeguimientos(reportId)
    return seguimientos.map((s) => ({
      id: s.id,
      title: s.tipo || 'Seguimiento de caso',
      description: [
        s.notas,
        s.estadonuevo ? `Estado: ${s.estadonuevo}` : undefined,
      ]
        .filter(Boolean)
        .join(' — ') || undefined,
      date: s.fechaActualizacion || new Date().toISOString(),
      status: 'completed' as const,
    }))
  },

  getAssignedCases: async (): Promise<Report[]> => {
    if (config.USE_MOCK) {
      await delay()
      // En modo mock, filtramos usando el ID del usuario guardado en la sesión
      const userStr = sessionStorage.getItem('user')
      if (!userStr) return []
      
      const currentUser = JSON.parse(userStr)
      
      return getMockData().reports.filter((r: Report) => 
        r.psychologistId === currentUser.id || r.defenderId === currentUser.id
      )
    }

    // Llamada real al nuevo endpoint de Spring Boot
    const { data } = await apiClient.get<BackendDenuncia[]>('/denuncias/mis-casos')
    return data.map((item) => mapBackendDenunciaToReport(item))
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
    return {
      id: `legal_${Date.now()}`,
      ...updateData,
      date: new Date().toISOString(),
    }
  },
}