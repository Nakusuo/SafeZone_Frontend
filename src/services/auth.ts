import { localStorageService } from './localStorage'
import { AuthResponse, User } from '../types'

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return localStorageService.login(email, password)
  },

  register: async (userData: Partial<User> & { password: string }): Promise<AuthResponse> => {
    return localStorageService.register(userData)
  },

  logout: () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  },

  getCurrentUser: async (): Promise<User> => {
    const user = sessionStorage.getItem('user')
    if (!user) throw new Error('No user logged in')
    return JSON.parse(user)
  },
}

