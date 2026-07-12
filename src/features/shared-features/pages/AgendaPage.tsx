import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, CalendarPlus, Clock3, Sparkles } from 'lucide-react'
import { Button, Input, Modal, Select, TextArea } from '@/shared/components'
import { useAuth } from '@/core/auth/AuthContext'
import {
  agendaService,
  type AgendaEvent,
  type AgendaEventStatus,
  type AgendaEventType,
  type CreateAgendaEventPayload,
} from '@/features/shared-features/services/agendaService'
import { parseCalendarDate, toBackendDateTime, toDateTimeInputValue } from '@/features/shared-features/utils/calendarDate'
import { userService } from '@/features/victim/services/userService'
import type { UserRole, User } from '@/shared/types'

type AgendaFormState = {
  usuarioid: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  tipo: AgendaEventType
  estado: AgendaEventStatus
  descripcion: string
  profesionalId: string
}

const eventTypeOptions: Array<{ value: AgendaEventType; label: string }> = [
  { value: 'AUDIENCIA', label: 'Audiencia' },
  { value: 'CITA_PSICOLOGICA', label: 'Cita psicológica' },
  { value: 'PLAZO_LEGAL', label: 'Plazo legal' },
]

const eventStatusOptions: Array<{ value: AgendaEventStatus; label: string }> = [
  { value: 'PENDIENTE', label: 'Pendiente' },
]

const titleSuggestionsByType: Record<AgendaEventType, string[]> = {
  CITA_PSICOLOGICA: ['Sesión de Soporte Emocional', 'Evaluación Psicológica Inicial', 'Terapia de Seguimiento', 'Otro...'],
  AUDIENCIA: ['Audiencia de Medidas de Protección', 'Audiencia de Control de Acusación', 'Juicio Oral - Continuación', 'Otro...'],
  PLAZO_LEGAL: ['Vencimiento de Plazo de Investigación', 'Presentación de Escrito de Defensa', 'Otro...'],
}

const getAvailableEventTypes = (role?: UserRole) => {
  if (role === 'ADMIN') return eventTypeOptions
  return [{ value: 'CITA_PSICOLOGICA', label: 'Cita psicológica' }]
}

const isEventTypeRestrictedRole = (role?: UserRole) => role === 'VICTIM' || role === 'PSYCHOLOGIST'

const createInitialFormState = (userId: string, baseDate: Date): AgendaFormState => {
  const start = new Date(baseDate)
  start.setHours(9, 0, 0, 0)
  const end = new Date(baseDate)
  end.setHours(10, 0, 0, 0)

  return {
    usuarioid: userId,
    titulo: '',
    fechaInicio: toDateTimeInputValue(start),
    fechaFin: toDateTimeInputValue(end),
    tipo: 'CITA_PSICOLOGICA',
    estado: 'PENDIENTE',
    descripcion: '',
    profesionalId: '',
  }
}

