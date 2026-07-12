import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mail, Clock } from 'lucide-react';
import { notificationService } from '../services';
import type { Notification } from '../types';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = async (id: string) => {
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedNotification(null);
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
    <div className="space-y-4">
      
      <div className="rounded-2xl bg-surface-container-highest p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">
              Notification Center
            </h1>
            <p className="mt-2 text-on-surface-variant">
              Here you will find all your notifications and updates
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        <div className="space-y-2 lg:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-lowest py-12 text-on-surface-variant">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Loading notifications...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-2xl bg-surface-container-lowest p-8 text-center">
              <Mail className="mx-auto mb-3 h-12 w-12 text-on-surface-variant/50" />
              <p className="text-on-surface-variant">
                {filter === 'unread'
                  ? 'You have no unread notifications'
                  : 'No notifications'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => setSelectedNotification(notification)}
                className={`cursor-pointer rounded-xl p-4 transition-all hover:shadow-md ${
                  !notification.isRead
                    ? 'bg-secondary/10 border-2 border-secondary'
                    : 'bg-surface-container border border-outline-variant/20'
                } ${
                  selectedNotification?.id === notification.id
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">
                    {notificationTypeIcon[notification.type] || '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-bold text-on-surface ${
                          !notification.isRead ? 'font-extrabold' : ''
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="inline-block h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(notification.createdAt).toLocaleDateString(
                          'en-US'
                        )}{' '}
                        at{' '}
                        {new Date(notification.createdAt).toLocaleTimeString(
                          'en-US',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
        <div className="lg:col-span-1">
          {selectedNotification ? (
            <div className="rounded-2xl bg-surface-container-lowest p-6 space-y-4">
              <h3 className="font-bold text-on-surface">
                Notification Details
              </h3>

              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase">
                  Subject
                </p>
                <p className="mt-1 text-sm text-on-surface">
                  {selectedNotification.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase">
                  Message
                </p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface">
                  {selectedNotification.message}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase">
                  Type
                </p>
                <p className="mt-1 text-sm capitalize text-on-surface">
                  {selectedNotification.type.replace('-', ' ')}
                </p>
              </div>

              {selectedNotification.relatedCaseId && (
                <div className="rounded-lg bg-surface-container p-3">
                  <p className="text-xs font-semibold text-on-surface-variant">
                    Related Case
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {selectedNotification.relatedCaseId}
                  </p>
                </div>
              )}

              <div className="border-t border-outline-variant/20 pt-4 space-y-2">
                {!selectedNotification.isRead && (
                  <button
                    onClick={() =>
                      handleMarkAsRead(selectedNotification.id)
                    }
                    className="w-full rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-on-secondary hover:bg-secondary/90"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedNotification.id)}
                  className="w-full rounded-lg bg-error/10 px-4 py-2 text-sm font-semibold text-error hover:bg-error/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface-container-lowest p-6 text-center text-on-surface-variant">
              Select a notification to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
