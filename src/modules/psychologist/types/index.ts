// Tipos específicos del módulo Psicólogo
export interface CaseFollow { id: string;
  caseId: string;
  psychologistId: string;
  victimId: string;
  sessionDate: string;
  nextSessionDate?: string;
  status: 'active' | 'paused' | 'completed' | 'referred';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  notes: SessionNote[];
}

export interface SessionNote {
  id: string;
  followUpId: string;
  date: string;
  content: string;
  observations: string;
  recommendations: string;
  emotionalState: string;
  createdAt: string;
}

export interface CreateSessionNoteDto {
  content: string;
  observations: string;
  recommendations: string;
  emotionalState: string;
}

export interface PsychologistStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  avgSessionsPerCase: number;
}

export interface MetricData {
  date: string;
  value: number;
  label: string;
}
