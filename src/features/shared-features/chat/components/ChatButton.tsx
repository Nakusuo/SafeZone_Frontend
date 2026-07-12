import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Send,
  Lock,
  Loader,
  ChevronRight,
  Shield,
  User,
  Minimize2,
} from 'lucide-react';
import { chatService } from '@/features/shared-features/chat/services';
import type { Conversation, ChatMessage } from '@/features/shared-features/chat/types';
import { useAuth } from '@/core/auth/AuthContext';

const roleEmoji: Record<string, string> = {
  victim: '👤',
  psychologist: '🧠',
  defender: '⚖️',
  admin: '👨‍💼',
};

const roleLabel: Record<string, string> = {
  victim: 'Victim',
  psychologist: 'Psychologist',
  defender: 'Legal Defender',
  admin: 'Administrator',
};

const roleBadgeColor: Record<string, string> = {
  victim: 'bg-blue-100 text-blue-700',
  psychologist: 'bg-purple-100 text-purple-700',
  defender: 'bg-amber-100 text-amber-700',
  admin: 'bg-gray-100 text-gray-700',
};

export const ChatButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'list' | 'chat'>('list');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Load conversations & unread count when opened
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    chatService
      .getConversations()
      .then((data) => {
        setConversations(data);
        const total = data.reduce((sum, c) => sum + c.unreadCount, 0);
        setUnreadTotal(total);
      })
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (!selectedConv) return;
    chatService.getConversation(selectedConv.id).then(({ messages: msgs }) => {
      setMessages(msgs);
      chatService.markConversationAsRead(selectedConv.id);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConv.id ? { ...c, unreadCount: 0 } : c))
      );
    });

    const unsub = chatService.subscribeToMessages(selectedConv.id, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => unsub();
  }, [selectedConv]);

  // Poll unread badge every 30s even when closed
  useEffect(() => {
    const poll = async () => {
      const { total } = await chatService.getUnreadCount();
      setUnreadTotal(total);
    };
    poll();
    const id = setInterval(poll, 30000);
    return () => clearInterval(id);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    setStep('chat');
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedConv || isSending) return;
    const text = input.trim();
    setInput('');

    setIsEncrypting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsEncrypting(false);

    setIsSending(true);
    try {
      const msg = await chatService.sendMessage({
        conversationId: selectedConv.id,
        content: text,
      });
      setMessages((prev) => [...prev, msg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenFull = () => {
    setIsOpen(false);
    navigate(selectedConv ? `/chat/${selectedConv.id}` : '/chat');
  };

  const currentUserId = user?.id || 'current-user-id';

  return (
    <>
      {/* Floating button */}
      <div className="flex flex-col items-end gap-3">
        {/* Chat panel */}
        {isOpen && (
          <div className="w-[360px] max-h-[580px] flex flex-col rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-none">
                    SafeZone Chat
                  </p>
                  <p className="text-teal-100 text-xs mt-0.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> End-to-end encrypted
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {step === 'chat' && (
                  <button
                    onClick={handleOpenFull}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
                    title="Open full view"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setStep('list');
                    setSelectedConv(null);
                  }}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Breadcrumb / back nav */}
            {step === 'chat' && selectedConv && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setStep('list');
                    setSelectedConv(null);
                  }}
                  className="text-xs text-teal-600 hover:underline flex items-center gap-1"
                >
                  ← Conversations
                </button>
                <span className="text-xs font-medium text-gray-700">
                  Case: {selectedConv.caseId}
                </span>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {/* ── LIST VIEW ── */}
              {step === 'list' && (
                <div className="p-3">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader className="w-5 h-5 animate-spin text-teal-500" />
                    </div>
                  ) : conversations.filter((c) => !c.isArchived).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No conversations yet</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {conversations
                        .filter((c) => !c.isArchived)
                        .map((conv) => (
                          <li key={conv.id}>
                            <button
                              onClick={() => handleSelectConversation(conv)}
                              className="w-full text-left px-3 py-3 rounded-xl hover:bg-teal-50 border border-gray-100 hover:border-teal-200 transition group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800">
                                    Case: {conv.caseId}
                                  </p>
                                  {/* Participants chips */}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {conv.participants.slice(0, 3).map((p) => (
                                      <span
                                        key={p.userId}
                                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                          roleBadgeColor[p.userRole] || 'bg-gray-100 text-gray-700'
                                        }`}
                                      >
                                        {roleEmoji[p.userRole]} {p.userName.split(' ')[0]}
                                      </span>
                                    ))}
                                  </div>
                                  {conv.lastMessage && (
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                      {conv.lastMessage.senderName}:{' '}
                                      {conv.lastMessage.content}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  {conv.unreadCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                    </span>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition" />
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}

                  {/* Footer link */}
                  <button
                    onClick={handleOpenFull}
                    className="mt-3 w-full text-center text-xs text-teal-600 hover:underline py-2"
                  >
                    Open full chat view →
                  </button>
                </div>
              )}

              {/* ── CHAT VIEW ── */}
              {step === 'chat' && (
                <div className="flex flex-col h-[380px]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-400 py-6 text-xs">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                    {messages.map((msg) => {
                      const isOwn = msg.senderId === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                        >
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                              isOwn ? 'bg-teal-100' : 'bg-gray-100'
                            }`}
                          >
                            {roleEmoji[msg.senderRole] || <User className="w-3 h-3" />}
                          </div>
                          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                            <p className="text-[10px] text-gray-400 mb-0.5">
                              <span className="font-medium text-gray-600">
                                {msg.senderName}
                              </span>{' '}
                              ·{' '}
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <div
                              className={`rounded-2xl px-3 py-2 text-sm leading-snug ${
                                isOwn
                                  ? 'bg-teal-600 text-black rounded-tr-none'
                                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                  
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-gray-100">
                    {isEncrypting && (
                      <div className="flex items-center gap-1.5 mb-2 text-xs text-teal-600">
                        <Lock className="w-3 h-3 animate-pulse" />
                        Encrypting message…
                      </div>
                    )}
                    <div className="flex gap-2 items-end">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={2}
                        placeholder="Type a message… (Enter to send)"
                        className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isSending || isEncrypting}
                        className="flex-shrink-0 w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 flex items-center justify-center transition"
                      >
                        {isSending ? (
                          <Loader className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Send className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAB button */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="relative w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Open chat"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
          {/* Unread badge */}
          {!isOpen && unreadTotal > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
              {unreadTotal > 9 ? '9+' : unreadTotal}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
