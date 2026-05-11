import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/core/auth/AuthContext'
import AppRoutes from '@/core/router/AppRoutes'
import './App.css'

// ============================================================
// App — Raíz de la aplicación
// AuthProvider envuelve toda la app para que cualquier
// componente pueda usar useAuth() y acceder al usuario actual.
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
