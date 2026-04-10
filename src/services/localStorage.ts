import mockData from '../data/mockData.json'

interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  createdAt: string
}

interface Report {
  id: string
  victimId: string
  title: string
  description: string
  type: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  psychologistId?: string
  defenderId?: string
}

interface Evaluation {
  id: string
  reportId: string
  psychologistId: string
  date: string
  diagnosis: string
  notes: string
  recommendations: string[]
}

interface LegalUpdate {
  id: string
  reportId: string
  defenderId: string
  date: string
  status: string
  nextHearing?: string
  notes: string
}

interface AppData {
  users: User[]
  reports: Report[]
  evaluations: Evaluation[]
  legalUpdates: LegalUpdate[]
}

// Clave para sessionStorage del navegador (se borra al cerrar la pestaña)
const STORAGE_KEY = 'safezone_appdata'

// Función para obtener datos del sessionStorage del navegador o datos iniciales
const getAppData = (): AppData => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Error leyendo sessionStorage:', error)
  }
  
  // Si no existe en sessionStorage, usar datos iniciales
  return JSON.parse(JSON.stringify(mockData))
}

// Función para guardar datos en sessionStorage del navegador (se borra al cerrar)
const saveAppData = (data: AppData) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error guardando en sessionStorage:', error)
  }
}

// Datos iniciales (se cargan del sessionStorage o de mockData)
let appData: AppData = getAppData()

// Función para resetear datos (vuelve a datos iniciales de mockData)
export const resetData = () => {
  appData = JSON.parse(JSON.stringify(mockData))
  saveAppData(appData)
  console.log('✓ Datos reseteados a estado inicial (se borrarán al cerrar la pestaña)')
}

// Función para agregar pequeños delays que simular tiempo de red
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Función auxiliar para obtener appData fresco del sessionStorage
const getAppDataFresh = (): AppData => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Error leyendo sessionStorage:', error)
  }
  return JSON.parse(JSON.stringify(mockData))
}

// USUARIOS
export const localStorageService = {
  // Login - Leer fresco del sessionStorage
  login: async (email: string, password: string) => {
    await delay()
    const currentData = getAppDataFresh()
    const user = currentData.users.find((u: User) => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    return {
      token: `token_${user.id}_${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    }
  },

  // Registro - Leer fresco y guardar
  register: async (userData: any) => {
    await delay()
    
    const currentData = getAppDataFresh()
    
    // Verificar email único
    if (currentData.users.some((u: User) => u.email === userData.email)) {
      throw new Error('Este correo ya está registrado')
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      createdAt: new Date().toISOString(),
    }

    currentData.users.push(newUser)
    saveAppData(currentData)  // 💾 Guardar en sessionStorage (temporal)
    appData = currentData  // Actualizar appData en memoria también

    return {
      token: `token_${newUser.id}_${Date.now()}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    }
  },

  // DENUNCIAS/REPORTES - Leer fresco
  getReports: async (victimId?: string) => {
    await delay()
    
    const currentData = getAppDataFresh()
    if (victimId) {
      return currentData.reports.filter((r: Report) => r.victimId === victimId)
    }
    
    return currentData.reports
  },

  getReportById: async (reportId: string) => {
    await delay()
    const currentData = getAppDataFresh()
    return currentData.reports.find((r: Report) => r.id === reportId)
  },

  createReport: async (reportData: any) => {
    await delay()
    
    const currentData = getAppDataFresh()
    const newReport = {
      id: `report_${Date.now()}`,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'PENDING',
    }

    currentData.reports.push(newReport)
    saveAppData(currentData)  // 💾 Guardar en sessionStorage
    appData = currentData  // Actualizar en memoria
    return newReport
  },

  updateReport: async (reportId: string, updateData: any) => {
    await delay()
    
    const currentData = getAppDataFresh()
    const report = currentData.reports.find((r: Report) => r.id === reportId)
    if (!report) throw new Error('Reporte no encontrado')

    Object.assign(report, updateData, { updatedAt: new Date().toISOString() })
    saveAppData(currentData)  // 💾 Guardar en sessionStorage
    appData = currentData
    return report
  },

  // EVALUACIONES PSICOLÓGICAS
  getEvaluations: async (reportId?: string) => {
    await delay()
    
    const currentData = getAppDataFresh()
    if (reportId) {
      return currentData.evaluations.filter((e: Evaluation) => e.reportId === reportId)
    }
    
    return currentData.evaluations
  },

  createEvaluation: async (evaluationData: any) => {
    await delay()
    
    const currentData = getAppDataFresh()
    const newEvaluation = {
      id: `eval_${Date.now()}`,
      ...evaluationData,
      date: new Date().toISOString(),
    }
    
    currentData.evaluations.push(newEvaluation)
    saveAppData(currentData)  // 💾 Guardar en sessionStorage
    appData = currentData
    return newEvaluation
  },

  // ACTUALIZACIONES LEGALES
  getLegalUpdates: async (reportId?: string) => {
    await delay()
    
    const currentData = getAppDataFresh()
    if (reportId) {
      return currentData.legalUpdates.filter((l: LegalUpdate) => l.reportId === reportId)
    }
    
    return currentData.legalUpdates
  },

  createLegalUpdate: async (updateData: any) => {
    await delay()
    
    const currentData = getAppDataFresh()
    const newUpdate = {
      id: `legal_${Date.now()}`,
      ...updateData,
      date: new Date().toISOString(),
    }

    currentData.legalUpdates.push(newUpdate)
    saveAppData(currentData)  // 💾 Guardar en sessionStorage
    appData = currentData
    return newUpdate
  },

  // USUARIOS (para obtener información de psicólogos, defensores, etc.)
  getUserById: async (userId: string) => {
    await delay()
    const currentData = getAppDataFresh()
    return currentData.users.find((u: User) => u.id === userId)
  },

  getUsersByRole: async (role: string) => {
    await delay()
    const currentData = getAppDataFresh()
    return currentData.users.filter((u: User) => u.role === role)
  },

  // Obtener toda la data para desarrollo
  getAllData: () => getAppDataFresh(),
}
