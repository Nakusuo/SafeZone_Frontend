import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/core/auth/AuthContext'
import AppRoutes from '@/core/router/AppRoutes'
import './App.css'







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
