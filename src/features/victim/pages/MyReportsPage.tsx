import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, Select, DataTable } from '@/shared/components'
import { Plus } from 'lucide-react'
import { reportService } from '@/features/victim/services/reportService'
import { Report, Evaluation, LegalUpdate } from '@/shared/types'

export const MyReportsPage = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const user = sessionStorage.getItem('user')
  const userData = user ? JSON.parse(user) : null

  useEffect(() => {
    const loadReports = async () => {
      try {
        const myReports = await reportService.getVictimReports(userData.id)
        setReports(myReports)
      } catch (error) {
        console.error('Error cargando denuncias:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userData?.id) {
      loadReports()
    }
  }, [userData?.id])

  // Filtrar denuncias
  useEffect(() => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(r => r.status === statusFilter)
    }

    if (priorityFilter) {
      filtered = filtered.filter(r => r.priority === priorityFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchTerm, statusFilter, priorityFilter])

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
      width: '35%',
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
        return <span className={`font-medium ${colors[value]}`}>{labels[value]}</span>
      },
    },
    {
      key: 'createdAt' as const,
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Denuncias</h1>
          <p className="text-gray-600">Gestiona todas tus denuncias y solicitudes de apoyo</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/victim/create-report')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Denuncia
        </Button>
      </div>

      {/* Filtros */}
      <Card title="Filtros de Búsqueda" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Buscar denuncia"
            placeholder="Buscar por título o descripción..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1"
          />

          <Select
            label="Estado"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'PENDING', label: 'Pendiente' },
              { value: 'UNDER_EVALUATION', label: 'En evaluación' },
              { value: 'IN_FOLLOW_UP', label: 'En seguimiento' },
              { value: 'RESOLVED', label: 'Resuelto' },
            ]}
          />

          <Select
            label="Prioridad"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { value: '', label: 'Todas las prioridades' },
              { value: 'LOW', label: 'Baja' },
              { value: 'MEDIUM', label: 'Media' },
              { value: 'HIGH', label: 'Alta' },
            ]}
          />
        </div>
      </Card>

      {/* Tabla */}
      {filteredReports.length > 0 ? (
        <Card title={`${filteredReports.length} denuncia${filteredReports.length !== 1 ? 's' : ''}`} className="mb-6">
          <DataTable
            columns={tableColumns}
            data={filteredReports}
            isLoading={isLoading}
            onRowClick={(report) => navigate(`/victim/report/${report.id}`)}
            rowClassName="hover:cursor-pointer"
          />
        </Card>
      ) : (
        <Card type="info" className="mb-6">
          <div className="text-center py-8">
            <p className="text-gray-700 mb-4">
              {searchTerm || statusFilter || priorityFilter
                ? 'No hay denuncias que coincidan con tus filtros'
                : 'Aún no has registrado denuncias'}
            </p>
            {!searchTerm && !statusFilter && !priorityFilter && (
              <Button
                variant="primary"
                onClick={() => navigate('/victim/create-report')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear tu primera denuncia
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Estadísticas */}
      {reports.length > 0 && (
        <Card title="Resumen Estadístico" className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-primary">{reports.length}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'PENDING').length}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">En Evaluación</p>
              <p className="text-2xl font-bold text-blue-600">{reports.filter(r => r.status === 'UNDER_EVALUATION').length}</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Resueltos</p>
              <p className="text-2xl font-bold text-emerald-600">{reports.filter(r => r.status === 'RESOLVED').length}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}