export const AgendaPage = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [professionals, setProfessionals] = useState<User[]>([])
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [manageState, setManageState] = useState<AgendaEventStatus>('ACEPTADA')
  const [manageLink, setManageLink] = useState('')

  const [formData, setFormData] = useState<AgendaFormState>({
    usuarioid: user?.id ?? '',
    titulo: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: 'CITA_PSICOLOGICA',
    estado: 'PENDIENTE',
    descripcion: '',
    profesionalId: '',
  })

  useEffect(() => {
    if (!user?.id) return
    setFormData((prev) => ({
      ...prev,
      usuarioid: user.id,
    }))
    loadProfessionals()
  }, [user?.id])

  const loadProfessionals = async () => {
    try {
      const profs = await userService.getPsychologists()
      setProfessionals(profs)
    } catch (err) {
      console.error('Error cargando psicólogos:', err)
    }
  }

  const loadCitas = useCallback(async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError('')

    try {
      let agenda: AgendaEvent[] = []
      if (user.role === 'VICTIM') {
        agenda = await agendaService.getVictimAgenda()
      } else if (user.role === 'PSYCHOLOGIST') {
        agenda = await agendaService.getPsychologistAgenda()
      } else if (user.role === 'ADMIN') {
        agenda = []
      }

      setEvents(agenda)
      setSelectedEvent((current) => (current ? agenda.find((event) => event.id === current.id) ?? null : null))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la agenda'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, user?.role])

  useEffect(() => {
    if (!user?.id) return

    if (user.role === 'VICTIM' || user.role === 'PSYCHOLOGIST') {
      void loadCitas()
    } else if (user.role === 'ADMIN') {
      setEvents([])
      setSelectedEvent(null)
    }
  }, [loadCitas, user?.id, user?.role])

  const openCreateModal = (date: Date | string) => {
    const baseDate = parseCalendarDate(date) ?? new Date(date)
    const nextDate = baseDate instanceof Date ? baseDate : new Date(date)
    setSelectedDate(nextDate)
    setFormData(createInitialFormState(user?.id ?? '', nextDate))
    setCustomTitle('')
    setError('')
    setSuccess('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user?.id) return setError('Debes iniciar sesión para crear un evento')
    if (!user.name) return setError('No se pudo obtener tu nombre')
    if (!formData.profesionalId) return setError('Debes seleccionar un psicólogo')

    const titleValue = formData.titulo.trim() || customTitle.trim()
    if (!titleValue) return setError('El título es obligatorio')

    const startDate = new Date(formData.fechaInicio)
    const endDate = new Date(formData.fechaFin)
    if (startDate >= endDate) {
      return setError('La fecha de fin debe ser posterior a la fecha de inicio')
    }

    const selectedProfessional = professionals.find((p) => p.id === formData.profesionalId)
    if (!selectedProfessional) return setError('Psicólogo seleccionado no válido')

    const eventType = isEventTypeRestrictedRole(user.role) ? 'CITA_PSICOLOGICA' : formData.tipo

    setIsSaving(true)
    setError('')

    try {
      const payload: CreateAgendaEventPayload = {
        usuarioid: user.id,
        usuarioNombre: user.name,
        titulo: titleValue,
        fechaInicio: toBackendDateTime(formData.fechaInicio),
        fechaFin: toBackendDateTime(formData.fechaFin),
        tipo: eventType,
        estado: formData.estado,
        descripcion: formData.descripcion.trim() || undefined,
        profesionalId: formData.profesionalId,
        profesionalNombre: selectedProfessional.name,
      }

      await agendaService.create(payload)
      setSuccess('Evento creado correctamente')
      setIsModalOpen(false)
      void loadCitas()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo crear el evento'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

const formatAgendaDate = (value?: string | null) => {
    if (!value) return 'Fecha no disponible'
    const date = new Date(value)
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const sortedEvents = useMemo(() => {
    return [...events].sort((left, right) => {
      const leftDate = new Date(left.fechaInicio).getTime()
      const rightDate = new Date(right.fechaInicio).getTime()
      return leftDate - rightDate
    })
  }, [events])

  const headerSummary = useMemo(() => {
    const count = events.length
    return `${count} ${count === 1 ? 'evento' : 'eventos'} registrados`
  }, [events.length])

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-gray-800">Inicia sesión para ver tu agenda</p>
      </div>
    )
  }

  const handleOpenManageModal = (event: AgendaEvent) => {
    setSelectedEvent(event)
    setManageState(event.estado === 'PENDIENTE' ? 'ACEPTADA' : event.estado)
    setManageLink(event.linkReunion ?? '')
    setIsManageModalOpen(true)
  }

  const handleManageSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedEvent?.id) return

    try {
      setIsSaving(true)
      await agendaService.manage(selectedEvent.id, {
        estado: manageState,
        linkReunion: manageLink.trim() || undefined,
      })
      setSuccess('Cita gestionada correctamente')
      setIsManageModalOpen(false)
      await loadCitas()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo gestionar la cita'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
              <CalendarDays className="h-4 w-4" />
              Agenda / Calendario
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Gestiona tus citas y trámites</h1>
            <p className="mt-2 text-sm text-gray-600">Visualiza, organiza y programa tus compromisos sin dependencias pesadas.</p>
          </div>

          <Button
            onClick={() => openCreateModal(selectedDate)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 transition-colors"
          >
            <CalendarPlus className="h-4 w-4" />
            Nuevo evento
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{isLoading ? 'Cargando...' : headerSummary}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Sugerencia</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Haz clic en un día para crear o revisar tus eventos.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Herramienta</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <Clock3 className="h-4 w-4 text-blue-500" />
              El calendario sirve para organizar tus citas y plazos legales de manera eficiente.
            </p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              {user.role === 'PSYCHOLOGIST' ? 'Gestión de citas asignadas' : user.role === 'VICTIM' ? 'Historial de citas' : 'Agenda administrativa'}
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.role === 'PSYCHOLOGIST' ? 'Tus citas pendientes y gestionadas' : 'Listado de eventos'}
            </h2>
          </div>
          {user.role !== 'PSYCHOLOGIST' && (
            <Button onClick={() => openCreateModal(selectedDate)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 transition-colors">
              <CalendarPlus className="h-4 w-4" />
              Nuevo evento
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">Cargando agenda...</div>
          ) : sortedEvents && sortedEvents.length > 0 ? (
            sortedEvents.map((event) => {
              const startDate = parseCalendarDate(event.fechaInicio)
              const endDate = parseCalendarDate(event.fechaFin)
              const dateLabel = startDate
                ? `${startDate.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}${endDate ? ` - ${endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}` : ''}`
                : 'Fecha no disponible'

              return (
                <div key={event.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">{event.titulo || 'Sin título'}</p>
                    <p className="text-sm uppercase tracking-[0.15em] text-slate-500">{event.tipo?.replace(/_/g, ' ') ?? 'Tipo no definido'}</p>
                    <p className="text-sm text-slate-600">{dateLabel}</p>
                    {user.role === 'VICTIM' && (
                      <>
                        <p className="text-sm text-slate-600">Psicólogo: {event.profesionalNombre ?? 'Sin psicólogo asignado'}</p>
                        {event.linkReunion && (
                          <a
                            href={event.linkReunion.startsWith('http') ? event.linkReunion : `https://${event.linkReunion}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm gap-2"
                          >
                            <span>Unirse a la Reunión</span>
                          </a>
                        )}
                      </>
                    )}
                    {user.role === 'PSYCHOLOGIST' && (
                      <p className="text-sm text-slate-600">Víctima: {event.usuarioNombre ?? 'Nombre no disponible'}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{event.estado}</span>
                    {user.role === 'PSYCHOLOGIST' && event.estado === 'PENDIENTE' && (
                      <Button onClick={() => handleOpenManageModal(event)} className="bg-teal-600 hover:bg-teal-700">
                        Gestionar cita
                      </Button>
                    )}
                    {user.role === 'VICTIM' && (
                      <Button variant="secondary" onClick={() => setSelectedEvent(event)}>
                        Ver detalle
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">No tienes citas programadas.</div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear evento"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => formRef.current?.requestSubmit()} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar evento'}
            </Button>
          </div>
        }
      >
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full">
            <Select
              label="Título sugerido"
              options={titleSuggestionsByType[formData.tipo].map((option) => ({ value: option, label: option }))}
              value={formData.titulo}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, titulo: value }))
                setCustomTitle('')
              }}
              placeholder="Selecciona un título"
            />
          </div>

          {formData.titulo === 'Otro...' && (
            <div className="w-full">
              <Input
                label="Título personalizado"
                placeholder="Escribe un título manual"
                value={customTitle}
                onChange={(value) => {
                  setCustomTitle(value)
                  setFormData((prev) => ({ ...prev, titulo: value }))
                }}
                required
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Inicio"
              type="datetime-local"
              value={formData.fechaInicio}
              onChange={(value) => setFormData((prev) => ({ ...prev, fechaInicio: value }))}
              required
            />
            <Input
              label="Fin"
              type="datetime-local"
              value={formData.fechaFin}
              onChange={(value) => setFormData((prev) => ({ ...prev, fechaFin: value }))}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Tipo"
              options={getAvailableEventTypes(user?.role)}
              value={formData.tipo}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, tipo: value as AgendaEventType, titulo: '' }))
                setCustomTitle('')
              }}
              disabled={isEventTypeRestrictedRole(user?.role)}
            />
            <Select
              label="Estado"
              options={eventStatusOptions}
              value={formData.estado}
              onChange={(value) => setFormData((prev) => ({ ...prev, estado: value as AgendaEventStatus }))}
            />
          </div>

          {user?.role === 'VICTIM' && (
            <Select
              label="Psicólogo"
              options={professionals.map((prof) => ({ value: prof.id, label: prof.name }))}
              value={formData.profesionalId}
              onChange={(value) => setFormData((prev) => ({ ...prev, profesionalId: value }))}
              placeholder="Selecciona un psicólogo"
              required
            />
          )}

          <TextArea
            label="Descripción"
            placeholder="Agrega información relevante para el evento"
            value={formData.descripcion}
            onChange={(value) => setFormData((prev) => ({ ...prev, descripcion: value }))}
            rows={4}
          />
        </form>
      </Modal>

      <Modal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Gestionar cita"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsManageModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => void handleManageSubmit(new Event('submit') as unknown as React.FormEvent)} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        }
      >
        {selectedEvent && (
          <form onSubmit={handleManageSubmit} className="space-y-4">
            <Select
              label="Estado"
              options={[
                { value: 'ACEPTADA', label: 'Aceptada' },
                { value: 'RECHAZADA', label: 'Rechazada' },
                { value: 'COMPLETADA', label: 'Completada' },
              ]}
              value={manageState}
              onChange={(value) => setManageState(value as AgendaEventStatus)}
            />
            <Input
              label="Link de reunión"
              placeholder="https://meet.google.com/..."
              value={manageLink}
              onChange={setManageLink}
            />
          </form>
        )}
      </Modal>
    </div>
  )
}