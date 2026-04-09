import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, DataTable } from '../../components'
import { FileText, HelpCircle, Lock, User } from 'lucide-react'
import { reportService, Report } from '../../services/reports'
import { userService } from '../../services/users'

export const VictimDashboard = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [psychologist, setPsychologist] = useState<any>(null)
  const [defender, setDefender] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const user = localStorage.getItem('user')
  const userData = user ? JSON.parse(user) : null

  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener reportes de la víctima
        const myReports = await reportService.getVictimReports(userData.id)
        setReports(myReports)

        // Obtener profesionales del primer reporte si existen
        if (myReports.length > 0 && myReports[0].psychologistId) {
          const psych = await userService.getUserById(myReports[0].psychologistId)
          setPsychologist(psych)
        }

        if (myReports.length > 0 && myReports[0].defenderId) {
          const def = await userService.getUserById(myReports[0].defenderId)
          setDefender(def)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userData.id])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-50 text-yellow-700',
      UNDER_EVALUATION: 'bg-blue-50 text-blue-700',
      IN_FOLLOW_UP: 'bg-green-50 text-green-700',
      RESOLVED: 'bg-emerald-50 text-emerald-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      UNDER_EVALUATION: 'En evaluación',
      IN_FOLLOW_UP: 'En seguimiento',
      RESOLVED: 'Resuelto',
    }
    return labels[status] || status
  }

  const tableColumns = [
    {
      key: 'title' as const,
      label: 'Título',
      width: '40%',
    },
    {
      key: 'type' as const,
      label: 'Tipo',
      render: (value: string) => {
        const labels: Record<string, string> = {
          PHYSICAL_VIOLENCE: 'Violencia Física',
          PSYCHOLOGICAL_ABUSE: 'Abuso Psicológico',
          OTHER: 'Otro',
        }
        return labels[value] || value
      },
    },
    {
      key: 'status' as const,
      label: 'Estado',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusLabel(value)}
        </span>
      ),
    },
    {
      key: 'priority' as const,
      label: 'Prioridad',
      render: (value: string) => {
        const colors: Record<string, string> = {
          LOW: 'text-blue-600',
          MEDIUM: 'text-yellow-600',
          HIGH: 'text-accent',
        }
        const labels: Record<string, string> = {
          LOW: 'Baja',
          MEDIUM: 'Media',
          HIGH: 'Alta',
        }
        return <span className={colors[value]}>{labels[value]}</span>
      },
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido/a a SafeZone</h1>
          <p className="text-gray-600">Tu espacio seguro y confidencial para recibir apoyo integral</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/victim/profile')}
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Mi Perfil
        </Button>
      </div>

      {/* Alert de confidencialidad */}
      <Card type="info" className="mb-8">
        <div className="flex items-start gap-4">
          <Lock className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Tu privacidad está garantizada</h3>
            <p className="text-sm text-gray-700">
              Todos tus datos están encriptados y protegidos. Solo los profesionales asignados pueden acceder a tu información.
            </p>
          </div>
        </div>
      </Card>

      {/* Grid de opciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Nueva Denuncia" className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Registra un nuevo caso de violencia de forma segura y discreta.
          </p>
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => navigate('/victim/create-report')}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Crear denuncia
          </Button>
        </Card>

        <Card title="Mis Denuncias" className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Tienes <span className="font-bold text-primary">{reports.length}</span> denuncia{reports.length !== 1 ? 's' : ''}
          </p>
          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center text-sm">
            Ver en tabla abajo ↓
          </div>
        </Card>

        <Card title="Profesionales Asignados" className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4 flex-1">
            {psychologist || defender ? 'Tu equipo está asignado' : 'Pendiente de asignación'}
          </p>
          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center text-sm">
            Equipo: {psychologist || defender ? '✓' : '—'}
          </div>
        </Card>
      </div>

      {/* Tabla de denuncias */}
      {reports.length > 0 && (
        <Card title="Mis Denuncias" className="mb-8">
          <DataTable
            columns={tableColumns}
            data={reports}
            isLoading={isLoading}
            onRowClick={(report) => navigate(`/victim/report/${report.id}`)}
          />
        </Card>
      )}

      {reports.length === 0 && !isLoading && (
        <Card type="warning" className="mb-8">
          <p className="text-sm text-gray-700">
            No has registrado denuncias todavía. Haz clic en "Crear denuncia" para iniciar el proceso de apoyo.
          </p>
        </Card>
      )}

      {/* Equipo profesional */}
      {(psychologist || defender) && (
        <Card title="Tu Equipo Profesional" className="mb-8 border-t-4 border-secondary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {psychologist && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-sm font-bold text-secondary">
                  PS
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{psychologist.name}</h4>
                  <p className="text-xs text-gray-600">Psicólogo/a</p>
                </div>
              </div>
            )}
            {defender && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                  AB
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{defender.name}</h4>
                  <p className="text-xs text-gray-600">Defensor/a Legal</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Recursos de ayuda */}
      <Card title="Recursos de Ayuda" className="border-t-4 border-accent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="flex items-start gap-3 p-3 bg-accent/5 rounded-xl hover:bg-accent/10 transition-colors">
            <HelpCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Centro de Ayuda</h4>
              <p className="text-xs text-gray-600">Preguntas frecuentes y guías</p>
            </div>
          </a>
          <a href="#" className="flex items-start gap-3 p-3 bg-accent/5 rounded-xl hover:bg-accent/10 transition-colors">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Línea de Crisis</h4>
              <p className="text-xs text-gray-600">Disponible 24/7</p>
            </div>
          </a>
        </div>
      </Card>
    </div>
  )
}
