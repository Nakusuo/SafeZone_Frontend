import { config } from '@/core/config'
import apiClient from '@/core/api/apiClient'
import { EmergencyAlert, GeoLocation } from '@/shared/types'

// Alertas se guardan en sessionStorage en modo mock,
// y van a /api/emergency/alerts cuando USE_MOCK=false

const MOCK_KEY = 'safezone_emergency_alerts'

const getMockAlerts = (): EmergencyAlert[] => {
  try {
    const stored = sessionStorage.getItem(MOCK_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

const saveMockAlerts = (alerts: EmergencyAlert[]) => {
  try { sessionStorage.setItem(MOCK_KEY, JSON.stringify(alerts)) } catch { /* empty */ }
}

const delay = (ms = config.MOCK_DELAY) => new Promise(r => setTimeout(r, ms))

export const emergencyService = {
  // Víctima activa el botón de pánico con su ubicación
  sendPanicAlert: async (params: {
    victimId: string
    victimName: string
    victimEmail: string
    location?: GeoLocation
    manualAddress?: string
    message?: string
  }): Promise<EmergencyAlert> => {
    if (config.USE_MOCK) {
      await delay(500)
      const alert: EmergencyAlert = {
        id: `alert_${Date.now()}`,
        ...params,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      }
      const alerts = getMockAlerts()
      alerts.unshift(alert)
      saveMockAlerts(alerts)
      return alert
    }
    // Transformar al formato esperado por el backend (español)
    const backendPayload = {
      victimaId: params.victimId,
      victimaNombre: params.victimName,
      victimaEmail: params.victimEmail,
      latitud: params.location?.latitude,
      longitud: params.location?.longitude,
      precision: params.location?.accuracy,
      direccionManual: params.manualAddress,
      mensaje: params.message,
    }
    const { data } = await apiClient.post<EmergencyAlert>('/emergency/alerts', backendPayload)
    return data
  },

  // Profesionales ven solo las alertas activas
  getActiveAlerts: async (): Promise<EmergencyAlert[]> => {
    if (config.USE_MOCK) {
      await delay(300)
      return getMockAlerts().filter(a => a.status === 'ACTIVE')
    }
    const { data } = await apiClient.get<EmergencyAlert[]>('/emergency/alerts', {
      params: { status: 'ACTIVE' },
    })
    return data
  },

  getAllAlerts: async (): Promise<EmergencyAlert[]> => {
    if (config.USE_MOCK) {
      await delay(300)
      return getMockAlerts()
    }
    const { data } = await apiClient.get<EmergencyAlert[]>('/emergency/alerts')
    return data
  },

  // Marcar que un profesional ya está atendiendo la alerta
  attendAlert: async (alertId: string, professionalId: string, professionalName: string): Promise<EmergencyAlert> => {
    if (config.USE_MOCK) {
      await delay(200)
      const alerts = getMockAlerts()
      const alert = alerts.find(a => a.id === alertId)
      if (!alert) throw new Error('Alerta no encontrada')
      alert.status = 'ATTENDED'
      alert.attendedBy = professionalId
      alert.attendedByName = professionalName
      alert.attendedAt = new Date().toISOString()
      saveMockAlerts(alerts)
      return alert
    }
    const { data } = await apiClient.patch<EmergencyAlert>(`/emergency/alerts/${alertId}/attend`, {
      professionalId,
      professionalName,
    })
    return data
  },

  resolveAlert: async (alertId: string): Promise<EmergencyAlert> => {
    if (config.USE_MOCK) {
      await delay(200)
      const alerts = getMockAlerts()
      const alert = alerts.find(a => a.id === alertId)
      if (!alert) throw new Error('Alerta no encontrada')
      alert.status = 'RESOLVED'
      alert.resolvedAt = new Date().toISOString()
      saveMockAlerts(alerts)
      return alert
    }
    const { data } = await apiClient.patch<EmergencyAlert>(`/emergency/alerts/${alertId}/resolve`)
    return data
  },
}

// Pide las coordenadas al navegador — requiere HTTPS en producción
export const getCurrentPosition = (): Promise<GeoLocation> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no soporta geolocalización'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude ?? undefined,
          timestamp: new Date(pos.timestamp).toISOString(),
        }),
      (err) => reject(new Error(err.message)),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  })

// Link directo a Google Maps con las coordenadas
export const buildMapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps?q=${lat},${lng}`
