import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { notificationService } from '../services';
import type { Notification } from '../types';

interface NotificationBellProps {
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(5);
      setNotifications(data);
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, notification: Notification) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notificationTypeIcon: Record<string, string> = {
    'case-assigned': '📋',
    'case-updated': '✏️',
    'document-uploaded': '📄',
    'session-scheduled': '📅',
    'hearing-scheduled': '⚖️',
    'case-closed': '✅',
    'assignment-change': '🔄',
    'system-alert': '⚠️',
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 hover:bg-surface-container transition-colors"
      >
        <Bell className="h-6 w-6 text-on-surface" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-surface-container-lowest shadow-lg">
          {/* Header */}
          <div className="border-b border-outline-variant/20 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-on-surface">
                Notificaciones ({unreadCount})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 space-y-0 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-on-surface-variant">
                Cargando...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-on-surface-variant">
                Sin notificaciones
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id, notification)}
                  className={`cursor-pointer border-b border-outline-variant/20 p-3 transition-colors hover:bg-surface-container/50 ${
                    !notification.isRead ? 'bg-secondary/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">
                      {notificationTypeIcon[notification.type] || '🔔'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold text-on-surface line-clamp-2 ${
                          !notification.isRead ? 'font-bold' : ''
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {new Date(notification.createdAt).toLocaleDateString(
                          'es-ES',
                          { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                        )}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="flex-shrink-0 text-on-surface-variant hover:text-on-surface"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="border-t border-outline-variant/20 p-3 text-center">
            <a
              href="/notifications"
              className="text-sm font-semibold text-primary hover:text-primary/90"
            >
              Ver todas las notificaciones →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
