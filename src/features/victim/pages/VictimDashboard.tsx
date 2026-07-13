import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Eye, AlertCircle } from 'lucide-react'
import { reportService } from '@/features/victim/services/reportService'
import { Report } from '@/shared/types'
import { useAuth } from '@/core/auth/AuthContext'
import { PanicButton } from '../components/PanicButton'
import { ChatButton } from '@/features/shared-features/chat/components/ChatButton'

export const VictimDashboard = () => {
  const navigate = useNavigate()
  const { user: userData } = useAuth()
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    if (!userData?.id) return
    reportService.getVictimReports(userData.id)
      .then(setReports)
      .catch(console.error)
  }, [userData?.id])

  const activeCount = reports.filter(r => r.status !== 'RESOLVED').length
  const pendingCount = reports.filter(r => r.status === 'PENDING').length
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-warning-light', text: 'text-yellow-700', label: 'Pending' },
      UNDER_EVALUATION: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Under Evaluation' },
      IN_FOLLOW_UP: { bg: 'bg-green-50', text: 'text-green-700', label: 'In Follow-up' },
      RESOLVED: { bg: 'bg-green-50', text: 'text-green-700', label: 'Resolved' },
    }
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
  }

  return (
    <div className="w-full px-8 py-8 pb-32">

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal to-teal/80 text-white rounded-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-2">Bienvenido, {userData?.name || 'User'}</h2>
        <p className="text-teal-light">Tu seguridad es nuestra máxima prioridad. Accede a tus herramientas de seguridad e informes a continuación.</p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate('/victim/my-reports')}
            className="bg-white hover:bg-gray-100 text-teal px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Ver mis informes
          </button>
          <button
            onClick={() => navigate('/victim/create-report')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-white/40"
          >
            <AlertCircle className="w-4 h-4" />
            Nuevo informe
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-success-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-green-700 font-medium text-xs">EN PROGRESO</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{activeCount}</div>
          <p className="text-gray-700 text-sm">Total de Denuncias</p>
        </div>
        <div className="bg-warning-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded flex items-center justify-center text-sm font-bold">⏱</div>
            <span className="text-yellow-700 font-medium text-xs">PENDIENTE</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{pendingCount}</div>
          <p className="text-gray-700 text-sm">En Evaluación</p>
        </div>
        <div className="bg-danger-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-pink-500 text-white rounded flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-pink-700 font-medium text-xs">CERRADO</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{resolvedCount}</div>
          <p className="text-gray-700 text-sm">Resuelto</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => navigate('/victim/create-report')}
          className="bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Crear nuevo informe
        </button>
        <button
          onClick={() => navigate('/victim/my-reports')}
          className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver todos mis Reportes
        </button>
      </div>

      {/* Recent reports table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Denuncias Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
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
                       {new Date(report.createdAt || '').toLocaleDateString('en-US')}
                     </td>
                     <td className="py-3 px-4 text-gray-600 text-xs">
                       {report.type === 'PHYSICAL_VIOLENCE' ? 'Physical Violence' : report.type === 'PSYCHOLOGICAL_ABUSE' ? 'Psychological Abuse' : report.type?.replace(/_/g, ' ')}
                     </td>
                     <td className="py-3 px-4">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${
                         report.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                         report.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                         'bg-blue-100 text-blue-700'
                       }`}>
                         {report.priority === 'HIGH' ? 'HIGH' : report.priority === 'MEDIUM' ? 'MEDIUM' : 'LOW'}
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
              <p className="text-sm">Reportes no registrados aún</p>
            </div>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recursos y Soporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-teal hover:shadow-md transition">
            <h4 className="font-semibold text-gray-900 mb-2">24/7 soporte </h4>
            <p className="text-sm text-gray-600">Profesionales disponibles en cualquier momento</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-secondary hover:shadow-md transition">
            <h4 className="font-semibold text-gray-900 mb-2">Guías de Información</h4>
            <p className="text-sm text-gray-600">Material educativo sobre derechos y protección</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-accent hover:shadow-md transition">
            <h4 className="font-semibold text-gray-900 mb-2">Seguimiento Legal</h4>
            <p className="text-sm text-gray-600">Servicios de asesoría legal especializada</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        <ChatButton />
        <PanicButton />
      </div>
    </div>
  )
}
