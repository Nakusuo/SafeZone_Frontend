// ============================================================
// 📅 AGENDA SERVICE - API Reference
// ============================================================
// Ubicación: src/features/shared-features/services/agendaService.ts
//
// Servicio Axios para operaciones CRUD de eventos de agenda.
// Incluye sincronización completa con el backend Spring Boot.
// ============================================================

import apiClient from '@/core/api/apiClient'

// ────────────────────────────────────────────────────────────
// TIPOS
// ────────────────────────────────────────────────────────────

export type AgendaEventType = 'AUDIENCIA' | 'CITA_PSICOLOGICA' | 'PLAZO_LEGAL'
export type AgendaEventStatus = 'PENDIENTE' | 'COMPLETADO' | 'EN_PROCESO' | 'CANCELADO'

export interface AgendaEvent {
  id: string
  usuarioid: string
  titulo: string
  fechaInicio: string              // ISO 8601 formato
  fechaFin: string                 // ISO 8601 formato
  tipo: AgendaEventType
  estado: AgendaEventStatus
  descripcion?: string
}

export interface CreateAgendaEventPayload {
  usuarioid: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  tipo: AgendaEventType
  estado: AgendaEventStatus
  descripcion?: string
}

export interface UpdateAgendaEventStatusPayload {
  estado: AgendaEventStatus
}

// ────────────────────────────────────────────────────────────
// MÉTODOS
// ────────────────────────────────────────────────────────────

/**
 * ✅ Obtener eventos para un rango de fechas
 * 
 * GET /agenda/{usuarioid}?start=ISO_DATE&end=ISO_DATE
 * 
 * @param usuarioid - ID del usuario autenticado
 * @param start - Fecha ISO inicial (ej: "2026-07-01T00:00:00Z")
 * @param end - Fecha ISO final (ej: "2026-07-31T23:59:59Z")
 * 
 * @returns Promise<AgendaEvent[]>
 * 
 * @example
 * const events = await agendaService.getAgenda(
 *   'user-123',
 *   '2026-07-01T00:00:00Z',
 *   '2026-07-31T23:59:59Z'
 * )
 */
export const getAgenda = async (
  usuarioid: string,
  start: string | Date,
  end: string | Date
): Promise<AgendaEvent[]> => {
  const { data } = await apiClient.get<AgendaEvent[]>(
    `/agenda/${usuarioid}?start=${encodeURIComponent(normalizeDate(start))}&end=${encodeURIComponent(normalizeDate(end))}`
  )
  return data
}

/**
 * ✅ Crear un nuevo evento
 * 
 * POST /agenda
 * 
 * @param payload - Datos del evento a crear
 * 
 * @returns Promise<AgendaEvent>
 * 
 * @example
 * const newEvent = await agendaService.create({
 *   usuarioid: 'user-123',
 *   titulo: 'Audiencia judicial',
 *   fechaInicio: '2026-07-15T09:00:00Z',
 *   fechaFin: '2026-07-15T10:00:00Z',
 *   tipo: 'AUDIENCIA',
 *   estado: 'PENDIENTE',
 *   descripcion: 'Audiencia ante juzgado'
 * })
 */
export const create = async (
  payload: CreateAgendaEventPayload
): Promise<AgendaEvent> => {
  const { data } = await apiClient.post<AgendaEvent>('/agenda', payload)
  return data
}

/**
 * ✅ Actualizar el estado de un evento
 * 
 * PATCH /agenda/{id}/estado?usuarioid={usuarioid}
 * 
 * @param id - ID del evento a actualizar
 * @param usuarioid - ID del usuario propietario del evento
 * @param estado - Nuevo estado del evento
 * 
 * @returns Promise<AgendaEvent>
 * 
 * @example
 * const updated = await agendaService.updateStatus(
 *   'evt-001',
 *   'user-123',
 *   'COMPLETADO'
 * )
 */
export const updateStatus = async (
  id: string,
  usuarioid: string,
  estado: AgendaEventStatus
): Promise<AgendaEvent> => {
  const { data } = await apiClient.patch<AgendaEvent>(
    `/agenda/${id}/estado?usuarioid=${encodeURIComponent(usuarioid)}`,
    { estado } satisfies UpdateAgendaEventStatusPayload
  )
  return data
}

/**
 * ✅ Actualizar fechas de un evento (usado por Drag & Drop)
 * 
 * PATCH /agenda/{id}/fechas?usuarioid={usuarioid}
 * 
 * @param id - ID del evento
 * @param usuarioid - ID del usuario propietario
 * @param fechaInicio - Nueva fecha/hora de inicio (ISO 8601)
 * @param fechaFin - Nueva fecha/hora de fin (ISO 8601)
 * 
 * @returns Promise<AgendaEvent>
 * 
 * @example
 * // Cuando el usuario arrastra un evento en el calendario
 * const updated = await agendaService.updateDates(
 *   'evt-001',
 *   'user-123',
 *   '2026-07-20T09:00:00Z',
 *   '2026-07-20T10:00:00Z'
 * )
 */
export const updateDates = async (
  id: string,
  usuarioid: string,
  fechaInicio: string | Date,
  fechaFin: string | Date
): Promise<AgendaEvent> => {
  const { data } = await apiClient.patch<AgendaEvent>(
    `/agenda/${id}/fechas?usuarioid=${encodeURIComponent(usuarioid)}`,
    {
      fechaInicio: normalizeDate(fechaInicio),
      fechaFin: normalizeDate(fechaFin),
    }
  )
  return data
}

// ────────────────────────────────────────────────────────────
// UTILIDADES PRIVADAS
// ────────────────────────────────────────────────────────────

/**
 * Convierte Date a ISO string, o devuelve el string si ya lo es
 */
const normalizeDate = (value: string | Date): string =>
  typeof value === 'string' ? value : value.toISOString()

// ────────────────────────────────────────────────────────────
// ERRORES ESPERADOS
// ────────────────────────────────────────────────────────────

// 400 Bad Request
//   - Campos faltantes o inválidos
//   - Formato de fecha incorrecto
//
// 401 Unauthorized
//   - Token expirado o no proporcionado
//   - Usuario no autenticado
//
// 403 Forbidden
//   - Usuario intenta editar evento de otro usuario
//
// 404 Not Found
//   - Evento no existe
//
// 500 Internal Server Error
//   - Error en el servidor

// ────────────────────────────────────────────────────────────
// NOTAS DE IMPLEMENTACIÓN
// ────────────────────────────────────────────────────────────

// 1. AUTENTICACIÓN
//    - JWT se inyecta automáticamente por apiClient
//    - Header: Authorization: Bearer <token>
//
// 2. ZONAS HORARIAS
//    - Todas las fechas se envían en ISO 8601 (UTC)
//    - El frontend convierte a hora local para UI
//
// 3. VALIDACIÓN USUARIOID
//    - El backend debe validar que usuarioid coincida con el token JWT
//    - Evita que un usuario edite eventos de otros usuarios
//
// 4. DRAG & DROP
//    - updateDates() se invoca automáticamente al soltar un evento
//    - Si falla, se puede mostrar error pero el evento se revierte en la UI
//
// 5. PAGINACIÓN (FUTURA)
//    - Actualmente devuelve todos los eventos del rango
//    - Considerar agregar limit/offset para rangos muy grandes
