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
    const token = sessionStorage.getItem('token')
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
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      console.warn('Acceso denegado (403)')
    }
    return Promise.reject(error)
  }
)

export default apiClient
