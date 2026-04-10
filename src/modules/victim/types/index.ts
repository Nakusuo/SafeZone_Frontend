// Tipos específicos del módulo de víctimas
export interface Report {
  id: string;
  victimId: string;
  title: string;
  description: string;
  category: 'harassment' | 'violence' | 'discrimination' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'submitted' | 'under-review' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  attachments: ReportAttachment[];
}

export interface ReportAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface CreateReportDto {
  title: string;
  description: string;
  category: Report['category'];
  severity: Report['severity'];
  attachments?: File[];
}

export interface VictimProfile {
  id: string;
  userId: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: string;
  riskLevel: 'low' | 'medium' | 'high';
}
