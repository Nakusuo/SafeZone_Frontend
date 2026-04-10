import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Layout } from '../components/Layout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { VictimDashboard } from '../pages/victim/VictimDashboard'
import { CreateReportPage } from '../pages/victim/CreateReportPage'
import { ReportDetailPage } from '../pages/victim/ReportDetailPage'
import { ProfilePage } from '../pages/victim/ProfilePage'
import { MyReportsPage } from '../pages/victim/MyReportsPage'
import { PsychologistDashboard } from '../pages/psychologist/PsychologistDashboard'
import { CasesPage as PsychologistCasesPage } from '../pages/psychologist/CasesPage'
import { SessionFormPage } from '../pages/psychologist/SessionFormPage'
import { DefenderDashboard } from '../pages/defender/DefenderDashboard'
import { DefenderCasesPage } from '../pages/defender/CasesPage'
import { LegalUpdatePage } from '../pages/defender/LegalUpdatePage'
import { HelpPage } from '../pages/victim/HelpPage'
import { PasswordPage } from '../pages/victim/PasswordPage'
import { DebugPage } from '../pages/debug/DebugPage'

// NEW IMPORTS - Admin Module
import { TriageView } from '../modules/admin/pages'

// NEW IMPORTS - Shared Features
import { NotificationCenter } from '../modules/shared-features/notifications/pages'
import { CaseClosureView } from '../modules/shared-features/case-closure/pages'
import { ChatView } from '../modules/shared-features/chat/pages'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas por rol */}
      <Route
        path="/dashboard/victim"
        element={
          <ProtectedRoute requiredRole="VICTIM">
            <Layout>
              <VictimDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/victim/create-report"
        element={
          <ProtectedRoute requiredRole="VICTIM">
            <Layout>
              <CreateReportPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/victim/report/:reportId"
        element={
          <ProtectedRoute requiredRole="VICTIM">
            <Layout>
              <ReportDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/victim/profile"
        element={
          <ProtectedRoute requiredRole="VICTIM">
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/victim/my-reports"
        element={
          <ProtectedRoute requiredRole="VICTIM">
            <Layout>
              <MyReportsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/psychologist"
        element={
          <ProtectedRoute requiredRole="PSYCHOLOGIST">
            <Layout>
              <PsychologistDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/defender"
        element={
          <ProtectedRoute requiredRole="DEFENDER">
            <Layout>
              <DefenderDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/psychologist/cases"
        element={
          <ProtectedRoute requiredRole="PSYCHOLOGIST">
            <Layout>
              <PsychologistCasesPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/defender/cases"
        element={
          <ProtectedRoute requiredRole="DEFENDER">
            <Layout>
              <DefenderCasesPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/psychologist/session-form"
        element={
          <ProtectedRoute requiredRole="PSYCHOLOGIST">
            <Layout>
              <SessionFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/defender/legal-update"
        element={
          <ProtectedRoute requiredRole="DEFENDER">
            <Layout>
              <LegalUpdatePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/victim/help"
        element={
          <ProtectedRoute requiredRole="VICTIM">
            <Layout>
              <HelpPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/victim/password"
        element={
          <ProtectedRoute requiredRole="VICTIM">
            <Layout>
              <PasswordPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ===== NEW ROUTES - ADMIN MODULE ===== */}
      <Route
        path="/admin/triage"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <TriageView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/gestor/pendientes"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <TriageView />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ===== NEW ROUTES - NOTIFICATIONS ===== */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute requiredRole={['VICTIM', 'PSYCHOLOGIST', 'DEFENDER', 'ADMIN']}>
            <Layout>
              <NotificationCenter />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ===== NEW ROUTES - CASE CLOSURE ===== */}
      <Route
        path="/casos/:caseId/cerrar"
        element={
          <ProtectedRoute requiredRole={['VICTIM', 'PSYCHOLOGIST', 'DEFENDER']}>
            <Layout>
              <CaseClosureView />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ===== NEW ROUTES - CHAT/MESSAGING ===== */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute requiredRole={['VICTIM', 'PSYCHOLOGIST', 'DEFENDER', 'ADMIN']}>
            <Layout>
              <ChatView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:conversationId"
        element={
          <ProtectedRoute requiredRole={['VICTIM', 'PSYCHOLOGIST', 'DEFENDER', 'ADMIN']}>
            <Layout>
              <ChatView />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Ruta de debugging - Solo desarrollo */}
      <Route
        path="/debug"
        element={
          <Layout>
            <DebugPage />
          </Layout>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
