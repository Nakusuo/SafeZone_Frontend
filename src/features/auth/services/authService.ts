import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { AuthResponse, User } from '@/shared/types'
import mockData from '@/data/mockData.json'

const delay = (ms = config.MOCK_DELAY) => new Promise((r) => setTimeout(r, ms))
const STORAGE_KEY = 'safezone_appdata'

// Leemos del sessionStorage primero, si no existe usamos el JSON de mockData
const getMockData = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* empty */ }
  return JSON.parse(JSON.stringify(mockData))
}

const saveMockData = (data: unknown) => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* empty */ }
}

const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  await delay()
  const data = getMockData()
  const user = data.users.find((u: any) => u.email === email && u.password === password)
  if (!user) throw new Error('Credenciales inválidas')
  return {
    token: `mock_token_${user.id}_${Date.now()}`,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  }
}

const mockRegister = async (userData: Partial<User> & { password: string }): Promise<AuthResponse> => {
  await delay()
  const data = getMockData()
  if (data.users.some((u: any) => u.email === userData.email)) {
    throw new Error('Este correo ya está registrado')
  }
  const newUser = {
    id: `user_${Date.now()}`,
    name: userData.name ?? '',
    email: userData.email ?? '',
    password: userData.password,
    role: userData.role ?? 'VICTIM',
    createdAt: new Date().toISOString(),
  }
  data.users.push(newUser)
  saveMockData(data)
  return {
    token: `mock_token_${newUser.id}_${Date.now()}`,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role as any, createdAt: newUser.createdAt },
  }
}

export const authService = {
  // Spring: POST /api/auth/login → { token, user }
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (config.USE_MOCK) {
        console.log("⚠️ Estamos en modo MOCK");
        return mockLogin(email, password);
    }
    
    console.log("🔗 Intentando conectar a:", config.API_URL + '/auth/login');
    try {
        const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
        console.log("✅ Respuesta recibida:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en axios:", error); // Esto SI tiene que salir
        throw error;
    }
},

  // Spring: POST /api/auth/register → { token, user }
  register: async (
  userData: Partial<User> & { password: string }
): Promise<AuthResponse> => {

  if (config.USE_MOCK) return mockRegister(userData)

  const payload = {
    nombre: userData.name,
    apellido: "Sin apellido",
    email: userData.email,
    password: userData.password,
    telefono: "999999999",
    roles: userData.role,

    region: {
      id: "region-1",
      nombre: "Lima"
    }
  }

  console.log("📤 Payload enviado:", payload)

  const { data } = await apiClient.post<AuthResponse>(
    '/auth/register',
    payload
  )

  return data
},

  // JWT es stateless, el logout en Spring es opcional
  logout: async (): Promise<void> => {
    if (!config.USE_MOCK) {
      try { await apiClient.post('/auth/logout') } catch { /* ignorar */ }
    }
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  },
}
