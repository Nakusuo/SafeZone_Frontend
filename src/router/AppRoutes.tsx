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
import { DefenderDashboard } from '../pages/defender/DefenderDashboard'
import { DebugPage } from '../pages/debug/DebugPage'

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
