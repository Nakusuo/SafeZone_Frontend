// Tipos específicos del módulo Defensor Legal
export interface LegalCase {
  id: string;
  defenderId: string;
  victimId: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'pending-trial' | 'resolved' | 'closed';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  nextHearing?: string;
  psychologistNotes?: string;
}

export interface LegalFile {
  id: string;
  caseId: string;
  title: string;
  description: string;
  documents: LegalDocument[];
  createdAt: string;
}

export interface LegalDocument {
  id: string;
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface CaseHearing {
  id: string;
  caseId: string;
  date: string;
  time: string;
  location: string;
  judge?: string;
  court?: string;
  type: 'initial' | 'preliminary' | 'trial' | 'appeal' | 'other';
  notes?: string;
}

export interface InteroperabilityData {
  caseId: string;
  victimInfo: any;
  psychologistNotes: any[];
  legalDocuments: LegalDocument[];
}
