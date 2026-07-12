import apiClient from '@/core/api/apiClient'
import { config } from '@/core/config'
import { User } from '@/shared/types'







import mockData from '@/data/mockData.json'

const delay = (ms = config.MOCK_DELAY) => new Promise((r) => setTimeout(r, ms))
const STORAGE_KEY = 'safezone_appdata'

const getMockData = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {  }
  return JSON.parse(JSON.stringify(mockData))
}

export const userService = {
  
  getUserById: async (userId: string): Promise<User | undefined> => {
    if (config.USE_MOCK) {
      await delay()
      const u = getMockData().users.find((u: any) => u.id === userId)
      return u ? { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt } : undefined
    }
    const { data } = await apiClient.get<User>(`/users/${userId}`)
    return data
  },

  /**
   * Spring: GET /api/usuarios/psyphocolyst
   */
  getPsychologists: async (): Promise<User[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().users
        .filter((u: any) => u.role === 'PSYCHOLOGIST')
        .map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }))
    }

    const response = await apiClient.get<any>('/usuarios/psyphocolyst')
    const payload = response.data?.data ?? response.data ?? response
    const users = Array.isArray(payload) ? payload : payload ? [payload] : []

    return users.map((u: any) => ({
      id: String(u.id ?? u.usuarioid ?? ''),
      name: u.nombre ? `${u.nombre} ${u.apellido ?? ''}`.trim() : u.nombreCompleto ?? u.name ?? '',
      email: u.email ?? '',
      role: (u.role || u.rol || 'PSYCHOLOGIST') as any,
      createdAt: u.createdAt ?? u.creadoEn ?? '',
    }))
  },

  
  getDefenders: async (): Promise<User[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().users
        .filter((u: any) => u.role === 'DEFENDER')
        .map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }))
    }
    const { data } = await apiClient.get<User[]>('/users', { params: { role: 'DEFENDER' } })
    return data
  },

  
  getVictims: async (): Promise<User[]> => {
    if (config.USE_MOCK) {
      await delay()
      return getMockData().users
        .filter((u: any) => u.role === 'VICTIM')
        .map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }))
    }
    const { data } = await apiClient.get<User[]>('/users', { params: { role: 'VICTIM' } })
    return data
  },

  
  updateProfile: async (userId: string, updates: Partial<Pick<User, 'name' | 'email'>>): Promise<User> => {
    if (config.USE_MOCK) {
      await delay()
      const appData = getMockData()
      const user = appData.users.find((u: any) => u.id === userId)
      if (!user) throw new Error('Usuario no encontrado')
      Object.assign(user, updates)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(appData))
      return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
    }
    const { data } = await apiClient.put<User>(`/users/${userId}`, updates)
    return data
  },
}
