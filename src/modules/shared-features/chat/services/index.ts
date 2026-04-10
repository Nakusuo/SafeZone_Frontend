import { api } from '@/shared/services/api';
import type {
  ChatMessage,
  Conversation,
  CreateMessageDto,
  ConversationSettings,
} from '../types';

// Mock Data
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'user-victim-001',
    senderName: 'María González',
    senderRole: 'victim',
    content: '¿Cuándo podré hablar con la psicóloga?',
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
    isRead: true,
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'psy-001',
    senderName: 'Dra. María García',
    senderRole: 'psychologist',
    content: 'Hola María, estoy disponible mañana a las 10:00 AM. ¿Te viene bien?',
    createdAt: new Date(Date.now() - 90 * 60000),
    isRead: true,
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderId: 'def-001',
    senderName: 'Lic. Ana Martínez',
    senderRole: 'defender',
    content: 'María, tengo buenas noticias sobre tu caso. He obtenido la orden de alejamiento.',
    createdAt: new Date(Date.now() - 60 * 60000),
    isRead: true,
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    senderId: 'user-victim-001',
    senderName: 'María González',
    senderRole: 'victim',
    content: 'Gracias Lic. Ana, eso me hace sentir más segura. ¿Qué sigue ahora?',
    createdAt: new Date(Date.now() - 30 * 60000),
    isRead: true,
  },
  {
    id: 'msg-005',
    conversationId: 'conv-001',
    senderId: 'def-001',
    senderName: 'Lic. Ana Martínez',
    senderRole: 'defender',
    content: 'Ahora procederemos con la audiencia de custodia. Te citaré cuando tenga la fecha confirmada.',
    createdAt: new Date(Date.now() - 10 * 60000),
    isRead: false,
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    caseId: 'CASE-001',
    participants: [
      { userId: 'user-victim-001', userName: 'María González', userRole: 'victim', joinedAt: new Date(Date.now() - 48 * 60 * 60000), status: 'available' },
      { userId: 'psy-001', userName: 'Dra. María García', userRole: 'psychologist', joinedAt: new Date(Date.now() - 48 * 60 * 60000), status: 'available' },
      { userId: 'def-001', userName: 'Lic. Ana Martínez', userRole: 'defender', joinedAt: new Date(Date.now() - 24 * 60 * 60000), status: 'offline' },
    ],
    lastMessage: MOCK_MESSAGES[4],
    lastMessageAt: MOCK_MESSAGES[4].createdAt,
    unreadCount: 1,
    isArchived: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60000),
  },
  {
    id: 'conv-002',
    caseId: 'CASE-002',
    participants: [
      { userId: 'user-victim-002', userName: 'Ana Rodríguez', userRole: 'victim', joinedAt: new Date(Date.now() - 24 * 60 * 60000), status: 'available' },
      { userId: 'psy-002', userName: 'Dr. José López', userRole: 'psychologist', joinedAt: new Date(Date.now() - 24 * 60 * 60000), status: 'available' },
    ],
    lastMessage: {
      id: 'msg-006',
      conversationId: 'conv-002',
      senderId: 'psy-002',
      senderName: 'Dr. José López',
      senderRole: 'psychologist',
      content: 'Ana, tenemos una buena estrategia para trabajar el control emocional. Veamos en la sesión.',
      createdAt: new Date(Date.now() - 2 * 60 * 60000),
      isRead: true,
    },
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60000),
    unreadCount: 0,
    isArchived: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60000),
  },
];

