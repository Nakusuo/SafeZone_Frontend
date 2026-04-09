import { localStorageService } from './localStorage'
import { User } from '../types'

export const userService = {
  getUserById: async (userId: string): Promise<User | undefined> => {
    const user = await localStorageService.getUserById(userId)
    if (!user) return undefined
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      createdAt: user.createdAt,
    }
  },

  getPsychologists: async (): Promise<User[]> => {
    const psychologists = await localStorageService.getUsersByRole('PSYCHOLOGIST')
    return psychologists.map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      createdAt: p.createdAt,
    }))
  },

  getDefenders: async (): Promise<User[]> => {
    const defenders = await localStorageService.getUsersByRole('DEFENDER')
    return defenders.map((d: any) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      role: d.role,
      createdAt: d.createdAt,
    }))
  },

  getVictims: async (): Promise<User[]> => {
    const victims = await localStorageService.getUsersByRole('VICTIM')
    return victims.map((v: any) => ({
      id: v.id,
      name: v.name,
      email: v.email,
      role: v.role,
      createdAt: v.createdAt,
    }))
  },
}
