// Servicios compartidos — re-exportan desde las ubicaciones nuevas en core/
// Esto mantiene compatibilidad con cualquier código que aun importe desde aquí.
export { default as apiClient } from '@/core/api/apiClient'
export { authService } from '@/features/auth/services/authService'
