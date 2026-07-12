





export type UserRole = 'VICTIM' | 'PSYCHOLOGIST' | 'DEFENDER' | 'ADMIN'


export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}


export interface AuthResponse {
  token: string
  user: User
}



export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}


export type ReportType = 'PHYSICAL_VIOLENCE' | 'PSYCHOLOGICAL_ABUSE' | 'SEXUAL_VIOLENCE' | 'ECONOMIC_ABUSE' | 'OTHER'
export type ReportStatus = 'PENDING' | 'UNDER_EVALUATION' | 'IN_FOLLOW_UP' | 'RESOLVED' | 'CLOSED'
export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Report {
  id: string
  victimId: string
  title: string
  description: string
  type: ReportType
  status: ReportStatus
  priority: ReportPriority
  createdAt: string
  updatedAt: string
  psychologistId?: string
  defenderId?: string
  location?: string
}


export interface Evaluation {
  id: string
  reportId: string
  psychologistId: string
  date: string
  diagnosis: string
  notes: string
  recommendations: string[]
}


export interface LegalUpdate {
  id: string
  reportId: string
  defenderId: string
  date: string
  status: string
  nextHearing?: string
  notes: string
}


export type CaseStatus = 'new' | 'assigned' | 'in-progress' | 'closed'
export type CasePriority = 'low' | 'medium' | 'high' | 'critical'
export type CaseType = 'physical' | 'psychological' | 'sexual' | 'legal' | 'other'

export interface TriageCase {
  id: string
  reportId: string
  victimName: string
  victimEmail: string
  incidentType: CaseType
  priority: CasePriority
  status: CaseStatus
  description: string
  location: string
  submittedAt: string
  assignedTo?: {
    psychologist?: string
    legalDefender?: string
  } | null
  notes?: string
}

export interface TriageAssignment {
  caseId: string
  psychologistId?: string
  defenderLegalId?: string
  priority: CasePriority
  assignedAt: string
  assignedBy: string
}

export interface TriageMetrics {
  totalPending: number
  totalAssigned: number
  criticalCases: number
  averageAssignmentTime?: number
  casesByType: Record<CaseType, number>
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'gestor' | 'coordinator'
  region?: string
  active: boolean
}

export interface AssignmentHistory {
  caseId: string
  previousAssignee?: string
  newAssignee: string
  changedAt: string
  changedBy: string
  reason?: string
}


export interface GeoLocation {
  latitude: number
  longitude: number
  accuracy?: number       
  altitude?: number
  timestamp: string
}

export type EmergencyStatus = 'ACTIVE' | 'ATTENDED' | 'RESOLVED'

export interface EmergencyAlert {
  id: string
  victimId: string
  victimName: string
  victimEmail: string
  
  location?: GeoLocation
  
  manualAddress?: string
  
  message?: string
  status: EmergencyStatus
  createdAt: string
  
  attendedBy?: string
  attendedByName?: string
  attendedAt?: string
  resolvedAt?: string
}
