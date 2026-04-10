// Admin services - Gestión de triaje y asignaciones

import { api } from '@/shared/services/api';
import type { TriageCase, TriageAssignment, TriageMetrics, AdminUser } from '../types';

// Mock Data
const MOCK_PENDING_CASES: TriageCase[] = [
  {
    id: 'CASE-001',
    reportId: 'RPT-2026-001',
    victimName: 'María González López',
    victimEmail: 'maria.gonzalez@example.com',
    incidentType: 'physical',
    priority: 'critical',
    status: 'new',
    description: 'Violencia doméstica con lesiones graves en cara y brazos',
    location: 'San José, Provincia de San José',
    submittedAt: new Date(Date.now() - 2 * 60 * 60000),
    assignedTo: null,
    notes: 'Requiere atención urgente, víctima en refugio temporal',
  },
  {
    id: 'CASE-002',
    reportId: 'RPT-2026-002',
    victimName: 'Ana Rodríguez',
    victimEmail: 'ana.rodriguez@example.com',
    incidentType: 'psychological',
    priority: 'high',
    status: 'new',
    description: 'Abuso emocional y control coercitivo por pareja',
    location: 'Cartago, Provincia de Cartago',
    submittedAt: new Date(Date.now() - 5 * 60 * 60000),
    assignedTo: null,
    notes: 'Caso de control psicológico, requiere evaluación clínica',
  },
  {
    id: 'CASE-003',
    reportId: 'RPT-2026-003',
    victimName: 'Laura Jiménez',
    victimEmail: 'laura.jimenez@example.com',
    incidentType: 'sexual',
    priority: 'critical',
    status: 'new',
    description: 'Agresión sexual en zona urbana',
    location: 'Heredia, Provincia de Heredia',
    submittedAt: new Date(Date.now() - 1 * 60 * 60000),
    assignedTo: null,
    notes: 'Recolección de evidencia en proceso, examen forense pendiente',
  },
  {
    id: 'CASE-004',
    reportId: 'RPT-2026-004',
    victimName: 'Patricia Sánchez',
    victimEmail: 'patricia.sanchez@example.com',
    incidentType: 'legal',
    priority: 'medium',
    status: 'new',
    description: 'Disputa de custodia con antecedentes de negligencia',
    location: 'Alajuela, Provincia de Alajuela',
    submittedAt: new Date(Date.now() - 8 * 60 * 60000),
    assignedTo: null,
    notes: 'Caso complejo, requiere coordinación legal y psicológica',
  },
  {
    id: 'CASE-005',
    reportId: 'RPT-2026-005',
    victimName: 'Rosa Fernández',
    victimEmail: 'rosa.fernandez@example.com',
    incidentType: 'physical',
    priority: 'high',
    status: 'new',
    description: 'Golpizas repetidas, patrón de violencia recurrente',
    location: 'San José, Provincia de San José',
    submittedAt: new Date(Date.now() - 12 * 60 * 60000),
    assignedTo: null,
    notes: 'Tercera denuncia en 6 meses, evaluar alto riesgo',
  },
];

