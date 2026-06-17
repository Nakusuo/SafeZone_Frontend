import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { reportService, } from '@/features/victim/services/reportService'
import { Report } from '@/shared/types'

export const CasesPage = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')

  const user = sessionStorage.getItem('user')
  const userData = user ? JSON.parse(user) : null

  useEffect(() => {
    const loadData = async () => {
      try {
        const allReports = await reportService.getAllReports()
        const myReports = allReports.filter(r => r.psychologistId === userData?.id)
        setReports(myReports)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [userData?.id])

  const filteredReports = reports.filter(r => {
    if (filter === 'active') return r.status !== 'RESOLVED'
    if (filter === 'resolved') return r.status === 'RESOLVED'
    return true
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_EVALUATION: 'bg-blue-100 text-blue-800',
      IN_FOLLOW_UP: 'bg-green-100 text-green-800',
      RESOLVED: 'bg-green-100 text-green-800',
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: 'text-red-600 bg-red-50',
      MEDIUM: 'text-yellow-600 bg-yellow-50',
      LOW: 'text-blue-600 bg-blue-50',
    }
    return colors[priority] || 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="w-full px-8 py-8 pb-16">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Cases</h1>
        <p className="text-gray-600">Manage and review all your assigned cases</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border-l-4 border-teal">
          <p className="text-gray-600 text-sm">Total cases</p>
          <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Under evaluation</p>
          <p className="text-3xl font-bold text-gray-900">
            {reports.filter(r => r.status === 'UNDER_EVALUATION').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">In follow-up</p>
          <p className="text-3xl font-bold text-gray-900">
            {reports.filter(r => r.status === 'IN_FOLLOW_UP').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border-l-4 border-secondary">
          <p className="text-gray-600 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-gray-900">
            {reports.filter(r => r.status === 'RESOLVED').length}
          </p>
        </div>
      </div>

      
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-teal text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'active'
              ? 'bg-teal text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'resolved'
              ? 'bg-teal text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Resolved
        </button>
      </div>

      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">
            <p>Loading cases...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No cases to display</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition border-l-4 border-teal"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(report.createdAt || '').toLocaleDateString('en-US')}
                      </span>
                    </div>

                    <div>
                      <span className={`px-3 py-1 rounded text-xs font-bold ${getPriorityColor(report.priority)}`}>
                        {report.priority === 'HIGH' ? '🔴 HIGH' : report.priority === 'MEDIUM' ? '🟡 MEDIUM' : '🔵 LOW'}
                      </span>
                    </div>

                    <div className="text-gray-600">
                      <strong>Type:</strong> {report.type === 'PHYSICAL_VIOLENCE' ? 'Physical Violence' : 'Psychological Abuse'}
                    </div>
                  </div>
                </div>

                <button onClick={() => navigate(`/cases/${report.id}/log`)} className="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

