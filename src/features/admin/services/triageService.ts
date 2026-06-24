import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { TriageCase, TriageAssignment, TriageMetrics, AdminUser } from '@/shared/types'

// Datos de prueba para modo mock
const MOCK_CASES: TriageCase[] = [
  {
    id: 'CASE-001', reportId: 'RPT-2026-001',
    victimName: 'María González López', victimEmail: 'maria.gonzalez@example.com',
    incidentType: 'physical', priority: 'critical', status: 'new',
    description: 'Violencia doméstica con lesiones graves en cara y brazos',
    location: 'San José', submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    assignedTo: null, notes: 'Requiere atención urgente, víctima en refugio temporal',
  },
  {
    id: 'CASE-002', reportId: 'RPT-2026-002',
    victimName: 'Ana Rodríguez', victimEmail: 'ana.rodriguez@example.com',
    incidentType: 'psychological', priority: 'high', status: 'new',
    description: 'Abuso emocional y control coercitivo por pareja',
    location: 'Cartago', submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    assignedTo: null, notes: 'Requiere evaluación clínica urgente',
  },
  {
    id: 'CASE-003', reportId: 'RPT-2026-003',
    victimName: 'Laura Jiménez', victimEmail: 'laura.jimenez@example.com',
    incidentType: 'sexual', priority: 'critical', status: 'new',
    description: 'Agresión sexual en zona urbana',
    location: 'Heredia', submittedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    assignedTo: null, notes: 'Examen forense pendiente',
  },
  {
    id: 'CASE-004', reportId: 'RPT-2026-004',
    victimName: 'Patricia Sánchez', victimEmail: 'patricia.sanchez@example.com',
    incidentType: 'legal', priority: 'medium', status: 'new',
    description: 'Disputa de custodia con antecedentes de negligencia',
    location: 'Alajuela', submittedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    assignedTo: null, notes: 'Requiere coordinación legal y psicológica',
  },
  {
    id: 'CASE-005', reportId: 'RPT-2026-005',
    victimName: 'Rosa Fernández', victimEmail: 'rosa.fernandez@example.com',
    incidentType: 'physical', priority: 'high', status: 'assigned',
    description: 'Golpizas repetidas, patrón recurrente',
    location: 'San José', submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    assignedTo: { psychologist: 'Dra. María García', legalDefender: 'Lic. Ana Martínez' },
    notes: 'Tercera denuncia en 6 meses',
  },
]

const delay = (ms = config.MOCK_DELAY) => new Promise((r) => setTimeout(r, ms))

export const triageService = {
  // Casos pendientes de asignar — Spring: GET /api/admin/cases/pending
  getPendingCases: async (): Promise<TriageCase[]> => {
    if (config.USE_MOCK) { await delay(); return [...MOCK_CASES] }
    const { data } = await apiClient.get<any[]>('/denuncias/listar')

return data.map((d) => ({
  id: d.id,
  reportId: d.id,

  victimName: d.usuario?.nombre || 'Víctima',
  victimEmail: d.usuario?.email || 'Sin correo',

  incidentType:
    d.tipoViolencia === 'PHYSICAL_VIOLENCE'
      ? 'physical'
      : d.tipoViolencia === 'PSYCHOLOGICAL_ABUSE'
      ? 'psychological'
      : d.tipoViolencia === 'SEXUAL_VIOLENCE'
      ? 'sexual'
      : 'other',

  priority:
    d.nivelRiesgo === 'HIGH'
      ? 'critical'
      : d.nivelRiesgo === 'MEDIUM'
      ? 'high'
      : 'medium',

  status:
    d.estado === 'PENDIENTE'
      ? 'new'
      : d.estado === 'ASIGNADO'
      ? 'assigned'
      : 'in-progress',

  description: d.descripcion,
  location: d.direccion,
  submittedAt: d.fechaDenuncia,

  assignedTo: null,
  notes: ''
}))
  },

  // Detalle de un caso — Spring: GET /api/admin/cases/{id}
  getCaseDetail: async (caseId: string): Promise<TriageCase> => {
    if (config.USE_MOCK) { await delay(200); return MOCK_CASES.find(c => c.id === caseId) ?? MOCK_CASES[0] }
    const { data } = await apiClient.get<TriageCase>(`/admin/cases/${caseId}`)
    return data
  },

  // Asignar psicólogo y defensor a un caso — Spring: POST /api/admin/cases/{id}/assign
  assignCase: async (assignment: TriageAssignment): Promise<TriageCase> => {
    if (config.USE_MOCK) {
      await delay()
      const c = MOCK_CASES.find(c => c.id === assignment.caseId)
      if (c) { c.status = 'assigned'; c.assignedTo = { psychologist: 'Asignado', legalDefender: 'Asignado' } }
      return c ?? MOCK_CASES[0]
    }
    const { data } = await apiClient.patch<TriageCase>(
  `/denuncias/${assignment.caseId}/asignar`,
  {
    psicologoId: assignment.psychologistId,
    defensorLegalId: assignment.defenderLegalId,
    asignadoPorId: assignment.assignedBy,
    prioridad: assignment.priority,
  }  )
    return data
  },

  // Cambiar estado de un caso — Spring: PATCH /api/admin/cases/{id}/status
  updateCaseStatus: async (caseId: string, status: string, notes?: string): Promise<TriageCase> => {
    if (config.USE_MOCK) {
      await delay(200)
      const c = MOCK_CASES.find(c => c.id === caseId)
      if (c) { c.status = status as any; if (notes) c.notes = notes }
      return c ?? MOCK_CASES[0]
    }
    const { data } = await apiClient.patch<TriageCase>(`/admin/cases/${caseId}/status`, { status, notes })
    return data
  },

  // Métricas del dashboard admin — Spring: GET /api/admin/metrics
  getMetrics: async (): Promise<TriageMetrics> => {
    if (config.USE_MOCK) {
      await delay(200)
      return {
        totalPending: MOCK_CASES.filter(c => c.status === 'new').length,
        totalAssigned: MOCK_CASES.filter(c => c.status === 'assigned').length,
        criticalCases: MOCK_CASES.filter(c => c.priority === 'critical').length,
        casesByType: { physical: 2, psychological: 1, sexual: 1, legal: 1, other: 0 },
      }
    }
    const reports = await triageService.getPendingCases()

    return {
      totalPending: reports.filter(c => c.status === 'new').length,

      totalAssigned: reports.filter(c => c.status === 'assigned').length,

      criticalCases: reports.filter(c => c.priority === 'critical').length,

      casesByType: {
        physical: reports.filter(c => c.incidentType === 'physical').length,

        psychological: reports.filter(c => c.incidentType === 'psychological').length,

        sexual: reports.filter(c => c.incidentType === 'sexual').length,

        legal: reports.filter(c => c.incidentType === 'legal').length,

        other: reports.filter(c => c.incidentType === 'other').length,
      }
    }
  },
}

