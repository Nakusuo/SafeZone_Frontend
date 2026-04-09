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

// Clave para localStorage del navegador
const STORAGE_KEY = 'safezone_appdata'

// Función para obtener datos del localStorage del navegador o datos iniciales
const getAppData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Error leyendo localStorage:', error)
  }
  
  // Si no existe en localStorage, usar datos iniciales
  return JSON.parse(JSON.stringify(mockData))
}

// Función para guardar datos en localStorage del navegador
const saveAppData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error guardando en localStorage:', error)
  }
}

// Datos iniciales (se cargan del localStorage o de mockData)
let appData: AppData = getAppData()

// Función para resetear datos (vuelve a datos iniciales de mockData)
export const resetData = () => {
  appData = JSON.parse(JSON.stringify(mockData))
  saveAppData(appData)
  console.log('✓ Datos reseteados a estado inicial')
}

// Función para agregar pequeños delays que simular tiempo de red
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// USUARIOS
export const localStorageService = {
  // Login
  login: async (email: string, password: string) => {
    await delay()
    const user = appData.users.find((u: User) => u.email === email && u.password === password)
    
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

  // Registro
  register: async (userData: any) => {
    await delay()
    
    // Verificar email único
    if (appData.users.some((u: User) => u.email === userData.email)) {
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

    appData.users.push(newUser)
    saveAppData(appData)  // 💾 Guardar en localStorage

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

  // DENUNCIAS/REPORTES
  getReports: async (victimId?: string) => {
    await delay()
    
    if (victimId) {
      return appData.reports.filter((r: Report) => r.victimId === victimId)
    }
    
    return appData.reports
  },

  getReportById: async (reportId: string) => {
    await delay()
    return appData.reports.find((r: Report) => r.id === reportId)
  },

  createReport: async (reportData: any) => {
    await delay()
    
    const newReport = {
      id: `report_${Date.now()}`,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'PENDING',
    }

    appData.reports.push(newReport)
    saveAppData(appData)  // 💾 Guardar en localStorage
    return newReport
  },

  updateReport: async (reportId: string, updateData: any) => {
    await delay()
    
    const report = appData.reports.find((r: Report) => r.id === reportId)
    if (!report) throw new Error('Reporte no encontrado')

    Object.assign(report, updateData, { updatedAt: new Date().toISOString() })
    saveAppData(appData)  // 💾 Guardar en localStorage
    return report
  },

  // EVALUACIONES PSICOLÓGICAS
  getEvaluations: async (reportId?: string) => {
    await delay()
    
    if (reportId) {
      return appData.evaluations.filter((e: Evaluation) => e.reportId === reportId)
    }
    
    return appData.evaluations
  },

  createEvaluation: async (evaluationData: any) => {
    await delay()
    
    const newEvaluation = {
      id: `eval_${Date.now()}`,
      ...evaluationData,
      date: new Date().toISOString(),
    }
    
    appData.evaluations.push(newEvaluation)
    saveAppData(appData)  // 💾 Guardar en localStorage
    return newEvaluation
  },

  // ACTUALIZACIONES LEGALES
  getLegalUpdates: async (reportId?: string) => {
    await delay()
    
    if (reportId) {
      return appData.legalUpdates.filter((l: LegalUpdate) => l.reportId === reportId)
    }
    
    return appData.legalUpdates
  },

  createLegalUpdate: async (updateData: any) => {
    await delay()
    
    const newUpdate = {
      id: `legal_${Date.now()}`,
      ...updateData,
      date: new Date().toISOString(),
    }

    appData.legalUpdates.push(newUpdate)
    saveAppData(appData)  // 💾 Guardar en localStorage
    return newUpdate
  },

  // USUARIOS (para obtener información de psicólogos, defensores, etc.)
  getUserById: async (userId: string) => {
    await delay()
    return appData.users.find((u: User) => u.id === userId)
  },

  getUsersByRole: async (role: string) => {
    await delay()
    return appData.users.filter((u: User) => u.role === role)
  },

  // Obtener toda la data para desarrollo
  getAllData: () => appData,
}