// Triage Case Management
export const triageService = {
  // Obtener casos pendientes de asignación
  getPendingCases: async (): Promise<TriageCase[]> => {
    // Mock: Retornar datos sin esperar backend
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_PENDING_CASES);
      }, 300);
    });
  },

  // Obtener un caso específico
  getCaseDetail: async (caseId: string): Promise<TriageCase> => {
    const caseData = MOCK_PENDING_CASES.find(c => c.id === caseId) || MOCK_PENDING_CASES[0];
    return new Promise(resolve => setTimeout(() => resolve(caseData), 200));
  },

  // Actualizar estado de un caso
  updateCaseStatus: async (
    caseId: string,
    status: string,
    notes?: string
  ): Promise<TriageCase> => {
    const updated = MOCK_PENDING_CASES.find(c => c.id === caseId);
    if (updated) {
      updated.status = status as any;
      updated.notes = notes || updated.notes;
    }
    return new Promise(resolve => setTimeout(() => resolve(updated!), 200));
  },

  // Asignar caso a profesionales
  assignCase: async (assignment: TriageAssignment): Promise<TriageCase> => {
    const caseData = MOCK_PENDING_CASES.find(c => c.id === assignment.caseId);
    if (caseData) {
      caseData.status = 'assigned';
      caseData.assignedTo = {
        psychologist: 'Dra. María García',
        legalDefender: 'Lic. Ana Martínez',
      };
    }
    return new Promise(resolve => setTimeout(() => resolve(caseData!), 300));
  },

  // Reasignar a otro profesional
  reassignCase: async (
    caseId: string,
    psychologistId?: string,
    defenderId?: string,
    reason?: string
  ): Promise<TriageCase> => {
    const caseData = MOCK_PENDING_CASES.find(c => c.id === caseId);
    if (caseData && caseData.assignedTo) {
      caseData.assignedTo.psychologist = 'Dr. José López';
      caseData.notes = reason || caseData.notes;
    }
    return new Promise(resolve => setTimeout(() => resolve(caseData!), 300));
  },

  // Obtener historial de asignaciones
  getAssignmentHistory: async (caseId: string) => {
    const mockHistory = [
      {
        id: `ASG-${caseId}-001`,
        caseId,
        assignedBy: 'Admin User',
        assignedAt: new Date(Date.now() - 24 * 60 * 60000),
        psychologist: 'Dra. María García',
        defender: 'Lic. Ana Martínez',
        priority: 'high',
      },
    ];
    return new Promise(resolve => setTimeout(() => resolve(mockHistory), 200));
  },
};

// Professional Management (para asignaciones)
export const adminProfessionalService = {
  // Obtener psicólogos disponibles
  getAvailablePsychologists: async () => {
    const mockPsychologists = [
      { id: 'psy-001', name: 'Dra. María García', email: 'maria.garcia@safezone.cr', caseCount: 3, available: true },
      { id: 'psy-002', name: 'Dr. José López', email: 'jose.lopez@safezone.cr', caseCount: 5, available: true },
      { id: 'psy-003', name: 'Dra. Carmen Ruiz', email: 'carmen.ruiz@safezone.cr', caseCount: 4, available: false },
    ];
    return new Promise(resolve => setTimeout(() => resolve(mockPsychologists), 200));
  },

  // Obtener defensores disponibles
  getAvailableDefenders: async () => {
    const mockDefenders = [
      { id: 'def-001', name: 'Lic. Ana Martínez', email: 'ana.martinez@safezone.cr', caseCount: 2, available: true },
      { id: 'def-002', name: 'Lic. Roberto Díaz', email: 'roberto.diaz@safezone.cr', caseCount: 4, available: true },
      { id: 'def-003', name: 'Lic. Francisco Vega', email: 'francisco.vega@safezone.cr', caseCount: 6, available: false },
    ];
    return new Promise(resolve => setTimeout(() => resolve(mockDefenders), 200));
  },

  // Obtener carga de trabajo de un profesional
  getProfessionalWorkload: async (professionalId: string, role: string) => {
    const workload = {
      professionalId,
      role,
      activeCases: Math.floor(Math.random() * 6),
      completedCases: Math.floor(Math.random() * 15),
      averageResolutionTime: '8-12 semanas',
      capacity: 'Disponible',
    };
    return new Promise(resolve => setTimeout(() => resolve(workload), 200));
  },
};

