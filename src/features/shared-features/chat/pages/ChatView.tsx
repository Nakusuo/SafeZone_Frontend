import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, Loader } from 'lucide-react';
import {
  ConversationList,
  MessageList,
  MessageInput,
} from '../components';
import { chatService } from '../services';
import type { Conversation, ChatMessage } from '../types';

export const ChatView: React.FC = () => {
  const { conversationId: paramConversationId } = useParams<{
    conversationId?: string;
  }>();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(paramConversationId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        setError(null);
        const data = await chatService.getConversations();
        setConversations(data);

        // Auto-select first conversation if none selected
        if (!selectedConversationId && data.length > 0) {
          setSelectedConversationId(data[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al cargar conversaciones'
        );
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversationId) return;

    const loadMessages = async () => {
      try {
        setIsLoadingMessages(true);
        setError(null);
        const data = await chatService.getConversation(
          selectedConversationId
        );
        setMessages(data.messages);

        // Mark as read
        await chatService.markConversationAsRead(selectedConversationId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();

    // Subscribe to real-time messages
    const unsubscribe = chatService.subscribeToMessages(
      selectedConversationId,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      }
    );

    return () => unsubscribe();
  }, [selectedConversationId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;

    try {
      setIsSending(true);
      setError(null);
      const message = await chatService.sendMessage({
        conversationId: selectedConversationId,
        content,
      });
      setMessages((prev) => [...prev, message]);

      // Update last message in conversation
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? {
                ...c,
                lastMessage: message,
                lastMessageAt: message.createdAt,
              }
            : c
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // Mock current user ID - in production, get from auth context
  const currentUserId = 'current-user-id';

  return (
    <div className="flex h-screen flex-col gap-4">
      {/* Header */}
      <div className="rounded-2xl bg-surface-container-highest p-6">
        <h1 className="text-2xl font-bold text-on-surface">
          Mensajería y Chat
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Comunícate de forma segura con el equipo del caso
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-error/10 p-4 text-error">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-4 overflow-hidden">
        {/* Left: Conversation List */}
        <div className="lg:col-span-1 rounded-2xl bg-surface-container-lowest p-4 overflow-y-auto">
          <h2 className="mb-4 font-semibold text-on-surface">Conversaciones</h2>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            isLoading={isLoadingConversations}
          />
        </div>

        {/* Right: Messages */}
        <div className="lg:col-span-3 rounded-2xl bg-surface-container-lowest p-4 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="mb-4 pb-4 border-b border-outline-variant/20">
                <h2 className="font-semibold text-on-surface">
                  Caso: {selectedConversation.caseId}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {selectedConversation.participants.length} participante(s)
                </p>
              </div>

              {/* Messages List */}
              {isLoadingMessages ? (
                <div className="flex items-center justify-center flex-1">
                  <Loader className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                <MessageList
                  messages={messages}
                  currentUserId={currentUserId}
                  isLoading={false}
                />
              )}

              {/* Message Input */}
              <div className="mt-4 pt-4 border-t border-outline-variant/20">
                <MessageInput onSend={handleSendMessage} isLoading={isSending} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-on-surface-variant">
              <p>Selecciona una conversación para empezar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
