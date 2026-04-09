import { useState, useEffect } from 'react'
import { Card, Button } from '../../components'
import { FileText, AlertCircle } from 'lucide-react'
import { reportService, Report } from '../../services/reports'

export const PsychologistDashboard = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const allReports = await reportService.getAllReports()
        // Filtrar solo casos asignados a este psicólogo
        const user = localStorage.getItem('user')
        const userData = user ? JSON.parse(user) : null
        
        const myReports = allReports.filter(r => r.psychologistId === userData.id)
        setReports(myReports)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const activeCount = reports.filter(r => r.status !== 'RESOLVED').length
  const evaluatedCount = reports.filter(r => r.status === 'IN_FOLLOW_UP').length
  const urgentCount = reports.filter(r => r.priority === 'HIGH' && r.status !== 'RESOLVED').length

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-50 text-yellow-700 border-l-4 border-warning',
      UNDER_EVALUATION: 'bg-blue-50 text-blue-700 border-l-4 border-primary',
      IN_FOLLOW_UP: 'bg-green-50 text-green-700 border-l-4 border-success',
      RESOLVED: 'bg-emerald-50 text-emerald-700 border-l-4 border-secondary',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel del Psicólogo</h1>
        <p className="text-gray-600">Gestión de casos y seguimiento integral de víctimas</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">{reports.length}</div>
          <p className="text-sm text-gray-600">Casos asignados</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{evaluatedCount}</div>
          <p className="text-sm text-gray-600">En seguimiento</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{activeCount}</div>
          <p className="text-sm text-gray-600">Activos</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{urgentCount}</div>
          <p className="text-sm text-gray-600">Casos urgentes</p>
        </Card>
      </div>

      {/* Acciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Casos Prioritarios" className="flex flex-col">
          <div className="space-y-3 flex-1 mb-4">
            {reports.filter(r => r.priority === 'HIGH').length > 0 ? (
              reports.filter(r => r.priority === 'HIGH').map(report => (
                <div key={report.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-600">{report.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">Sin casos urgentes</p>
            )}
          </div>
          <Button variant="primary" className="w-full">Revisar casos</Button>
        </Card>

        <Card title="Crear Evaluación" className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Registra evaluaciones y diagnósticos psicológicos.
          </p>
          <Button variant="secondary" className="w-full">
            <FileText className="w-4 h-4 inline mr-2" />
            Nueva evaluación
          </Button>
        </Card>
      </div>

      {/* Mis pacientes */}
      {isLoading ? (
        <Card className="text-center py-8">
          <p className="text-gray-600">Cargando tus casos...</p>
        </Card>
      ) : reports.length > 0 ? (
        <Card title="Pacientes Asignados" className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700">Prioridad</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700">Progreso</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-700 font-mono text-xs">{report.id}</td>
                    <td className="py-3 px-3 text-gray-700">{report.title}</td>
                    <td className="py-3 px-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                        {report.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        report.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: report.status === 'RESOLVED' ? '100%' :
                                   report.status === 'IN_FOLLOW_UP' ? '75%' :
                                   report.status === 'UNDER_EVALUATION' ? '50%' : '25%'
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card type="info" className="text-center py-8">
          <p className="text-gray-600">No tienes casos asignados actualmente.</p>
        </Card>
      )}
    </div>
  )
}
