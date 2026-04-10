import { useState, useEffect } from 'react'
import { Briefcase, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { reportService, Report } from '../../services/reports'

export const DefenderDashboard = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const user = sessionStorage.getItem('user')
  const userData = user ? JSON.parse(user) : null

  useEffect(() => {
    const loadData = async () => {
      try {
        const allReports = await reportService.getAllReports()
        const myReports = allReports.filter(r => r.defenderId === userData?.id)
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
  const upcomingCount = reports.filter(r => r.status === 'PENDING').length
  const closedCount = reports.filter(r => r.status === 'RESOLVED').length

  return (
    <div className="w-full px-8 py-8 pb-32">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-teal to-teal/80 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenido Defensor {userData?.name || 'Legal'}</h2>
          <p className="text-teal-light">Panel de control de gestión legal. Aquí puede supervisar sus procesos activos y prepararse para las próximas audiencias programadas.</p>
          <div className="flex gap-4 mt-6">
            <button className="bg-white hover:bg-gray-100 text-teal px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Registrar Audiencia
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-white/40">
              <AlertCircle className="w-4 h-4" />
              Actualización Legal
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* In Process */}
          <div className="bg-teal-light rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center text-sm font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-blue-700 font-medium text-xs">CASOS EN PROCESO</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{activeCount}</div>
            <p className="text-gray-700 text-sm">+1 esta semana</p>
          </div>

          {/* Upcoming */}
          <div className="bg-danger-light rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-sm font-bold">
                ⏱
              </div>
              <span className="text-red-700 font-medium text-xs">AUDIENCIAS PRÓXIMAS</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{upcomingCount}</div>
            <p className="text-gray-700 text-sm">Próximas 48h</p>
          </div>

          {/* Closed */}
          <div className="bg-success-light rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-green-700 font-medium text-xs">CASOS CERRADOS</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{closedCount}</div>
            <p className="text-gray-700 text-sm">Este trimestre</p>
          </div>
        </div>

        {/* Upcoming hearings */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Audiencias Próximas</h3>
            <a href="#" className="text-teal text-sm hover:underline">Ver calendario completo</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Caso</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha y Hora</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tribunal / Sala</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 2).map((report, idx) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">{report.title?.substring(0, 30)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">15 Oct. 10:30 AM</td>
                    <td className="py-3 px-4 text-gray-600">Tribunal Superior 4</td>
                    <td className="py-3 px-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reports.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <p className="text-sm">No hay audiencias próximas</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent notes */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Notas Recientes</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50/50">
              <p className="text-xs text-yellow-700 font-medium">RECORDATORIO</p>
              <p className="text-sm text-gray-800 mt-1">
                Revisar precedentes jurisprudenciales en casos similares para audiencia del viernes.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50">
              <p className="text-xs text-blue-700 font-medium">ESTADO</p>
              <p className="text-sm text-gray-800 mt-1">
                Actualización de jurisprudencia en derechos humanos cargada.
              </p>
            </div>
          </div>
        </div>

        {/* Recursos de Apoyo Legal */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recursos de Apoyo Legal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-teal hover:shadow-md transition">
              <h4 className="font-semibold text-gray-900 mb-2">Base de Jurisprudencia</h4>
              <p className="text-sm text-gray-600">Acceso a sentencias y precedentes relevantes</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-secondary hover:shadow-md transition">
              <h4 className="font-semibold text-gray-900 mb-2">Formularios Judiciales</h4>
              <p className="text-sm text-gray-600">Plantillas y documentos requeridos</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-accent hover:shadow-md transition">
              <h4 className="font-semibold text-gray-900 mb-2">Asesor Legal 24/7</h4>
              <p className="text-sm text-gray-600">Consultoría en casos complejos</p>
            </div>
          </div>
        </div>
    </div>
  )
}
