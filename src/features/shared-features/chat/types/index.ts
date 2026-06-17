export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'victim' | 'psychologist' | 'defender' | 'admin';
  content: string;
  attachments?: ChatAttachment[];
  createdAt: Date;
  isRead: boolean;
  editedAt?: Date;
}

export interface ChatAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

export interface Conversation {
  id: string;
  caseId: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  lastMessageAt?: Date;
  unreadCount: number;
  isArchived: boolean;
  createdAt: Date;
}

export interface ChatParticipant {
  userId: string;
  userName: string;
  userRole: 'victim' | 'psychologist' | 'defender' | 'admin';
  joinedAt: Date;
  status: 'available' | 'busy' | 'offline';
}

export interface CreateMessageDto {
  conversationId: string;
  content: string;
  attachments?: Array<{
    fileName: string;
    fileSize: number;
    fileType: string;
    fileData: string; 
  }>;
}

export interface ConversationSettings {
  conversationId: string;
  notifications: boolean;
  archived: boolean;
  muted: boolean;
}
