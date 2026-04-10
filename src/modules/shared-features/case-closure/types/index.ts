export type CaseClosureStatus = 'pending' | 'in-progress' | 'completed' | 'rejected';

export interface CaseClosureSummary {
  id: string;
  caseId: string;
  status: CaseClosureStatus;
  victimName: string;
  victimEmail: string;
  
  // Psychologist section
  psychologistId: string;
  psychologistName: string;
  psychologistSummary: string;
  sessionCount: number;
  clinicalOutcome: 'improved' | 'stable' | 'declined';
  recommendations: string;
  psychologistApprovedAt?: Date;
  
  // Defender section
  defenderId: string;
  defenderName: string;
  legalSummary: string;
  casesResolved: number;
  legalOutcome: 'won' | 'settled' | 'ongoing' | 'dismissed';
  defenderApprovedAt?: Date;
  
  // Victim confirmation
  victimConfirmedAt?: Date;
  safetyConfirmed: boolean;
  victimNotes?: string;
  
  // Administrative
  createdAt: Date;
  lastUpdatedAt: Date;
  closedAt?: Date;
}

export interface ClosureApproval {
  role: 'psychologist' | 'defender' | 'victim';
  userId: string;
  userName: string;
  content: string;
  approvedAt: Date;
}

export interface CaseClosureHistory {
  caseId: string;
  closures: CaseClosureSummary[];
  totalClosures: number;
}