// Profesionales disponibles para asignar — Spring: GET /api/admin/professionals
export const adminProfessionalService = {
  getAvailablePsychologists: async () => {
    // Corregido al endpoint real del controlador
    const { data } = await apiClient.get('/usuarios/psyphocolyst'); 
    return data;
  },

  getAvailableDefenders: async () => {
    // Corregido al endpoint real del controlador
    const { data } = await apiClient.get('/usuarios/defender');
    return data;
  },
}

// CRUD de usuarios administrativos — Spring: /api/admin/users
export const adminUserService = {
  getAdmins: async (): Promise<AdminUser[]> => {
    if (config.USE_MOCK) {
      await delay()
      return [
        { id: 'admin-001', email: 'admin1@safezone.cr', name: 'Carlos Rodríguez', role: 'admin', region: 'Nacional', active: true },
        { id: 'admin-002', email: 'admin2@safezone.cr', name: 'Elena Sánchez', role: 'admin', region: 'Nacional', active: true },
        { id: 'gestor-001', email: 'gestor.sj@safezone.cr', name: 'Laura Gestora', role: 'gestor', region: 'San José', active: true },
      ]
    }
    const { data } = await apiClient.get<AdminUser[]>('/admin/users')
    return data
  },

  createAdmin: async (adminData: Partial<AdminUser>): Promise<AdminUser> => {
    if (config.USE_MOCK) {
      await delay()
      return { id: `admin-${Date.now()}`, email: adminData.email ?? '', name: adminData.name ?? '', role: 'admin', region: adminData.region ?? 'Nacional', active: true }
    }
    const { data } = await apiClient.post<AdminUser>('/admin/users', adminData)
    return data
  },

  updateAdmin: async (adminId: string, adminData: Partial<AdminUser>): Promise<AdminUser> => {
    if (config.USE_MOCK) {
      await delay()
      return { id: adminId, email: adminData.email ?? '', name: adminData.name ?? '', role: adminData.role ?? 'admin', region: adminData.region ?? 'Nacional', active: adminData.active ?? true }
    }
    const { data } = await apiClient.put<AdminUser>(`/admin/users/${adminId}`, adminData)
    return data
  },

  deactivateAdmin: async (adminId: string): Promise<AdminUser> => {
    if (config.USE_MOCK) {
      await delay()
      return { id: adminId, email: '', name: 'Desactivado', role: 'admin', region: 'Nacional', active: false }
    }
    const { data } = await apiClient.patch<AdminUser>(`/admin/users/${adminId}/deactivate`)
    return data
  },
}
