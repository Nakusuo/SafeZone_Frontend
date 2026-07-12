import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { TriageCase, TriageAssignment, TriageMetrics, AdminUser } from '@/shared/types'


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
    description: 'Golpizas repetidas, patrón recurrentes',
    location: 'San José', submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    assignedTo: { psychologist: 'Dra. María García', legalDefender: 'Lic. Ana Martínez' },
    notes: 'Tercera denuncia en 6 meses',
  },
]

const MOCK_PROFESSIONALS = {
  psychologists: [
    { id: 'psy-001', name: 'Dra. María García', email: 'maria.garcia@safezone.cr', caseCount: 3, available: true },
    { id: 'psy-002', name: 'Dr. José López', email: 'jose.lopez@safezone.cr', caseCount: 5, available: true },
    { id: 'psy-003', name: 'Dra. Carmen Ruiz', email: 'carmen.ruiz@safezone.cr', caseCount: 4, available: false },
  ],
  defenders: [
    { id: 'def-001', name: 'Lic. Ana Martínez', email: 'ana.martinez@safezone.cr', caseCount: 2, available: true },
    { id: 'def-002', name: 'Lic. Roberto Díaz', email: 'roberto.diaz@safezone.cr', caseCount: 4, available: true },
    { id: 'def-003', name: 'Lic. Francisco Vega', email: 'francisco.vega@safezone.cr', caseCount: 6, available: false },
  ],
}

const mapUsuarioToProfessional = (user: any) => {
  console.log("Usuario recibido del backend:", user);
  
  let nombreCompleto = 'Sin nombre' // <-- Asegúrate de que use 'let', NO 'String'
  if (user.nombre || user.apellido) {
    nombreCompleto = `${user.nombre || ''} ${user.apellido || ''}`.trim()
  } else if (user.name) {
    nombreCompleto = user.name
  }

  return {
  id: String(user.id ?? user.usuarioid ?? ''),
  name: nombreCompleto,
  email: user.email || '',
  caseCount: 0, 
  available: true // <-- Forzamos true temporalmente para asegurar que el dropdown los pinte
}
}
const delay = (ms = config.MOCK_DELAY) => new Promise((r) => setTimeout(r, ms))

const unwrapApiResponse = <T>(response: any): T => {
  if (!response) return response
  if (response.data && response.data.data !== undefined) return response.data.data
  if (response.data !== undefined) return response.data
  return response
}

