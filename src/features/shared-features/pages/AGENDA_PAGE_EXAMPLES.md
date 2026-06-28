// ============================================================
// 📅 AGENDA PAGE - Exemplos de Uso y Patrones
// ============================================================
// Ubicación: src/features/shared-features/pages/AgendaPage.tsx
//
// Componente React que integra FullCalendar con autenticación
// y sincronización en tiempo real con el backend.
// ============================================================

// ────────────────────────────────────────────────────────────
// EJEMPLO 1: Importar y usar en otra página
// ────────────────────────────────────────────────────────────

import { AgendaPage } from '@/features/shared-features/pages/AgendaPage'

export const MyDashboard = () => {
  return (
    <div>
      <h1>Mi Dashboard</h1>
      {/* Simplemente incluir el componente */}
      <AgendaPage />
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// EJEMPLO 2: Usar desde otra ruta
// ────────────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom'

export const SomeComponent = () => {
  const navigate = useNavigate()
  
  const handleViewAgenda = () => {
    // Navega a la página de agenda
    navigate('/agenda')
  }

  return <button onClick={handleViewAgenda}>Ver Agenda</button>
}

// ────────────────────────────────────────────────────────────
// EJEMPLO 3: Crear evento mediante el formulario modal
// ────────────────────────────────────────────────────────────

// El usuario puede:
// 1. Hacer clic en un día del calendario
// 2. Se abre el modal "Crear evento"
// 3. Completa los campos:
//    - Título (obligatorio)
//    - Fecha inicio (datetime-local)
//    - Fecha fin (datetime-local)
//    - Tipo (AUDIENCIA | CITA_PSICOLOGICA | PLAZO_LEGAL)
//    - Estado (PENDIENTE | EN_PROCESO | COMPLETADO | CANCELADO)
//    - Descripción (opcional)
// 4. Hace clic en "Guardar evento"
// 5. Llamada POST /agenda → se sincroniza con backend
// 6. El evento aparece en el calendario

// FLOW EN CÓDIGO (interno del AgendaPage):
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault()
  
  const payload = {
    usuarioid: user.id,              // Extraído de useAuth()
    titulo: 'Mi evento',             // Del formulario
    fechaInicio: '2026-07-20T09:00:00Z',  // Convertido a ISO
    fechaFin: '2026-07-20T10:00:00Z',
    tipo: 'AUDIENCIA',
    estado: 'PENDIENTE',
    descripcion: 'Una descripción'
  }
  
  await agendaService.create(payload)  // POST /agenda
  await loadAgenda(start, end)          // Recarga los eventos
}

// ────────────────────────────────────────────────────────────
// EJEMPLO 4: Drag & Drop (arrastrar evento)
// ────────────────────────────────────────────────────────────

// El usuario:
// 1. Hace clic en un evento existente
// 2. Lo arrastra a una nueva fecha/hora
// 3. Suelta el evento
// 4. Se invoca handleEventDrop automáticamente

// FLOW EN CÓDIGO (interno):
const handleEventDrop = async (info: EventDropArg) => {
  if (!user?.id) return

  try {
    // Extrae la nueva fecha desde el evento movido
    const newStart = info.event.start ?? new Date()
    const newEnd = info.event.end ?? newStart
    
    // Llamada PATCH /agenda/{id}/fechas?usuarioid={usuarioid}
    await agendaService.updateDates(
      info.event.id,
      user.id,
      newStart,
      newEnd
    )
    
    // Mostrar mensaje de éxito
    setSuccess('Fecha del evento actualizada')
  } catch (err) {
    // Si falla, mostrar error
    setError('No se pudo mover el evento')
  }
}

// ────────────────────────────────────────────────────────────
// EJEMPLO 5: Cambiar estado de un evento
// ────────────────────────────────────────────────────────────

// El usuario hace clic en un evento (en UI extendida, no implementada aún)
// se abre un menú para cambiar el estado

import { agendaService } from '@/features/shared-features/services/agendaService'

const handleChangeEventStatus = async (eventId: string, newStatus: 'COMPLETADO' | 'CANCELADO') => {
  try {
    await agendaService.updateStatus(eventId, user?.id || '', newStatus)
    // Recargar calendario
    await loadAgenda(dateRange.start, dateRange.end)
  } catch (err) {
    console.error('Error actualizando estado:', err)
  }
}

// ────────────────────────────────────────────────────────────
// EJEMPLO 6: Cargar eventos para un mes específico
// ────────────────────────────────────────────────────────────

const loadEventsForMonth = async (year: number, month: number) => {
  const start = new Date(year, month, 1).toISOString()
  const end = new Date(year, month + 1, 0).toISOString()
  
  const events = await agendaService.getAgenda(user?.id || '', start, end)
  console.log(`Eventos de ${year}-${month}:`, events)
}

// Llamar:
loadEventsForMonth(2026, 7) // Julio 2026

// ────────────────────────────────────────────────────────────
// EJEMPLO 7: Filtrar eventos por tipo en el cliente
// ────────────────────────────────────────────────────────────

const filterEventsByType = (allEvents, type: 'AUDIENCIA' | 'CITA_PSICOLOGICA' | 'PLAZO_LEGAL') => {
  return allEvents.filter(evt => evt.extendedProps.tipo === type)
}

// Uso:
const audiencias = filterEventsByType(events, 'AUDIENCIA')
console.log(`Total de audiencias: ${audiencias.length}`)

// ────────────────────────────────────────────────────────────
// EJEMPLO 8: Conversión de fechas (datetime-local ↔ ISO)
// ────────────────────────────────────────────────────────────

// Convertir Date a formato datetime-local (para input)
const toDateTimeLocal = (value: Date | string): string => {
  const date = typeof value === 'string' ? new Date(value) : value
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

// Ejemplos:
toDateTimeLocal(new Date('2026-07-20T09:00:00Z'))
// → "2026-07-20T09:00" (para mostrar en input)

// Convertir datetime-local a ISO (para enviar al backend)
const localDateTime = '2026-07-20T09:00'
const isoString = new Date(localDateTime).toISOString()
// → "2026-07-20T09:00:00.000Z"

// ────────────────────────────────────────────────────────────
// EJEMPLO 9: Estructura de tipos esperada
// ────────────────────────────────────────────────────────────

// Evento del backend (agendaService.getAgenda)
interface AgendaEvent {
  id: string                           // UUID o ID único
  usuarioid: string                    // ID del propietario
  titulo: string                       // "Audiencia judicial"
  fechaInicio: string                  // "2026-07-15T09:00:00Z"
  fechaFin: string                     // "2026-07-15T10:00:00Z"
  tipo: 'AUDIENCIA' | 'CITA_PSICOLOGICA' | 'PLAZO_LEGAL'
  estado: 'PENDIENTE' | 'COMPLETADO' | 'EN_PROCESO' | 'CANCELADO'
  descripcion?: string                 // Opcional
}

// Evento del calendario (FullCalendar)
interface CalendarEventInput {
  id: string                           // Del evento del backend
  title: string                        // Título mostrado
  start: string                        // Fecha ISO
  end: string                          // Fecha ISO
  allDay?: boolean                     // false (eventos con hora)
  extendedProps: {                     // Datos personalizados
    tipo: AgendaEventType
    estado: AgendaEventStatus
    descripcion?: string
  }
}

// ────────────────────────────────────────────────────────────
// EJEMPLO 10: Manejo de errores comunes
// ────────────────────────────────────────────────────────────

try {
  await agendaService.create(payload)
} catch (err) {
  if (err instanceof Error) {
    // Error conocido
    if (err.message.includes('401')) {
      console.log('Sesión expirada, redirigiendo a login...')
      navigate('/login')
    } else if (err.message.includes('400')) {
      console.log('Datos inválidos enviados')
    } else {
      console.log('Error:', err.message)
    }
  } else {
    console.log('Error desconocido:', err)
  }
}

// ────────────────────────────────────────────────────────────
// EJEMPLO 11: Estados del componente
// ────────────────────────────────────────────────────────────

// Estados internos del AgendaPage:
// - isLoading: Cargando eventos desde la API
// - isSaving: Guardando un nuevo evento
// - error: Mensaje de error (rojo)
// - success: Mensaje de éxito (verde)
// - isModalOpen: Modal de crear evento abierto/cerrado
// - events: Array de eventos actuales

// Uso en el JSX:
{error && (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {error}
  </div>
)}

{success && (
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
    {success}
  </div>
)}

// ────────────────────────────────────────────────────────────
// EJEMPLO 12: Personalización de colores
// ────────────────────────────────────────────────────────────

// Función eventClassNames devuelve clases Tailwind por tipo y estado:

const eventClassNames = (arg: EventContentArg) => {
  const type = arg.event.extendedProps.tipo
  const status = arg.event.extendedProps.estado
  
  const base = 'rounded-md px-2 py-1 text-xs font-semibold shadow-sm border'
  
  // Color por tipo
  const typeClass = {
    AUDIENCIA: 'bg-red-500 border-red-600 text-white',        // 🔴 Crítico
    CITA_PSICOLOGICA: 'bg-blue-500 border-blue-600 text-white', // 🔵 Normal
    PLAZO_LEGAL: 'bg-amber-500 border-amber-600 text-white',   // 🟠 Atención
  }[type] ?? 'bg-slate-500 border-slate-600 text-white'
  
  // Efecto si está completado
  const statusClass = status === 'COMPLETADO' ? 'opacity-60 line-through' : ''
  
  return [base, typeClass, statusClass]
}

// Resultado visual:
// AUDIENCIA (COMPLETADO): 🔴 Rojo, opaco, tachado
// CITA_PSICOLOGICA (PENDIENTE): 🔵 Azul brillante, normal
// PLAZO_LEGAL (EN_PROCESO): 🟠 Naranja, normal

// ────────────────────────────────────────────────────────────
// NOTAS
// ────────────────────────────────────────────────────────────
//
// 1. El componente es totalmente responsivo (Tailwind CSS)
// 2. Todos los datos se sincronizan automáticamente con el backend
// 3. La autenticación se maneja vía contexto (useAuth)
// 4. Los errores de red se muestran en la UI
// 5. El drag & drop es nativo de FullCalendar
// 6. No requiere configuración adicional para funcionar
//