export const chatService = {
  // Get all conversations for current user
  async getConversations(): Promise<Conversation[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_CONVERSATIONS);
      }, 300);
    });
  },

  // Get specific conversation with message history
  async getConversation(
    conversationId: string,
    limit = 50,
    offset = 0
  ): Promise<{
    conversation: Conversation;
    messages: ChatMessage[];
    total: number;
  }> {
    const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId) || MOCK_CONVERSATIONS[0];
    const messages = MOCK_MESSAGES.filter(m => m.conversationId === conversationId);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          conversation,
          messages: messages.slice(offset, offset + limit),
          total: messages.length,
        });
      }, 300);
    });
  },

  // Get or create conversation for a case
  async getOrCreateConversation(caseId: string): Promise<Conversation> {
    const existing = MOCK_CONVERSATIONS.find(c => c.caseId === caseId);
    if (existing) {
      return new Promise(resolve => setTimeout(() => resolve(existing), 200));
    }
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      caseId,
      participants: [],
      unreadCount: 0,
      isArchived: false,
      createdAt: new Date(),
    };
    return new Promise(resolve => setTimeout(() => resolve(newConv), 300));
  },

  // Send a message
  async sendMessage(data: CreateMessageDto): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: data.conversationId,
      senderId: 'current-user-id',
      senderName: 'Current User',
      senderRole: 'victim',
      content: data.content,
      createdAt: new Date(),
      isRead: false,
      attachments: data.attachments?.map(att => ({
        id: `att-${Date.now()}`,
        fileName: att.fileName,
        fileSize: att.fileSize,
        fileType: att.fileType,
        fileUrl: `https://example.com/files/${att.fileName}`,
      })),
    };
    MOCK_MESSAGES.push(newMessage);
    return new Promise(resolve => setTimeout(() => resolve(newMessage), 300));
  },

  // Edit message
  async editMessage(messageId: string, content: string): Promise<ChatMessage> {
    const message = MOCK_MESSAGES.find(m => m.id === messageId);
    if (message) {
      message.content = content;
      message.editedAt = new Date();
    }
    return new Promise(resolve => setTimeout(() => resolve(message!), 200));
  },

  // Delete message
  async deleteMessage(messageId: string): Promise<void> {
    const index = MOCK_MESSAGES.findIndex(m => m.id === messageId);
    if (index > -1) MOCK_MESSAGES.splice(index, 1);
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    const message = MOCK_MESSAGES.find(m => m.id === messageId);
    if (message) message.isRead = true;
    return new Promise(resolve => setTimeout(resolve, 100));
  },

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string): Promise<void> {
    MOCK_MESSAGES.filter(m => m.conversationId === conversationId).forEach(m => m.isRead = true);
    const conv = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
    if (conv) conv.unreadCount = 0;
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  // Get unread message count
  async getUnreadCount(): Promise<{ total: number; byConversation: Record<string, number> }> {
    const byConversation: Record<string, number> = {};
    let total = 0;
    MOCK_MESSAGES.filter(m => !m.isRead).forEach(m => {
      total++;
      byConversation[m.conversationId] = (byConversation[m.conversationId] || 0) + 1;
    });
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ total, byConversation });
      }, 200);
    });
  },

  // Update conversation settings
  async updateConversationSettings(
    conversationId: string,
    settings: Partial<ConversationSettings>
  ): Promise<Conversation> {
    const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
    if (conversation && settings.archived) {
      conversation.isArchived = settings.archived;
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(conversation!);
      }, 200);
    });
  },

  // Archive conversation
  async archiveConversation(conversationId: string): Promise<void> {
    const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
    if (conversation) conversation.isArchived = true;
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  // Subscribe to real-time messages (WebSocket)
  subscribeToMessages(
    conversationId: string,
    onMessage: (message: ChatMessage) => void,
    onError?: (error: Error) => void
  ): () => void {
    let isSubscribed = true;

    const cleanup = () => {
      isSubscribed = false;
    };

    return cleanup;
  },

  // Subscribe to participant status changes
  subscribeToStatusUpdates(
    conversationId: string,
    onStatusChange: (participant: any) => void
  ): () => void {
    let isSubscribed = true;

    const cleanup = () => {
      isSubscribed = false;
    };

    return cleanup;
  },
};
