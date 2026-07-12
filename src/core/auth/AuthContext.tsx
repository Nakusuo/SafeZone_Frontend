import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User, UserRole } from '@/shared/types'

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
const AUTH_TOKEN_KEY = 'token'
const AUTH_USER_KEY = 'user'

const getStorage = () => {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

const getFallbackStorage = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage
}

const extractUserId = (record: Record<string, unknown>): string => {
  return (
    (typeof record.id === 'string' && record.id) ||
    (typeof record.usuarioid === 'string' && record.usuarioid) ||
    (typeof record.usuarioId === 'string' && record.usuarioId) ||
    (typeof record.userId === 'string' && record.userId) ||
    ''
  )
}

const extractUserName = (record: Record<string, unknown>): string => {
  return (
    (typeof record.name === 'string' && record.name) ||
    [record.nombre, record.apellido, record.lastName]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .join(' ')
      .trim() ||
    ''
  )
}

const normalizeStoredUser = (value: unknown): User | null => {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const id = extractUserId(record)
  if (!id) return null

  return {
    id,
    name: extractUserName(record),
    email: typeof record.email === 'string' ? record.email : '',
    role: (typeof record.role === 'string' ? record.role : 'VICTIM') as UserRole,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
  }
}

const readStoredAuth = () => {
  if (typeof window === 'undefined') return { token: null, user: null as User | null }

  const primaryStorage = getStorage()
  const secondaryStorage = getFallbackStorage()

  const readFromStorage = (storage: Storage | null) => {
    if (!storage) return { token: null, user: null as User | null }

    try {
      const storedToken = storage.getItem(AUTH_TOKEN_KEY)
      const storedUser = storage.getItem(AUTH_USER_KEY)
      if (!storedToken || !storedUser) return { token: null, user: null as User | null }

      const parsedUser = JSON.parse(storedUser)
      const normalizedUser = normalizeStoredUser(parsedUser)
      if (!normalizedUser) return { token: null, user: null as User | null }

      return { token: storedToken, user: normalizedUser }
    } catch (error) {
      console.warn('Error restaurando sesión:', error)
      storage.removeItem(AUTH_TOKEN_KEY)
      storage.removeItem(AUTH_USER_KEY)
      return { token: null, user: null as User | null }
    }
  }

  const fromPrimary = readFromStorage(primaryStorage)
  if (fromPrimary.token && fromPrimary.user) return fromPrimary

  return readFromStorage(secondaryStorage)
}

const persistAuth = (token: string, user: User) => {
  if (typeof window === 'undefined') return

  const normalizedUser = normalizeStoredUser(user) ?? user
  const serializedUser = JSON.stringify(normalizedUser)

  const storages = [window.localStorage, window.sessionStorage]
  storages.forEach((storage) => {
    storage.setItem(AUTH_TOKEN_KEY, token)
    storage.setItem(AUTH_USER_KEY, serializedUser)
  })
}

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return

  const storages = [window.localStorage, window.sessionStorage]
  storages.forEach((storage) => {
    storage.removeItem(AUTH_TOKEN_KEY)
    storage.removeItem(AUTH_USER_KEY)
  })
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialAuth = readStoredAuth()
  const [user, setUser] = useState<User | null>(initialAuth.user)
  const [token, setToken] = useState<string | null>(initialAuth.token)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    const normalizedUser = normalizeStoredUser(newUser) ?? newUser
    if (!normalizedUser.id) {
      console.error('Login error: User ID is missing after normalization')
      return
    }
    persistAuth(newToken, normalizedUser)
    setToken(newToken)
    setUser(normalizedUser)
  }

  const logout = () => {
    clearStoredAuth()
    setToken(null)
    setUser(null)
  }

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
