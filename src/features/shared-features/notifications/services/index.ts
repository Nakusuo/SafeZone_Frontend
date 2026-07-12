import apiClient from '@/core/api/apiClient';
import type { Notification, NotificationPreference, NotificationPayload } from '../types';


const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-1',
    type: 'case-assigned',
    title: 'Your case has been assigned',
    message: 'Case #RPT-2026-001 has been assigned to Dr. Maria Garcia (psychology) and Atty. Ana Martinez (legal)',
    relatedCaseId: 'CASE-001',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
    action: { label: 'View case', url: '/cases/CASE-001' },
  },
  {
    id: 'notif-002',
    userId: 'user-1',
    type: 'session-scheduled',
    title: 'Psychological session scheduled',
    message: 'Your session with Dr. Maria Garcia is scheduled for tomorrow at 10:00 AM',
    relatedCaseId: 'CASE-001',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60000),
    action: { label: 'View session', url: '/calendar' },
  },
  {
    id: 'notif-003',
    userId: 'user-1',
    type: 'document-uploaded',
    title: 'New document in your case',
    message: 'An important document has been uploaded: "Initial Psychological Evaluation.pdf"',
    relatedCaseId: 'CASE-001',
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60000),
    action: { label: 'Download', url: '/documents/CASE-001' },
  },
  {
    id: 'notif-004',
    userId: 'user-1',
    type: 'hearing-scheduled',
    title: 'Legal hearing scheduled',
    message: 'Your legal hearing is scheduled for April 15, 2026 at 2:00 PM',
    relatedCaseId: 'CASE-001',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60000),
    action: { label: 'View details', url: '/hearings/CASE-001' },
  },
  {
    id: 'notif-005',
    userId: 'user-1',
    type: 'system-alert',
    title: 'System update',
    message: 'System maintenance has been completed. All features are now available.',
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60000),
  },
];

export const notificationService = {
  
  async getNotifications(limit = 50): Promise<Notification[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_NOTIFICATIONS.slice(0, limit));
      }, 300);
    });
  },

  
  async getUnreadNotifications(): Promise<Notification[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_NOTIFICATIONS.filter(n => !n.isRead));
      }, 200);
    });
  },

  
  async markAsRead(notificationId: string): Promise<void> {
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if (notif) notif.isRead = true;
    return new Promise(resolve => setTimeout(resolve, 100));
  },

  
  async markAllAsRead(): Promise<void> {
    MOCK_NOTIFICATIONS.forEach(n => n.isRead = true);
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  
  async deleteNotification(notificationId: string): Promise<void> {
    const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
    if (index > -1) MOCK_NOTIFICATIONS.splice(index, 1);
    return new Promise(resolve => setTimeout(resolve, 100));
  },

  
  async clearAllNotifications(): Promise<void> {
    MOCK_NOTIFICATIONS.length = 0;
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  
  async getPreferences(): Promise<NotificationPreference> {
    const prefs: NotificationPreference = {
      userId: 'user-1',
      caseAssigned: true,
      caseUpdated: true,
      documentUploaded: true,
      sessionScheduled: true,
      hearingScheduled: true,
      caseClosed: true,
      assignmentChange: true,
      systemAlert: true,
      emailNotifications: true,
      pushNotifications: true,
    };
    return new Promise(resolve => setTimeout(() => resolve(prefs), 200));
  },

  
  async updatePreferences(
    preferences: Partial<NotificationPreference>
  ): Promise<NotificationPreference> {
    const updated = {
      userId: 'user-1',
      caseAssigned: preferences.caseAssigned ?? true,
      caseUpdated: preferences.caseUpdated ?? true,
      documentUploaded: preferences.documentUploaded ?? true,
      sessionScheduled: preferences.sessionScheduled ?? true,
      hearingScheduled: preferences.hearingScheduled ?? true,
      caseClosed: preferences.caseClosed ?? true,
      assignmentChange: preferences.assignmentChange ?? true,
      systemAlert: preferences.systemAlert ?? true,
      emailNotifications: preferences.emailNotifications ?? true,
      pushNotifications: preferences.pushNotifications ?? true,
    };
    return new Promise(resolve => setTimeout(() => resolve(updated), 200));
  },

  
  async getStats(): Promise<{ totalUnread: number; byType: Record<string, number> }> {
    const byType: Record<string, number> = {};
    MOCK_NOTIFICATIONS.filter(n => !n.isRead).forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1;
    });
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalUnread: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,
          byType,
        });
      }, 200);
    });
  },

  
  subscribeToNotifications(
    onNotification: (notification: Notification) => void,
    onError?: (error: Error) => void
  ): () => void {
    let isSubscribed = true;

    const cleanup = () => {
      isSubscribed = false;
    };

    return cleanup;
  },

  
  async sendTestNotification(
    payload: NotificationPayload
  ): Promise<Notification> {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      relatedCaseId: payload.relatedCaseId,
      isRead: false,
      createdAt: new Date(),
      action: payload.action,
    };
    MOCK_NOTIFICATIONS.unshift(newNotif);
    return new Promise(resolve => setTimeout(() => resolve(newNotif), 200));
  },
};
