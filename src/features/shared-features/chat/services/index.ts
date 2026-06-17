import apiClient from '@/core/api/apiClient';
import type {
  ChatMessage,
  Conversation,
  CreateMessageDto,
  ConversationSettings,
} from '../types';


const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'user-victim-001',
    senderName: 'Maria Gonzalez',
    senderRole: 'victim',
    content: 'When will I be able to talk to the psychologist?',
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
    isRead: true,
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'psy-001',
    senderName: 'Dr. Maria Garcia',
    senderRole: 'psychologist',
    content: 'Hello Maria, I am available tomorrow at 10:00 AM. Does that work for you?',
    createdAt: new Date(Date.now() - 90 * 60000),
    isRead: true,
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderId: 'def-001',
    senderName: 'Atty. Ana Martinez',
    senderRole: 'defender',
    content: 'Maria, I have good news about your case. I have obtained the restraining order.',
    createdAt: new Date(Date.now() - 60 * 60000),
    isRead: true,
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    senderId: 'user-victim-001',
    senderName: 'Maria Gonzalez',
    senderRole: 'victim',
    content: 'Thank you Atty. Ana, that makes me feel safer. What follows next?',
    createdAt: new Date(Date.now() - 30 * 60000),
    isRead: true,
  },
  {
    id: 'msg-005',
    conversationId: 'conv-001',
    senderId: 'def-001',
    senderName: 'Atty. Ana Martinez',
    senderRole: 'defender',
    content: 'Now we will proceed with the custody hearing. I will cite you once I have the confirmed date.',
    createdAt: new Date(Date.now() - 10 * 60000),
    isRead: false,
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    caseId: 'CASE-001',
    participants: [
      { userId: 'user-victim-001', userName: 'Maria Gonzalez', userRole: 'victim', joinedAt: new Date(Date.now() - 48 * 60 * 60000), status: 'available' },
      { userId: 'psy-001', userName: 'Dr. Maria Garcia', userRole: 'psychologist', joinedAt: new Date(Date.now() - 48 * 60 * 60000), status: 'available' },
      { userId: 'def-001', userName: 'Atty. Ana Martinez', userRole: 'defender', joinedAt: new Date(Date.now() - 24 * 60 * 60000), status: 'offline' },
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
      { userId: 'user-victim-002', userName: 'Ana Rodriguez', userRole: 'victim', joinedAt: new Date(Date.now() - 24 * 60 * 60000), status: 'available' },
      { userId: 'psy-002', userName: 'Dr. Jose Lopez', userRole: 'psychologist', joinedAt: new Date(Date.now() - 24 * 60 * 60000), status: 'available' },
    ],
    lastMessage: {
      id: 'msg-006',
      conversationId: 'conv-002',
      senderId: 'psy-002',
      senderName: 'Dr. Jose Lopez',
      senderRole: 'psychologist',
      content: 'Ana, we have a good strategy to work on emotional control. Let us see in the session.',
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
  
  async getConversations(): Promise<Conversation[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_CONVERSATIONS);
      }, 300);
    });
  },

  
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

  
  async editMessage(messageId: string, content: string): Promise<ChatMessage> {
    const message = MOCK_MESSAGES.find(m => m.id === messageId);
    if (message) {
      message.content = content;
      message.editedAt = new Date();
    }
    return new Promise(resolve => setTimeout(() => resolve(message!), 200));
  },

  
  async deleteMessage(messageId: string): Promise<void> {
    const index = MOCK_MESSAGES.findIndex(m => m.id === messageId);
    if (index > -1) MOCK_MESSAGES.splice(index, 1);
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  
  async markAsRead(messageId: string): Promise<void> {
    const message = MOCK_MESSAGES.find(m => m.id === messageId);
    if (message) message.isRead = true;
    return new Promise(resolve => setTimeout(resolve, 100));
  },

  
  async markConversationAsRead(conversationId: string): Promise<void> {
    MOCK_MESSAGES.filter(m => m.conversationId === conversationId).forEach(m => m.isRead = true);
    const conv = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
    if (conv) conv.unreadCount = 0;
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  
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

  
  async archiveConversation(conversationId: string): Promise<void> {
    const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
    if (conversation) conversation.isArchived = true;
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  
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
