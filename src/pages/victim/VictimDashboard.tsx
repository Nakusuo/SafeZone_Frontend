import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, DataTable } from '../../components'
import { FileText, Eye, AlertCircle } from 'lucide-react'
import { reportService, Report } from '../../services/reports'
import { userService } from '../../services/users'

export const VictimDashboard = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const user = sessionStorage.getItem('user')
  const userData = user ? JSON.parse(user) : null

  useEffect(() => {
    const loadData = async () => {
      try {
        const myReports = await reportService.getVictimReports(userData.id)
        setReports(myReports)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [userData?.id])

  const activeCount = reports.filter(r => r.status !== 'RESOLVED').length
  const pendingCount = reports.filter(r => r.status === 'PENDING').length
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-warning-light', text: 'text-yellow-700', label: 'Pendiente' },
      UNDER_EVALUATION: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'En Evaluación' },
      IN_FOLLOW_UP: { bg: 'bg-green-50', text: 'text-green-700', label: 'En Seguimiento' },
      RESOLVED: { bg: 'bg-green-50', text: 'text-green-700', label: 'Resuelto' },
    }
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
  }

  return (
    <div className="w-full px-8 py-8 pb-32">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-teal to-teal/80 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenida {userData?.name || 'Usuario'}</h2>
          <p className="text-teal-light">Su dedicación crea un entorno seguro para quienes más lo necesitan hoy.</p>
          <div className="flex gap-4 mt-6">
            <button className="bg-white hover:bg-gray-100 text-teal px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ver Casos Pendientes
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-white/40">
              <AlertCircle className="w-4 h-4" />
              Registrar Evaluación
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active */}
          <div className="bg-success-light rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-green-700 font-medium text-xs">EN CURSO</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{activeCount}</div>
            <p className="text-gray-700 text-sm">Total Denuncias</p>
          </div>

          {/* Pending */}
          <div className="bg-warning-light rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded flex items-center justify-center text-sm font-bold">
                ⏱
              </div>
              <span className="text-yellow-700 font-medium text-xs">PENDIENTE</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{pendingCount}</div>
            <p className="text-gray-700 text-sm">En Evaluación</p>
          </div>

          {/* Resolved */}
          <div className="bg-danger-light rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-pink-500 text-white rounded flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-pink-700 font-medium text-xs">CERRADO</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{resolvedCount}</div>
            <p className="text-gray-700 text-sm">Resueltas</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mb-8">
          <button className="bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Crear Nueva Denuncia
          </button>
          <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Ver Todas Mis Denuncias
          </button>
        </div>

        {/* Recent reports */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Denuncias Recientes</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 100 2h18V4M3 14a1 1 0 100 2h18v-2M3 8a1 1 0 100 2h18V8z" />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Prioridad</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 3).map(report => {
                  const badge = getStatusBadge(report.status)
                  return (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{report.id}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(report.createdAt || '').toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {report.type === 'PHYSICAL_VIOLENCE' ? 'Acoso Digital' : 'Seguridad Física'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          report.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {report.priority === 'HIGH' ? 'ALTA' : report.priority === 'MEDIUM' ? 'MEDIA' : 'BAJA'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {reports.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <p className="text-sm">No hay denuncias registradas aún</p>
              </div>
            )}
          </div>
        </div>

        {/* Recursos de Ayuda */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recursos y Apoyo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-teal hover:shadow-md transition">
              <h4 className="font-semibold text-gray-900 mb-2">Línea de Apoyo 24/7</h4>
              <p className="text-sm text-gray-600">Profesionales disponibles en cualquier momento</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-secondary hover:shadow-md transition">
              <h4 className="font-semibold text-gray-900 mb-2">Guías Informativas</h4>
              <p className="text-sm text-gray-600">Material educativo sobre derechos y protección</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-accent hover:shadow-md transition">
              <h4 className="font-semibold text-gray-900 mb-2">Seguimiento Legal</h4>
              <p className="text-sm text-gray-600">Asesoría jurídica especializada</p>
            </div>
          </div>
        </div>
    </div>
  )
}
