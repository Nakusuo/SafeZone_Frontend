import { useState, useEffect } from 'react'
import { Card, Button } from '../../components'
import { Briefcase, FileText, Scale } from 'lucide-react'
import { reportService, Report } from '../../services/reports'

export const DefenderDashboard = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const allReports = await reportService.getAllReports()
        // Filtrar solo casos asignados a este defensor
        const user = localStorage.getItem('user')
        const userData = user ? JSON.parse(user) : null
        
        const myReports = allReports.filter(r => r.defenderId === userData.id)
        setReports(myReports)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length
  const activeCount = reports.filter(r => r.status !== 'RESOLVED').length
  const urgentCount = reports.filter(r => r.priority === 'HIGH' && r.status !== 'RESOLVED').length

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PHYSICAL_VIOLENCE: 'bg-accent/10 text-accent',
      PSYCHOLOGICAL_ABUSE: 'bg-warning/10 text-warning',
      OTHER: 'bg-gray-100 text-gray-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel del Defensor Legal</h1>
        <p className="text-gray-600">Gestión de casos legales y seguimiento de defensoría</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{reports.length}</div>
          <p className="text-sm text-gray-600">Casos en defensa</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{resolvedCount}</div>
          <p className="text-sm text-gray-600">Casos resueltos</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">{activeCount}</div>
          <p className="text-sm text-gray-600">En trámite</p>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{urgentCount}</div>
          <p className="text-sm text-gray-600">Casos urgentes</p>
        </Card>
      </div>

      {/* Acciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Nuevos Casos" className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Revisa asignaciones recientes.
          </p>
          <Button variant="primary" className="w-full">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Ver nuevos
          </Button>
        </Card>

        <Card title="Crear Reporte" className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Genera informes y documentación legal.
          </p>
          <Button variant="secondary" className="w-full">
            <FileText className="w-4 h-4 inline mr-2" />
            Nuevo reporte
          </Button>
        </Card>

        <Card title="Audiencias" className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Calendario de audiencias y diligencias.
          </p>
          <Button variant="secondary" className="w-full">
            <Scale className="w-4 h-4 inline mr-2" />
            Ver agenda
          </Button>
        </Card>
      </div>

      {/* Casos activos */}
      {isLoading ? (
        <Card className="text-center py-8">
          <p className="text-gray-600">Cargando tus casos...</p>
        </Card>
      ) : reports.length > 0 ? (
        <Card title="Casos en Defensa" className="mb-8">
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="border-l-4 border-indigo-500 pl-4 py-3 bg-indigo-50 rounded">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{report.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                    {report.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Caso: {report.id}</p>
                <p className="text-xs text-gray-700 mt-2">
                  Estado: <span className="font-semibold">{report.status.replace(/_/g, ' ')}</span>
                </p>
                {report.priority === 'HIGH' && (
                  <p className="text-xs text-red-700 mt-1 font-semibold">⚠️ Caso urgente</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card type="info" className="text-center py-8">
          <p className="text-gray-600">No tienes casos asignados actualmente.</p>
        </Card>
      )}

      {/* Colaboración */}
      <Card title="Colaboración Multidisciplinaria" className="bg-purple-50">
        <p className="text-sm text-gray-700 mb-4">
          Profesionales psicológicos involucrados en tus casos:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center text-sm font-bold text-secondary">
              PS
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Dra. Patricia Sánchez</p>
              <p className="text-xs text-gray-600">{reports.filter(r => r.psychologistId === 'user2').length} casos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary">
              JM
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Dr. Jorge Martínez</p>
              <p className="text-xs text-gray-600">Psicólogo colaborador</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
