import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = sessionStorage.getItem('token')
  const user = sessionStorage.getItem('user')

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    const userData = JSON.parse(user)
    if (userData.role !== requiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