// Admin Dashboard Metrics
export const adminMetricsService = {
  // Obtener métricas generales
  getTriageMetrics: async (): Promise<TriageMetrics> => {
    const metrics: TriageMetrics = {
      totalPending: 5,
      totalAssigned: 12,
      criticalCases: 2,
      casesByType: {
        physical: 4,
        psychological: 2,
        sexual: 1,
        legal: 3,
        other: 2,
      },
    };
    return new Promise(resolve => setTimeout(() => resolve(metrics), 200));
  },

  // Obtener reportes históricos
  getHistoricalReport: async (startDate: string, endDate: string) => {
    const mockAdmins: AdminUser[] = [
      {
        id: 'admin-001',
        email: 'admin@safezone.cr',
        name: 'Carlos Administrador',
        role: 'admin',
        region: 'Nacional',
        active: true,
      },
      {
        id: 'admin-002',
        email: 'gestor.sanjose@safezone.cr',
        name: 'Laura Gestora',
        role: 'admin',
        region: 'San José',
        active: true,
      },
    ];
    return new Promise(resolve => setTimeout(() => resolve(mockAdmins), 200));
  },

  // Crear nuevo admin
  createAdmin: async (data: Partial<AdminUser>) => {
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      email: data.email || '',
      name: data.name || '',
      role: 'admin',
      region: data.region || '',
      active: true,
    };
    return new Promise(resolve => setTimeout(() => resolve(newAdmin), 300));
  },

  // Actualizar admin
  updateAdmin: async (adminId: string, data: Partial<AdminUser>) => {
    const updatedAdmin: AdminUser = {
      id: adminId,
      email: data.email || 'admin@safezone.cr',
      name: data.name || 'Admin User',
      role: 'admin',
      region: data.region || 'Nacional',
      active: data.active !== undefined ? data.active : true,
    };
    return new Promise(resolve => setTimeout(() => resolve(updatedAdmin), 200));
  },

  // Desactivar admin
  deactivateAdmin: async (adminId: string) => {
    const deactivated: AdminUser = {
      id: adminId,
      email: 'admin@safezone.cr',
      name: 'Deactivated Admin',
      role: 'admin',
      region: 'Nacional',
      active: false,
    };
    return new Promise(resolve => setTimeout(() => resolve(deactivated), 200));
  },
};

export const adminUserService = {
  // Obtener todos los administradores
  getAdmins: async (): Promise<AdminUser[]> => {
    const mockAdmins: AdminUser[] = [
      { id: 'admin-001', email: 'admin1@safezone.cr', name: 'Carlos Rodríguez', role: 'admin', region: 'Nacional', active: true },
      { id: 'admin-002', email: 'admin2@safezone.cr', name: 'Elena Sánchez', role: 'admin', region: 'Nacional', active: true },
    ];
    return new Promise(resolve => setTimeout(() => resolve(mockAdmins), 200));
  },

  // Crear nuevo admin
  createAdmin: async (data: Partial<AdminUser>) => {
    const newAdmin: AdminUser = {
      id: 'admin-' + Date.now(),
      email: data.email || 'admin@safezone.cr',
      name: data.name || 'New Admin',
      role: 'admin',
      region: data.region || 'Nacional',
      active: true,
    };
    return new Promise(resolve => setTimeout(() => resolve(newAdmin), 200));
  },

  // Actualizar admin
  updateAdmin: async (adminId: string, data: Partial<AdminUser>) => {
    const updatedAdmin: AdminUser = {
      id: adminId,
      email: data.email || 'admin@safezone.cr',
      name: data.name || 'Admin User',
      role: 'admin',
      region: data.region || 'Nacional',
      active: data.active !== undefined ? data.active : true,
    };
    return new Promise(resolve => setTimeout(() => resolve(updatedAdmin), 200));
  },

  // Desactivar admin
  deactivateAdmin: async (adminId: string) => {
    const deactivated: AdminUser = {
      id: adminId,
      email: 'admin@safezone.cr',
      name: 'Deactivated Admin',
      role: 'admin',
      region: 'Nacional',
      active: false,
    };
    return new Promise(resolve => setTimeout(() => resolve(deactivated), 200));
  },
};
