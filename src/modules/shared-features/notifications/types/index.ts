export type NotificationType =
  | 'case-assigned'
  | 'case-updated'
  | 'document-uploaded'
  | 'session-scheduled'
  | 'hearing-scheduled'
  | 'case-closed'
  | 'assignment-change'
  | 'system-alert';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedCaseId?: string;
  relatedDocumentId?: string;
  isRead: boolean;
  createdAt: Date;
  action?: {
    label: string;
    url: string;
  };
}

export interface NotificationPreference {
  userId: string;
  caseAssigned: boolean;
  caseUpdated: boolean;
  documentUploaded: boolean;
  sessionScheduled: boolean;
  hearingScheduled: boolean;
  caseClosed: boolean;
  assignmentChange: boolean;
  systemAlert: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedCaseId?: string;
  relatedDocumentId?: string;
  action?: {
    label: string;
    url: string;
  };
}

export interface NotificationStats {
  totalUnread: number;
  byType: Record<NotificationType, number>;
  lastCheckedAt: Date;
}
