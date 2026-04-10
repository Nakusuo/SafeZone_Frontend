/// <reference types="vite/client" />
import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar user ID si existe
apiClient.interceptors.request.use(
  (config) => {
    const user = sessionStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.id) {
          config.headers['X-User-ID'] = userData.id
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
