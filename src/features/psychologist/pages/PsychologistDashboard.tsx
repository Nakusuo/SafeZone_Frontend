import { useState, useEffect } from 'react'
import { FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { reportService } from '@/features/victim/services/reportService'
import { Report } from '@/shared/types'
import { useAuth } from '@/core/auth/AuthContext'
import { EmergencyAlertsPanel } from '@/features/shared-features/emergency/EmergencyAlertsPanel'
import { ChatButton } from '@/features/shared-features/chat/components/ChatButton'

export const PsychologistDashboard = () => {
  const { user: userData } = useAuth()
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    reportService.getAssignedCases()
      .then(setReports)
      .catch(console.error)
  }, [userData?.id])

  const activeCount = reports.filter(r => r.status !== 'RESOLVED').length
  const pendingCount = reports.filter(r => r.status === 'PENDING').length
  const completedCount = reports.filter(r => r.status === 'RESOLVED').length

  return (
    <div className="w-full px-8 py-8 pb-32">

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal to-teal/80 text-white rounded-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-2">Bienvenido, {userData?.name || 'Psychologist'}</h2>
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

      {/* Emergency alerts */}
      <EmergencyAlertsPanel />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-teal-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center text-sm font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-blue-700 font-medium text-xs">EN PROGRESO</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{activeCount}</div>
          <p className="text-gray-700 text-sm">Casos Activos</p>
        </div>
        <div className="bg-warning-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded flex items-center justify-center text-sm font-bold">⏱</div>
            <span className="text-yellow-700 font-medium text-xs">PRIORIDAD</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{pendingCount}</div>
          <p className="text-gray-700 text-sm">Pendientes</p>
        </div>
        <div className="bg-success-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-sm font-bold">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-green-700 font-medium text-xs">COMPLETADO</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{completedCount}</div>
          <p className="text-gray-700 text-sm">Resueltos</p>
        </div>
      </div>

      {/* Cases table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Mi Casos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">TÍTULO</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">TIPO</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ESTADO</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">PRIORIDAD</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 5).map(report => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{report.title?.substring(0, 25)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.type === 'PHYSICAL_VIOLENCE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {report.type === 'PHYSICAL_VIOLENCE' ? 'Physical' : 'Psychological'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                      report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      report.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {report.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <p className="text-sm">No hay casos para mostrar</p>
            </div>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recursos de Ayuda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-teal hover:shadow-md transition">
            <h4 className="font-semibold text-gray-900 mb-2">Protocolo de Evaluación</h4>
            <p className="text-sm text-gray-600">Guía completa para evaluaciones psicológicas</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-secondary hover:shadow-md transition">
            <h4 className="font-semibold text-gray-900 mb-2">Documentación Clínica</h4>
            <p className="text-sm text-gray-600">Plantillas y formatos para informes</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-accent hover:shadow-md transition">
            <h4 className="font-semibold text-gray-900 mb-2">Contacto de Emergencia</h4>
            <p className="text-sm text-gray-600">Línea de apoyo disponible 24/7</p>
          </div>
        </div>
      </div>

      {/* Floating Chat Button (RF-07) */}
      <ChatButton />
    </div>
  )
}