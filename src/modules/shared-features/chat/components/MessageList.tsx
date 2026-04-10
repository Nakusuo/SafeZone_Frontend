import React, { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import type { ChatMessage } from '../types';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const roleEmoji: Record<string, string> = {
    victim: '👤',
    psychologist: '🧠',
    defender: '⚖️',
    admin: '👨‍💼',
  };

  return (
    <div className="space-y-4 overflow-y-auto flex-1">
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      )}

      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-32 text-on-surface-variant">
          <p>Sin mensajes aún. ¡Comienza la conversación!</p>
        </div>
      )}

      {messages.map((message) => {
        const isOwn = message.senderId === currentUserId;
        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
          >
            <div className="flex-shrink-0">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${
                  isOwn ? 'bg-primary/20' : 'bg-secondary/20'
                }`}
              >
                {roleEmoji[message.senderRole] || '💬'}
              </div>
            </div>

            <div className={`flex-1 space-y-1 ${isOwn ? 'items-end' : ''} flex flex-col`}>
              <div className="text-xs text-on-surface-variant">
                <span className="font-semibold">{message.senderName}</span>
                <span className="mx-1">•</span>
                <span>
                  {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  isOwn
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.attachments && message.attachments.length > 0 && (
                <div className="space-y-1 mt-2">
                  {message.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      download
                      className="flex items-center gap-2 text-xs text-primary hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      {attachment.fileName}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};
