import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { AuthResponse, User, UserRole } from '@/shared/types'
import mockData from '@/data/mockData.json'

type BackendUserDto = {
  id?: string
  usuarioid?: string
  usuarioId?: string
  userId?: string
  name?: string
  nombre?: string
  apellido?: string
  lastName?: string
  email: string
  role: UserRole
  createdAt?: string
}

type BackendAuthResponse = {
  token: string
  user: BackendUserDto | User
}

type RegisterPayload = {
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
  roles: UserRole
  region: {
    id: string
    nombre: string
  }
}

const delay = (ms = config.MOCK_DELAY) =>
  new Promise((r) => setTimeout(r, ms))

const STORAGE_KEY = 'safezone_appdata'

const getMockData = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    
  }

  return JSON.parse(JSON.stringify(mockData))
}

const saveMockData = (data: unknown) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    
  }
}

const mapBackendUser = (user: BackendUserDto | User): User => {
  const record = user as BackendUserDto
  const resolvedId = record.id || record.usuarioid || record.usuarioId || record.userId || ''
  const resolvedName =
    record.name ||
    [record.nombre, record.apellido, record.lastName]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .join(' ')
      .trim() ||
    ''

  return {
    id: resolvedId,
    name: resolvedName,
    email: record.email,
    role: record.role,
    createdAt: record.createdAt || new Date().toISOString(),
  }
}

const normalizeAuthResponse = (
  response: BackendAuthResponse | AuthResponse
): AuthResponse => ({
  token: response.token,
  user: mapBackendUser(response.user),
})

const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  await delay()
  const data = getMockData()
  const user = data.users.find((u: any) => u.email === email && u.password === password)
  if (!user) throw new Error('Credenciales inválidas')
  return {
    token: `mock_token_${user.id}_${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  }
}

const mockRegister = async (userData: RegisterPayload): Promise<AuthResponse> => {
  await delay()

  const data = getMockData()

  if (data.users.some((u: any) => u.email === userData.email)) {
    throw new Error('Este correo ya está registrado')
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name: `${userData.nombre} ${userData.apellido}`.trim(),
    email: userData.email,
    password: userData.password,
    role: userData.roles,
    createdAt: new Date().toISOString(),
  }

  data.users.push(newUser)
  saveMockData(data)

  return {
    token: `mock_token_${newUser.id}_${Date.now()}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    },
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (config.USE_MOCK) {
      console.log('⚠️ Estamos en modo MOCK')
      return mockLogin(email, password)
    }

    console.log('🔗 Intentando conectar a:', `${config.API_URL}/auth/login`)

    try {
      const response = await apiClient.post<BackendAuthResponse>('/auth/login', {
        email,
        password,
      })

      console.log('✅ Respuesta recibida:', response.data)

      return normalizeAuthResponse(response.data)
    } catch (error) {
      console.error('❌ Error en axios:', error)
      throw error
    }
  },

  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    if (config.USE_MOCK) {
      return mockRegister(userData)
    }

    const payload = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      telefono: userData.telefono,
      email: userData.email,
      password: userData.password,
      roles: userData.roles,
      region: userData.region,
    }

    console.log('📤 REGISTER PAYLOAD:', payload)

    const { data } = await apiClient.post<BackendAuthResponse>('/auth/register', payload)

    return normalizeAuthResponse(data)
  },

  logout: async (): Promise<void> => {
    if (!config.USE_MOCK) {
      try {
        await apiClient.post('/auth/logout')
      } catch {
        
      }
    }

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}