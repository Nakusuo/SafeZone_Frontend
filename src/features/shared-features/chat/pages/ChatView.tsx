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
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        setError(null);
        const data = await chatService.getConversations();
        setConversations(data);

        
        if (!selectedConversationId && data.length > 0) {
          setSelectedConversationId(data[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error loading conversations'
        );
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  
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

        
        await chatService.markConversationAsRead(selectedConversationId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();

    
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
      setIsEncrypting(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsEncrypting(false);

      setIsSending(true);
      const message = await chatService.sendMessage({
        conversationId: selectedConversationId,
        content,
      });
      setMessages((prev) => [...prev, message]);

      
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
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setIsSending(false);
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  
  const currentUserId = 'current-user-id';

  return (
    <div className="flex h-screen flex-col gap-4">
      
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Messaging and Chat
        </h1>
        <p className="mt-2 text-gray-600">
          Communicate securely with the case team
        </p>
      </div>

      
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-error/10 p-4 text-error">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      
      <div className="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-4 overflow-hidden">
        
        <div className="lg:col-span-1 rounded-2xl bg-white shadow-sm border border-gray-100 p-4 overflow-y-auto">
          <h2 className="mb-4 font-semibold text-gray-900">Conversations</h2>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            isLoading={isLoadingConversations}
          />
        </div>

        
        <div className="lg:col-span-3 rounded-2xl bg-white shadow-sm border border-gray-100 p-4 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">
                  Case: {selectedConversation.caseId}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedConversation.participants.length} participant(s)
                </p>
              </div>

              
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

              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <MessageInput onSend={handleSendMessage} isLoading={isSending} isEncrypting={isEncrypting} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