export const triageService = {
  getPendingCases: async (): Promise<TriageCase[]> => {
    if (config.USE_MOCK) { await delay(); return [...MOCK_CASES] }
    const { data } = await apiClient.get<any[]>('/denuncias/listar')

    return data.map((d) => ({
      id: d.id,
      reportId: d.id,
      victimName: d.usuario?.nombre ? `${d.usuario.nombre} ${d.usuario.apellido || ''}`.trim() : 'Víctima',
      victimEmail: d.usuario?.email || 'Sin correo',
      incidentType:
        d.tipoViolencia === 'PHYSICAL_VIOLENCE' || d.tipoViolencia === 'VIOLENCIAFISICA'
          ? 'physical'
          : d.tipoViolencia === 'PSYCHOLOGICAL_ABUSE' || d.tipoViolencia === 'PSICOLOGICA'
          ? 'psychological'
          : d.tipoViolencia === 'SEXUAL_VIOLENCE'
          ? 'sexual'
          : 'other',
      priority:
        d.nivelRiesgo === 'HIGH' || d.nivelRiesgo === 'ALTO'
          ? 'critical'
          : d.nivelRiesgo === 'MEDIUM' || d.nivelRiesgo === 'MEDIO'
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
      // Mapeo dinámico por si tu backend ya envía los nombres asignados desnormalizados
      assignedTo: (d.psicologoId || d.defensorLegalId) 
        ? {
            psychologist: d.psicologoNombre || 'Asignado',
            legalDefender: d.defensorLegalNombre || 'Asignado',
          }
        : null,
      notes: d.descripcion || ''
    }))
  },

  // Detalle de un caso — Spring: GET /api/admin/cases/{id}
  getCaseDetail: async (caseId: string): Promise<TriageCase> => {
    if (config.USE_MOCK) { await delay(200); return MOCK_CASES.find(c => c.id === caseId) ?? MOCK_CASES[0] }
    const { data } = await apiClient.get<TriageCase>(`/admin/cases/${caseId}`)
    return data
  },

  // Asignar psicólogo y defensor a un caso — Spring: POST /api/admin/cases/{id}/assign
 assignCase: async (assignment: any): Promise<TriageCase> => {
    // Definimos el payload estandarizado para ambos mundos (Mock y Real)
    const payload = {
      psicologoId: assignment.psicologoId,
      defensorLegalId: assignment.defensorLegalId,
      asignadoPorId: assignment.asignadoPorId || 'current-user-id',
      prioridad: assignment.prioridad,
    };

    if (config.USE_MOCK) {
      await delay();
      const c = MOCK_CASES.find((c) => c.id === assignment.caseId);
      if (c) {
        c.status = 'assigned';
        c.assignedTo = {
          psychologist: MOCK_PROFESSIONALS.psychologists.find((p) => p.id === payload.psicologoId)?.name ?? 'Asignado',
          legalDefender: MOCK_PROFESSIONALS.defenders.find((d) => d.id === payload.defensorLegalId)?.name ?? 'Asignado',
        };
      }
      return c ?? MOCK_CASES[0];
    }

    // 🚨 AQUÍ ESTÁ LA CORRECCIÓN: El objeto payload tiene los nombres exactos que espera el DTO
    console.log("Enviando al backend:", payload);
    
    const response = await apiClient.patch(
      `/denuncias/${assignment.caseId}/asignar`,
      payload 
    );
    
    const d = unwrapApiResponse<any>(response);
    
    // Retornamos el objeto mapeado
    return {
      id: d.id,
      reportId: d.id,
      victimName: d.usuario?.nombre ? `${d.usuario.nombre} ${d.usuario.apellido || ''}`.trim() : 'Víctima',
      victimEmail: d.usuario?.email || 'Sin correo',
      incidentType: 'physical', 
      priority: payload.prioridad as any,
      status: 'assigned',
      description: d.descripcion,
      location: d.direccion,
      submittedAt: d.fechaDenuncia,
      assignedTo: {
        psychologist: d.psicologoNombre || 'Asignado',
        legalDefender: d.defensorLegalNombre || 'Asignado',
      },
      notes: ''
    } as TriageCase;
  },

  
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

// Profesionales disponibles para asignar — Spring: GET /api/usuarios/psyphocolyst y GET /api/usuarios/defender
export const adminProfessionalService = {
  getAvailablePsychologists: async () => {
    if (config.USE_MOCK) {
      await delay(200)
      return MOCK_PROFESSIONALS.psychologists
    }
    const response = await apiClient.get<any>('/usuarios/psyphocolyst')
    const data = unwrapApiResponse<any>(response)
    
    // 🚨 SOLUCIÓN: Convertimos la data a arreglo antes de iterar
    // Busca en data.content (típico de Spring), data.data, o envuelve el objeto en un array
    const dataArray = Array.isArray(data) 
      ? data 
      : (data?.content || data?.data || (data && typeof data === 'object' ? [data] : []));
      
    return dataArray.map(mapUsuarioToProfessional)
  },

  getAvailableDefenders: async () => {
    if (config.USE_MOCK) {
      await delay(200)
      return MOCK_PROFESSIONALS.defenders
    }
    const response = await apiClient.get<any>('/usuarios/defender')
    const data = unwrapApiResponse<any>(response)
    
    // 🚨 SOLUCIÓN: Misma validación para defensores
    const dataArray = Array.isArray(data) 
      ? data 
      : (data?.content || data?.data || (data && typeof data === 'object' ? [data] : []));
      
    return dataArray.map(mapUsuarioToProfessional)
  },
}


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