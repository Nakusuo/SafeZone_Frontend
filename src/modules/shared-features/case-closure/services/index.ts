import { api } from '@/shared/services/api';
import type { CaseClosureSummary, CaseClosureHistory } from '../types';

// Mock Data
const MOCK_CLOSURE: CaseClosureSummary = {
  id: 'closure-001',
  caseId: 'CASE-001',
  status: 'pending',
  victimName: 'María González López',
  victimEmail: 'maria.gonzalez@example.com',
  psychologistId: 'psy-001',
  psychologistName: 'Dra. María García',
  psychologistSummary: 'La víctima ha mostrado una recuperación significativa después de 12 sesiones. Ha mejorado su confianza y capacidad de autorregulación emocional. Se recomienda continuar con sesiones de seguimiento mensual.',
  sessionCount: 12,
  clinicalOutcome: 'improved',
  recommendations: 'Sesiones de seguimiento mensuales por 6 meses. Derivación a programa de empoderamiento económico.',
  psychologistApprovedAt: new Date(Date.now() - 24 * 60 * 60000),
  defenderId: 'def-001',
  defenderName: 'Lic. Ana Martínez',
  legalSummary: 'Se ha logrado obtener una orden de alejamiento permanente. La custodia de los menores ha sido otorgada a la víctima. Caso legal resuelto satisfactoriamente.',
  casesResolved: 1,
  legalOutcome: 'won',
  defenderApprovedAt: new Date(Date.now() - 12 * 60 * 60000),
  safetyConfirmed: false,
  victimConfirmedAt: undefined,
  createdAt: new Date(Date.now() - 48 * 60 * 60000),
  lastUpdatedAt: new Date(),
};

export const caseClosureService = {
  // Get closure details for a case
  async getClosureSummary(caseId: string): Promise<CaseClosureSummary> {
    const mockClosure = { ...MOCK_CLOSURE, caseId };
    return new Promise(resolve => setTimeout(() => resolve(mockClosure), 300));
  },

  // Get all closure attempts for a case
  async getClosureHistory(caseId: string): Promise<CaseClosureHistory> {
    const history: CaseClosureHistory = {
      caseId,
      closures: [
        { ...MOCK_CLOSURE, caseId, id: 'closure-001' },
      ],
      totalClosures: 1,
    };
    return new Promise(resolve => setTimeout(() => resolve(history), 200));
  },

  // Psychologist submits their closure summary
  async submitPsychologistSummary(
    caseId: string,
    data: {
      summary: string;
      sessionCount: number;
      clinicalOutcome: 'improved' | 'stable' | 'declined';
      recommendations: string;
    }
  ): Promise<CaseClosureSummary> {
    const updated = { ...MOCK_CLOSURE, caseId };
    updated.psychologistSummary = data.summary;
    updated.sessionCount = data.sessionCount;
    updated.clinicalOutcome = data.clinicalOutcome;
    updated.recommendations = data.recommendations;
    updated.psychologistApprovedAt = new Date();
    return new Promise(resolve => setTimeout(() => resolve(updated), 300));
  },

  // Defender submits their closure summary
  async submitDefenderSummary(
    caseId: string,
    data: {
      summary: string;
      casesResolved: number;
      legalOutcome: 'won' | 'settled' | 'ongoing' | 'dismissed';
    }
  ): Promise<CaseClosureSummary> {
    const updated = { ...MOCK_CLOSURE, caseId };
    updated.legalSummary = data.summary;
    updated.casesResolved = data.casesResolved;
    updated.legalOutcome = data.legalOutcome;
    updated.defenderApprovedAt = new Date();
    return new Promise(resolve => setTimeout(() => resolve(updated), 300));
  },

  // Victim confirms safety and approves closure
  async confirmVictimApproval(
    caseId: string,
    data: {
      safetyConfirmed: boolean;
      notes?: string;
    }
  ): Promise<CaseClosureSummary> {
    const updated = { ...MOCK_CLOSURE, caseId };
    updated.safetyConfirmed = data.safetyConfirmed;
    updated.victimNotes = data.notes;
    updated.victimConfirmedAt = new Date();
    if (data.safetyConfirmed) {
      updated.status = 'completed';
      updated.closedAt = new Date();
    }
    return new Promise(resolve => setTimeout(() => resolve(updated), 300));
  },

  // Reject closure and return to pending
  async rejectClosure(
    caseId: string,
    reason: string
  ): Promise<CaseClosureSummary> {
    const updated = { ...MOCK_CLOSURE, caseId };
    updated.status = 'rejected';
    updated.notes = reason;
    return new Promise(resolve => setTimeout(() => resolve(updated), 200));
  },

  // Finalize closure (admin only)
  async finalizeClosure(caseId: string): Promise<CaseClosureSummary> {
    const updated = { ...MOCK_CLOSURE, caseId };
    updated.status = 'completed';
    updated.closedAt = new Date();
    return new Promise(resolve => setTimeout(() => resolve(updated), 200));
  },

  // Get cases pending closure
  async getPendingClosures(): Promise<CaseClosureSummary[]> {
    const mockClosures = [MOCK_CLOSURE];
    return new Promise(resolve => setTimeout(() => resolve(mockClosures), 200));
  },
};
