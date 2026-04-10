// Admin module types - Triaje/Triage system

export type CaseStatus = 'new' | 'assigned' | 'in-progress' | 'closed';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical';
export type CaseType = 'physical' | 'psychological' | 'sexual' | 'legal' | 'other';

export interface TriageCase {
  id: string;
  reportId: string;
  victimName: string;
  victimEmail: string;
  incidentType: CaseType;
  priority: CasePriority;
  status: CaseStatus;
  description: string;
  location: string;
  submittedAt: string;
  assignedTo?: {
    psychologist?: string;
    legalDefender?: string;
  };
  notes?: string;
}

export interface TriageAssignment {
  caseId: string;
  psychologistId?: string;
  psychologistEmail?: string;
  defenderLegalId?: string;
  defenderLegalEmail?: string;
  priority: CasePriority;
  assignedAt: string;
  assignedBy: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'gestor' | 'coordinator';
  region?: string;
  active: boolean;
}

export interface TriageMetrics {
  totalPending: number;
  totalAssigned: number;
  criticalCases: number;
  averageAssignmentTime: number; // en minutos
  casesByType: {
    [key in CaseType]: number;
  };
}

export interface AssignmentHistory {
  caseId: string;
  previousAssignee?: string;
  newAssignee: string;
  changedAt: string;
  changedBy: string;
  reason?: string;
}
