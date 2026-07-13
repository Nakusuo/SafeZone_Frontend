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
        console.error('Error loading reports:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userData?.id) {
      loadReports()
    }
  }, [userData?.id])

  
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
      PENDING: 'Pending',
      UNDER_EVALUATION: 'Under Evaluation',
      IN_FOLLOW_UP: 'In Follow-up',
      RESOLVED: 'Resolved',
    }
    return labels[status] || status
  }

  const tableColumns = [
    {
      key: 'title' as const,
      label: 'Title',
      width: '35%',
    },
    {
      key: 'type' as const,
      label: 'Type',
      render: (value: string) => {
        const labels: Record<string, string> = {
          PHYSICAL_VIOLENCE: 'Physical Violence',
          PSYCHOLOGICAL_ABUSE: 'Psychological Abuse',
          OTHER: 'Other',
        }
        return labels[value] || value
      },
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusLabel(value)}
        </span>
      ),
    },
    {
      key: 'priority' as const,
      label: 'Priority',
      render: (value: string) => {
        const colors: Record<string, string> = {
          LOW: 'text-blue-600',
          MEDIUM: 'text-yellow-600',
          HIGH: 'text-accent',
        }
        const labels: Record<string, string> = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High',
        }
        return <span className={`font-medium ${colors[value]}`}>{labels[value]}</span>
      },
    },
    {
      key: 'createdAt' as const,
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('en-US'),
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reportes</h1>
          <p className="text-gray-600">Gestiona todos tus reportes y solicitudes de apoyo</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/victim/create-report')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Reporte
        </Button>
      </div>

      
      <Card title="Search Filters" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search report"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1"
          />

          <Select
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'PENDING', label: 'Pendiente' },
              { value: 'UNDER_EVALUATION', label: 'En Evaluación' },
              { value: 'IN_FOLLOW_UP', label: 'En Seguimiento' },
              { value: 'RESOLVED', label: 'Resuelto' },
            ]}
          />

          <Select
            label="Priority"
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

      
      {filteredReports.length > 0 ? (
        <Card title={`${filteredReports.length} report${filteredReports.length !== 1 ? 's' : ''}`} className="mb-6">
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
                ? 'No reports match your filters'
                : 'You have not registered any reports yet'}
            </p>
            {!searchTerm && !statusFilter && !priorityFilter && (
              <Button
                variant="primary"
                onClick={() => navigate('/victim/create-report')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crea tu primer reporte
              </Button>
            )}
          </div>
        </Card>
      )}

      
      {reports.length > 0 && (
        <Card title="Resumen Estadístico" className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-primary">{reports.length}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pendiente</p>
              <p className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'PENDING').length}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">En Evaluación</p>
              <p className="text-2xl font-bold text-blue-600">{reports.filter(r => r.status === 'UNDER_EVALUATION').length}</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Resuelto</p>
              <p className="text-2xl font-bold text-emerald-600">{reports.filter(r => r.status === 'RESOLVED').length}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}


