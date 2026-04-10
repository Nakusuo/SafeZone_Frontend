/**
 * SafeZone - Estructura Modular del Frontend
 * 
 * Arquitectura basada en módulos de dominio para máxima escalabilidad
 */

// ============================================================================
// 🛡️ MÓDULO VÍCTIMA (Seguridad Proactiva)
// ============================================================================
// Necesidad: Privacidad extrema y registro rápido
//
// Estructura:
// - modules/victim/components/
//   * PanicButton - Botón de emergencia
//   * FormularioDenuncia - Creación de reportes
//   * DashboardVictima - Vista general de denuncias
//
// - modules/victim/services/
//   * reportService - POST /api/denuncias, GET /api/denuncias/mis-casos
//   * victimService - Gestión de perfiles de víctimas
//
// - modules/victim/types/
//   * Report, ReportAttachment, CreateReportDto, VictimProfile
//
// Endpoints REST principales:
// POST   /api/denuncias           - Registra el incidente
// GET    /api/denuncias/mis-casos - Recupera historial de esa víctima
// POST   /api/evidencias/upload   - Sube archivos a Azure Blob Storage

// ============================================================================
// 🧠 MÓDULO PSICÓLOGO (Gestión Clínica)
// ============================================================================
// Necesidad: Visualización de historial y registro de evolución
//
// Estructura:
// - modules/psychologist/components/
//   * ListaCasosAsignados - Casos del psicólogo con filtros
//   * EditorBitacora - Registro de notas de sesiones
//   * MetricsChart - Gráficos de evolución del paciente
//
// - modules/psychologist/services/
//   * psychologistService - Gestión de casos y notas
//   * psychologistStatsService - Estadísticas y evoluciones
//
// - modules/psychologist/types/
//   * CaseFollow, SessionNote, CreateSessionNoteDto, PsychologistStats
//
// Endpoints REST principales:
// GET    /api/seguimientos/psicologo/{id}     - Lista casos vinculados
// POST   /api/seguimientos/notas              - Registra sesión emocional
// GET    /api/seguimientos/{id}/notas         - Obtiene notas
// PUT    /api/seguimientos/{id}               - Actualiza estado

// ============================================================================
// ⚖️ MÓDULO DEFENSOR LEGAL (Gestión Jurídica)
// ============================================================================
// Necesidad: Acceso a pruebas y coordinación interdisciplinaria
//
// Estructura:
// - modules/defender/components/
//   * ExpedienteLegal - Vista completa con interoperabilidad
//   * CalendarioAudiencias - Calendario de audiencias programadas
//
// - modules/defender/services/
//   * defenderService - Gestión de casos legales
//   * hearingService - Gestión de audiencias
//
// - modules/defender/types/
//   * LegalCase, LegalFile, CaseHearing, InteroperabilityData
//
// Endpoints REST principales:
// GET    /api/casos/detalle/{id}     - Vista completa (incluye notas psicólogo)
// GET    /api/casos                  - Lista de casos del defensor
// GET    /api/audiencias/calendario  - Calendario de audiencias
// POST   /api/audiencias             - Crea audiencia
//
// INTEROPERABILIDAD:
// - El expediente legal accede a notas del psicólogo
// - Coordinación de datos entre módulos

// ============================================================================
// 🔐 MÓDULO AUTH (Autenticación & Autorización)
// ============================================================================
// - modules/auth/components/ - Componentes de login/registro
// - modules/auth/services/   - Servicios de autenticación
// - modules/auth/types/      - Tipos de autenticación

// ============================================================================
// 🔄 MÓDULO SHARED (Recursos Compartidos)
// ============================================================================
// Componentes comunes utilizados por todos los módulos:
// - Alert, Button, Card, DataTable, FormFields, Header
// - Layout, Modal, ProtectedRoute, Sidebar, Timeline
//
// Servicios compartidos:
// - api.ts - Cliente HTTP configurado
// - auth.ts - Servicios de autenticación
// - localStorage.ts - Persistencia local
//
// Tipos globales:
// - UserRole, User, AuthToken, ApiError, ApiResponse

// ============================================================================
// FLUJO DE IMPORTACIONES RECOMENDADAS
// ============================================================================

// Para módulo Víctima:
// import { PanicButton, FormularioDenuncia, DashboardVictima } from '@/modules/victim/components';
// import { reportService, victimService } from '@/modules/victim/services';
// import type { Report, CreateReportDto } from '@/modules/victim/types';

// Para módulo Psicólogo:
// import { ListaCasosAsignados, EditorBitacora, MetricsChart } from '@/modules/psychologist/components';
// import { psychologistService } from '@/modules/psychologist/services';
// import type { CaseFollow, SessionNote } from '@/modules/psychologist/types';

// Para módulo Defensor:
// import { ExpedienteLegal, CalendarioAudiencias } from '@/modules/defender/components';
// import { defenderService, hearingService } from '@/modules/defender/services';
// import type { LegalCase, CaseHearing } from '@/modules/defender/types';

// Componentes Shared:
// import { Button, Card, Alert } from '@/shared/components';
// import { api } from '@/shared/services';

// ============================================================================
// BENEFICIOS DE ESTA ARQUITECTURA
// ============================================================================
// ✅ Separación de responsabilidades clara
// ✅ Fácil de escalar con nuevos módulos
// ✅ Cada equipo puede trabajar en su módulo sin conflictos
// ✅ Reutilización de componentes compartidos
// ✅ Interoperabilidad demostrada (Defensor accede a datos de Psicólogo)
// ✅ Tipado completo con TypeScript
// ✅ Servicios centralizados por dominio

export default 'SafeZone Architecture v1.0';
