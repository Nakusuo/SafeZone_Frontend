import React from 'react';
import { MessageCircle, Archive, Settings } from 'lucide-react';
import type { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
}) => {
  const filteredConversations = conversations.filter(
    (c) => !c.isArchived
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-surface-container"
          ></div>
        ))}
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-surface-container-lowest py-8 text-on-surface-variant">
        <MessageCircle className="h-8 w-8" />
        <p className="text-sm">No conversations</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredConversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`w-full rounded-lg p-3 text-left transition-colors ${
            selectedConversationId === conversation.id
              ? 'bg-primary/20 border-2 border-primary'
              : 'bg-surface-container hover:bg-surface-container-high'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-on-surface">
                Case ID: {conversation.caseId}
              </div>
              {conversation.lastMessage && (
                <p className="mt-1 text-xs text-on-surface-variant truncate">
                  {conversation.lastMessage.senderName}:{' '}
                  {conversation.lastMessage.content}
                </p>
              )}
              {conversation.lastMessageAt && (
                <p className="mt-1 text-xs text-on-surface-variant">
                  {new Date(conversation.lastMessageAt).toLocaleDateString(
                    'en-US'
                  )}
                </p>
              )}
            </div>
            {conversation.unreadCount > 0 && (
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-error text-xs font-bold text-on-error">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
