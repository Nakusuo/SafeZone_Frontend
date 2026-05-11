import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '@/shared/types'

// Usá useAuth() en cualquier componente en vez de leer sessionStorage directo
interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  hasRole: (role: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Al montar la app, recuperamos la sesión si el usuario ya estaba logueado
  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem('token')
      const storedUser = sessionStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.warn('Error restaurando sesión:', error)
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    sessionStorage.setItem('token', newToken)
    sessionStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  // Acepta un rol o un array de roles
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    if (Array.isArray(role)) return role.includes(user.role)
    return user.role === role
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook principal — lanza error si se usa fuera del AuthProvider
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
