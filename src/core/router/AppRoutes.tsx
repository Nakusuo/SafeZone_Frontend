import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/core/auth/ProtectedRoute'

// ── Layout ─────────────────────────────────────────────────────
import { Layout } from '@/shared/components/layout/Layout'

// ── Auth ───────────────────────────────────────────────────────
import { LoginPage }    from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

// ── Victim ─────────────────────────────────────────────────────
import { VictimDashboard }  from '@/features/victim/pages/VictimDashboard'
import { CreateReportPage } from '@/features/victim/pages/CreateReportPage'
import { ReportDetailPage } from '@/features/victim/pages/ReportDetailPage'
import { ProfilePage }      from '@/features/victim/pages/ProfilePage'
import { MyReportsPage }    from '@/features/victim/pages/MyReportsPage'
import { HelpPage }         from '@/features/victim/pages/HelpPage'
import { PasswordPage }     from '@/features/victim/pages/PasswordPage'

// ── Psychologist ───────────────────────────────────────────────
import { PsychologistDashboard }              from '@/features/psychologist/pages/PsychologistDashboard'
import { CasesPage as PsychologistCasesPage } from '@/features/psychologist/pages/CasesPage'
import { SessionFormPage }                    from '@/features/psychologist/pages/SessionFormPage'

// ── Defender ──────────────────────────────────────────────────
import { DefenderDashboard }               from '@/features/defender/pages/DefenderDashboard'
import { DefenderCasesPage }               from '@/features/defender/pages/CasesPage'
import { LegalUpdatePage }                 from '@/features/defender/pages/LegalUpdatePage'

// ── Admin ─────────────────────────────────────────────────────
import { AdminDashboard } from '@/features/admin/pages/AdminDashboard'
import { TriageView }     from '@/features/admin/pages/TriageView'

// ── Shared Features ───────────────────────────────────────────
import { NotificationCenter } from '@/features/shared-features/notifications/pages'
import { CaseClosureView }    from '@/features/shared-features/case-closure/pages'
import { ChatView }           from '@/features/shared-features/chat/pages'


// ─────────────────────────────────────────────────────────────
// Componente helper para no repetir Layout + ProtectedRoute
// ─────────────────────────────────────────────────────────────
type Role = 'VICTIM' | 'PSYCHOLOGIST' | 'DEFENDER' | 'ADMIN'

const Protected = ({
  element,
  role,
}: {
  element: React.ReactElement
  role: Role | Role[]
}) => (
  <ProtectedRoute requiredRole={role}>
    <Layout>{element}</Layout>
  </ProtectedRoute>
)

// ─────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* ── Públicas ─────────────────────────────────────────── */}
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* ── Victim ───────────────────────────────────────────── */}
    <Route path="/dashboard/victim"        element={<Protected element={<VictimDashboard />}  role="VICTIM" />} />
    <Route path="/victim/create-report"    element={<Protected element={<CreateReportPage />} role="VICTIM" />} />
    <Route path="/victim/report/:reportId" element={<Protected element={<ReportDetailPage />} role="VICTIM" />} />
    <Route path="/victim/profile"          element={<Protected element={<ProfilePage />}      role="VICTIM" />} />
    <Route path="/victim/my-reports"       element={<Protected element={<MyReportsPage />}    role="VICTIM" />} />
    <Route path="/victim/help"             element={<Protected element={<HelpPage />}         role="VICTIM" />} />
    <Route path="/victim/password"         element={<Protected element={<PasswordPage />}     role="VICTIM" />} />

    {/* ── Psychologist ─────────────────────────────────────── */}
    <Route path="/dashboard/psychologist"    element={<Protected element={<PsychologistDashboard />} role="PSYCHOLOGIST" />} />
    <Route path="/psychologist/cases"        element={<Protected element={<PsychologistCasesPage />} role="PSYCHOLOGIST" />} />
    <Route path="/psychologist/session-form" element={<Protected element={<SessionFormPage />}       role="PSYCHOLOGIST" />} />

    {/* ── Defender ─────────────────────────────────────────── */}
    <Route path="/dashboard/defender"  element={<Protected element={<DefenderDashboard />} role="DEFENDER" />} />
    <Route path="/defender/cases"      element={<Protected element={<DefenderCasesPage />} role="DEFENDER" />} />
    <Route path="/defender/legal-update" element={<Protected element={<LegalUpdatePage />} role="DEFENDER" />} />

    {/* ── Admin ────────────────────────────────────────────── */}
    <Route path="/dashboard/admin" element={<Protected element={<AdminDashboard />} role="ADMIN" />} />
    <Route path="/admin/triage"    element={<Protected element={<TriageView />}     role="ADMIN" />} />
    <Route path="/admin/users"     element={<Protected element={<AdminDashboard />} role="ADMIN" />} />

    {/* ── Compartidas (multi-rol) ───────────────────────────── */}
    <Route path="/notifications"        element={<Protected element={<NotificationCenter />} role={['VICTIM','PSYCHOLOGIST','DEFENDER','ADMIN']} />} />
    <Route path="/casos/:caseId/cerrar" element={<Protected element={<CaseClosureView />}    role={['VICTIM','PSYCHOLOGIST','DEFENDER']} />} />
    <Route path="/chat"                 element={<Protected element={<ChatView />}           role={['VICTIM','PSYCHOLOGIST','DEFENDER','ADMIN']} />} />
    <Route path="/chat/:conversationId" element={<Protected element={<ChatView />}           role={['VICTIM','PSYCHOLOGIST','DEFENDER','ADMIN']} />} />


    {/* ── Redirección por defecto ───────────────────────────── */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)

export default AppRoutes
