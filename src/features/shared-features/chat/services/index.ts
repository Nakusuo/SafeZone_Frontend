
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
  fechaenvio: string; // ISO-8601
}

interface BackendDenuncia {
  id: string;
  usuarioid: string;
  victimaid: string;
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

/**
 * Construye una Conversation desde una denuncia del backend.
 * Los participantes reales se derivan de los campos de la denuncia.
 */
function denunciaToConversation(
  d: BackendDenuncia,
  lastMessage?: ChatMessage
): Conversation {
  const participants: ChatParticipant[] = [];

  // Víctima siempre está
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
    unreadCount: 0, // se actualiza al cargar mensajes
    isArchived: false,
    createdAt: new Date(d.fechaDenuncia),
  };
}

// ── servicio ──────────────────────────────────────────────────────────────────

export const chatService = {

  /**
   * Obtiene la lista de conversaciones del usuario (basadas en sus denuncias activas).
   */
  async getConversations(): Promise<Conversation[]> {
    const { data } = await apiClient.get<BackendDenuncia[]>('/denuncias/listar');

    // Para cada denuncia, cargamos el último mensaje
    const conversations = await Promise.all(
      data.map(async (d) => {
        try {
          const { data: mensajes } = await apiClient.get<BackendMensaje[]>(
            `/mensajes/${d.id}`
          );
          const messages = mensajes.map(backendMensajeToMessage);
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;

          const conv = denunciaToConversation(d, lastMessage);

          // Contar no leídos
          const userId = (() => {
            try {
              const u = sessionStorage.getItem('user');
              return u ? JSON.parse(u).id : null;
            } catch {
              return null;
            }
          })();
          conv.unreadCount = messages.filter(
            (m) => !m.isRead && m.senderId !== userId
          ).length;

          return conv;
        } catch {
          // Si no hay mensajes aún, retornamos la conversación vacía
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
    const [{ data: mensajes }, { data: denuncias }] = await Promise.all([
      apiClient.get<BackendMensaje[]>(`/mensajes/${conversationId}`),
      apiClient.get<BackendDenuncia[]>('/denuncias/listar'),
    ]);

    const messages = mensajes.map(backendMensajeToMessage);
    const denuncia = denuncias.find((d) => d.id === conversationId);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
    const conversation = denuncia
      ? denunciaToConversation(denuncia, lastMessage)
      : ({
          id: conversationId,
          caseId: conversationId,
          participants: [],
          lastMessage,
          lastMessageAt: lastMessage?.createdAt,
          unreadCount: 0,
          isArchived: false,
          createdAt: new Date(),
        } as Conversation);

    return { conversation, messages, total: messages.length };
  },

  /**
   * Envía un mensaje en una conversación.
   * El backend identifica al remitente por el JWT.
   */
  async sendMessage(data: CreateMessageDto): Promise<ChatMessage> {
    // 🔥 obtener usuario actual
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');

  // 🔥 buscar el destinatario (el otro participante)
  const conversation = await this.getConversation(data.conversationId);

  const destinatario = conversation.conversation.participants.find(
    (p) => p.userId !== currentUser.id
  );

  if (!destinatario) {
    throw new Error("No se encontró destinatario");
  }

  const payload = {
    contenido: data.content,
    destinatarioid: destinatario.userId, // ✅ AQUÍ VA EL FIX
  };

  const { data: mensaje } = await apiClient.post<BackendMensaje>(
    `/mensajes`,
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

  // ── stubs compatibles (no usados con backend real) ────────────────────────

  async getOrCreateConversation(caseId: string): Promise<Conversation> {
    const convs = await chatService.getConversations();
    const existing = convs.find((c) => c.caseId === caseId);
    if (existing) return existing;
    throw new Error('Conversación no encontrada para el caso: ' + caseId);
  },

  async editMessage(_messageId: string, _content: string): Promise<ChatMessage> {
    throw new Error('Edición de mensajes no soportada por el backend');
  },

  async deleteMessage(_messageId: string): Promise<void> {
    throw new Error('Eliminación de mensajes no soportada por el backend');
  },

  async markAsRead(_messageId: string): Promise<void> {
    // No expuesto individualmente; usar markConversationAsRead
  },

  async updateConversationSettings(
    _conversationId: string,
    _settings: Partial<ConversationSettings>
  ): Promise<Conversation> {
    throw new Error('Configuración de conversación no soportada por el backend');
  },

  async archiveConversation(_conversationId: string): Promise<void> {
    throw new Error('Archivar conversación no soportado por el backend');
  },

  /**
   * Polling ligero para simular tiempo real (sin WebSocket).
   * Llama al callback con el nuevo mensaje si hay uno nuevo desde `lastMessageId`.
   */
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
            // Solo emitir mensajes que llegaron después de la carga inicial
            const newOnes = messages.filter((m) => m.id !== lastMessageId);
            newOnes.forEach((m) => onMessage(m));
          }
          lastMessageId = newest.id;
        }
      } catch {
        // silencioso — el componente maneja errores de carga
      }
      if (active) setTimeout(poll, 8000); // poll cada 8 segundos
    };

    // Primer poll retrasado para no duplicar la carga inicial
    setTimeout(poll, 8000);

    return () => {
      active = false;
    };
  },

  subscribeToStatusUpdates(
    _conversationId: string,
    _onStatusChange: (participant: any) => void
  ): () => void {
    return () => {};
  },
};