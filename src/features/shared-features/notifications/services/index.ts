import apiClient from '@/core/api/apiClient';
import type { Notification, NotificationPreference, NotificationPayload } from '../types';

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-1',
    type: 'case-assigned',
    title: 'Tu caso ha sido asignado',
    message: 'El caso #RPT-2026-001 ha sido asignado a Dra. María García (psicología) y Lic. Ana Martínez (legal)',
    relatedCaseId: 'CASE-001',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
    action: { label: 'Ver caso', url: '/casos/CASE-001' },
  },
  {
    id: 'notif-002',
    userId: 'user-1',
    type: 'session-scheduled',
    title: 'Sesión psicológica programada',
    message: 'Tu sesión con Dra. María García está programada para mañana a las 10:00 AM',
    relatedCaseId: 'CASE-001',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60000),
    action: { label: 'Ver sesión', url: '/calendar' },
  },
  {
    id: 'notif-003',
    userId: 'user-1',
    type: 'document-uploaded',
    title: 'Nuevo documento en tu caso',
    message: 'Se ha subido un documento importante: "Evaluación Psicológica Inicial.pdf"',
    relatedCaseId: 'CASE-001',
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60000),
    action: { label: 'Descargar', url: '/documents/CASE-001' },
  },
  {
    id: 'notif-004',
    userId: 'user-1',
    type: 'hearing-scheduled',
    title: 'Audiencia legal programada',
    message: 'Tu audiencia legal está programada para el 15 de abril de 2026 a las 2:00 PM',
    relatedCaseId: 'CASE-001',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60000),
    action: { label: 'Ver detalles', url: '/hearings/CASE-001' },
  },
  {
    id: 'notif-005',
    userId: 'user-1',
    type: 'system-alert',
    title: 'Actualización del sistema',
    message: 'Se ha completado el mantenimiento del sistema. Todas las funcionalidades están disponibles.',
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60000),
  },
];

export const notificationService = {
  // Fetch all notifications for user
  async getNotifications(limit = 50): Promise<Notification[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_NOTIFICATIONS.slice(0, limit));
      }, 300);
    });
  },

  // Fetch unread notifications only
  async getUnreadNotifications(): Promise<Notification[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_NOTIFICATIONS.filter(n => !n.isRead));
      }, 200);
    });
  },

  // Mark single notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if (notif) notif.isRead = true;
    return new Promise(resolve => setTimeout(resolve, 100));
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    MOCK_NOTIFICATIONS.forEach(n => n.isRead = true);
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  // Delete single notification
  async deleteNotification(notificationId: string): Promise<void> {
    const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
    if (index > -1) MOCK_NOTIFICATIONS.splice(index, 1);
    return new Promise(resolve => setTimeout(resolve, 100));
  },

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    MOCK_NOTIFICATIONS.length = 0;
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  // Get notification preferences
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

  // Update notification preferences
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

  // Get notification statistics
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

  // Subscribe to real-time notifications (WebSocket)
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

  // Send test notification
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
