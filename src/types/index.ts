// Tipos de usuario
export type UserRole = 'VICTIM' | 'PSYCHOLOGIST' | 'DEFENDER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
