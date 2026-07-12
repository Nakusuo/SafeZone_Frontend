import axios, { AxiosInstance } from 'axios'
import { config } from '../config'

// Cliente axios base — apunta al backend Spring Boot
const apiClient: AxiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Antes de cada petición, adjunta el JWT si existe
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token')
    if (token) {
      requestConfig.headers['Authorization'] = `Bearer ${token}`
    }
    return requestConfig
  },
  (error) => Promise.reject(error)
)

// Manejo global de errores HTTP
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado — limpiamos y mandamos al login
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user')
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('user')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      console.warn('Acceso denegado (403)')
    }
    return Promise.reject(error)
  }
)

export default apiClient
