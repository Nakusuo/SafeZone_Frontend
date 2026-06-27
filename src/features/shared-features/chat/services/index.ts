/**
 * RF-07 – Chat service conectado al backend real
 *
 * Endpoints consumidos:
 *   GET    /api/denuncias/listar                → conversaciones del usuario
 *   GET    /api/mensajes/{denunciaid}           → mensajes de una conversación
 *   POST   /api/mensajes/{denunciaid}           → enviar mensaje
 *   PATCH  /api/mensajes/{denunciaid}/leer      → marcar como leídos
 *   GET    /api/mensajes/no-leidos/count        → badge de no leídos
 */

import apiClient from '@/core/api/apiClient';
import type {
  ChatMessage,
  Conversation,
  CreateMessageDto,
  ConversationSettings,
  ChatParticipant,
} from '../types';

// ── tipos del backend ─────────────────────────────────────────────────────────

interface BackendMensaje {
  id: string;
  denunciaid: string;
  remitenteid: string;
  remitenteNombre: string;
  remitenteRol: string;
  destinatarioid: string;
  contenido: string;
  leido: boolean;
  fechaenvio: string;
}

interface BackendDenuncia {
  id: string;
  usuarioid: string;
  victimaid?: string;
  titulo: string;
  descripcion: string;
  tipoViolencia: string;
  nivelRiesgo: string;
  estado: string;
  direccion: string;
  fechaDenuncia: string;
  psicologoId?: string;
  defensorLegalId?: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function mapRol(backendRol: string): ChatMessage['senderRole'] {
  const map: Record<string, ChatMessage['senderRole']> = {
    VICTIM: 'victim',
    PSYCHOLOGIST: 'psychologist',
    DEFENDER: 'defender',
    ADMIN: 'admin',
  };
  return map[backendRol?.toUpperCase()] ?? 'victim';
}

function getCurrentUserId(): string | null {
  try {
    const u = localStorage.getItem('user') || sessionStorage.getItem('user');
    return u ? JSON.parse(u).id : null;
  } catch {
    return null;
  }
}

function backendMensajeToMessage(m: BackendMensaje): ChatMessage {
  return {
    id: m.id,
    conversationId: m.denunciaid,
    senderId: m.remitenteid,
    senderName: m.remitenteNombre,
    senderRole: mapRol(m.remitenteRol),
    content: m.contenido,
    createdAt: new Date(m.fechaenvio),
    isRead: m.leido,
  };
}

function denunciaToConversation(
  d: BackendDenuncia,
  lastMessage?: ChatMessage
): Conversation {
  const participants: ChatParticipant[] = [];

  if (d.victimaid || d.usuarioid) {
    participants.push({
      userId: d.victimaid || d.usuarioid,
      userName: 'Víctima',
      userRole: 'victim',
      joinedAt: new Date(d.fechaDenuncia),
      status: 'available',
    });
  }
  if (d.psicologoId) {
    participants.push({
      userId: d.psicologoId,
      userName: 'Psicólogo/a',
      userRole: 'psychologist',
      joinedAt: new Date(d.fechaDenuncia),
      status: 'available',
    });
  }
  if (d.defensorLegalId) {
    participants.push({
      userId: d.defensorLegalId,
      userName: 'Defensor/a Legal',
      userRole: 'defender',
      joinedAt: new Date(d.fechaDenuncia),
      status: 'available',
    });
  }

  return {
    id: d.id,
    caseId: d.id,
    participants,
    lastMessage,
    lastMessageAt: lastMessage?.createdAt,
    unreadCount: 0,
    isArchived: false,
    createdAt: new Date(d.fechaDenuncia),
  };
}

// ── servicio ──────────────────────────────────────────────────────────────────

export const chatService = {

  /**
   * Lista las conversaciones disponibles para el usuario autenticado.
   * Llama a /api/denuncias/listar (todos los roles permitidos por SecurityConfig).
   */
  async getConversations(): Promise<Conversation[]> {
    const { data } = await apiClient.get<BackendDenuncia[]>('/denuncias/listar');
    const userId = getCurrentUserId();

    const conversations = await Promise.all(
      data.map(async (d) => {
        try {
          const { data: mensajes } = await apiClient.get<BackendMensaje[]>(
            `/mensajes/${d.id}`
          );
          const messages = mensajes.map(backendMensajeToMessage);
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
          const conv = denunciaToConversation(d, lastMessage);

          conv.unreadCount = messages.filter(
            (m) => !m.isRead && m.senderId !== userId
          ).length;

          return conv;
        } catch {
          return denunciaToConversation(d);
        }
      })
    );

    return conversations;
  },

  /**
   * Carga todos los mensajes de una conversación (denuncia).
   */
  async getConversation(
    conversationId: string
  ): Promise<{ conversation: Conversation; messages: ChatMessage[]; total: number }> {
    const { data: mensajes } = await apiClient.get<BackendMensaje[]>(
      `/mensajes/${conversationId}`
    );

    const messages = mensajes.map(backendMensajeToMessage);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;

    // Intentamos obtener los datos de la denuncia para construir la conversación
    let conversation: Conversation;
    try {
      const { data: denuncias } = await apiClient.get<BackendDenuncia[]>('/denuncias/listar');
      const denuncia = denuncias.find((d) => d.id === conversationId);
      conversation = denuncia
        ? denunciaToConversation(denuncia, lastMessage)
        : {
            id: conversationId,
            caseId: conversationId,
            participants: [],
            lastMessage,
            lastMessageAt: lastMessage?.createdAt,
            unreadCount: 0,
            isArchived: false,
            createdAt: new Date(),
          };
    } catch {
      conversation = {
        id: conversationId,
        caseId: conversationId,
        participants: [],
        lastMessage,
        lastMessageAt: lastMessage?.createdAt,
        unreadCount: 0,
        isArchived: false,
        createdAt: new Date(),
      };
    }

    return { conversation, messages, total: messages.length };
  },

  /**
   * Envía un mensaje. El backend resuelve el destinatario automáticamente
   * si no se pasa destinatarioid.
   */
  async sendMessage(data: CreateMessageDto): Promise<ChatMessage> {
    const payload: Record<string, string> = {
      contenido: data.content,
    };

    // Solo incluir destinatarioid si viene explícito
    if ((data as any).destinatarioid) {
      payload.destinatarioid = (data as any).destinatarioid;
    }

    const { data: mensaje } = await apiClient.post<BackendMensaje>(
      `/mensajes/${data.conversationId}`,
      payload
    );

    return backendMensajeToMessage(mensaje);
  },

  /**
   * Marca todos los mensajes de una conversación como leídos.
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    await apiClient.patch(`/mensajes/${conversationId}/leer`);
  },

  /**
   * Cuenta los mensajes no leídos del usuario (para el badge del FAB).
   */
  async getUnreadCount(): Promise<{ total: number; byConversation: Record<string, number> }> {
    const { data } = await apiClient.get<{ total: number }>(
      '/mensajes/no-leidos/count'
    );
    return { total: data.total, byConversation: {} };
  },

  // ── polling para tiempo real ──────────────────────────────────────────────

  subscribeToMessages(
    conversationId: string,
    onMessage: (message: ChatMessage) => void,
    _onError?: (error: Error) => void
  ): () => void {
    let lastMessageId: string | null = null;
    let active = true;

    const poll = async () => {
      if (!active) return;
      try {
        const { data } = await apiClient.get<BackendMensaje[]>(
          `/mensajes/${conversationId}`
        );
        const messages = data.map(backendMensajeToMessage);
        const newest = messages.length > 0 ? messages[messages.length - 1] : undefined;

        if (newest && newest.id !== lastMessageId) {
          if (lastMessageId !== null) {
            // Emitir solo los mensajes que llegaron después de la carga inicial
            const idx = messages.findIndex((m) => m.id === lastMessageId);
            const newOnes = idx >= 0 ? messages.slice(idx + 1) : [];
            newOnes.forEach((m) => onMessage(m));
          }
          lastMessageId = newest.id;
        }
      } catch {
        // silencioso
      }
      if (active) setTimeout(poll, 8000);
    };

    setTimeout(poll, 8000);
    return () => { active = false; };
  },

  // ── stubs ─────────────────────────────────────────────────────────────────

  async getOrCreateConversation(caseId: string): Promise<Conversation> {
    const convs = await chatService.getConversations();
    const existing = convs.find((c) => c.caseId === caseId);
    if (existing) return existing;
    throw new Error('Conversación no encontrada para el caso: ' + caseId);
  },

  async markAsRead(_messageId: string): Promise<void> {},

  async editMessage(_messageId: string, _content: string): Promise<ChatMessage> {
    throw new Error('No soportado');
  },

  async deleteMessage(_messageId: string): Promise<void> {
    throw new Error('No soportado');
  },

  async updateConversationSettings(
    _conversationId: string,
    _settings: Partial<ConversationSettings>
  ): Promise<Conversation> {
    throw new Error('No soportado');
  },

  async archiveConversation(_conversationId: string): Promise<void> {
    throw new Error('No soportado');
  },

  subscribeToStatusUpdates(
    _conversationId: string,
    _onStatusChange: (participant: any) => void
  ): () => void {
    return () => {};
  },
};