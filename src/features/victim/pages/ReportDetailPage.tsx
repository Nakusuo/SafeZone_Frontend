import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Timeline, Alert } from '@/shared/components'
import { ArrowLeft, Download, MessageCircle, Users } from 'lucide-react'
import { reportService } from '@/features/victim/services/reportService'
import { Report, Evaluation, LegalUpdate } from '@/shared/types'
import { userService } from '@/features/victim/services/userService'
import { EvidenceVault } from '@/features/shared-features/evidence/components/EvidenceVault'

export const ReportDetailPage = () => {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [psychologist, setPsychologist] = useState<any>(null)
  const [defender, setDefender] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!reportId) return

        const reportData = await reportService.getReportById(reportId)
        if (reportData) {
          setReport(reportData)

          
          const evals = await reportService.getEvaluations(reportId)
          setEvaluations(evals)

          
          if (reportData.psychologistId) {
            const psych = await userService.getUserById(reportData.psychologistId)
            setPsychologist(psych)
          }
          if (reportData.defenderId) {
            const def = await userService.getUserById(reportData.defenderId)
            setDefender(def)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [reportId])

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pending Review',
      UNDER_EVALUATION: 'Under Evaluation',
      IN_FOLLOW_UP: 'In Follow-up',
      RESOLVED: 'Resolved',
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-blue-50 text-blue-700',
      MEDIUM: 'bg-yellow-50 text-yellow-700',
      HIGH: 'bg-accent/10 text-accent',
    }
    return colors[priority] || 'bg-gray-100 text-gray-700'
  }

  const timelineEvents = [
    {
      id: '1',
      title: 'Report Registered',
      description: 'Your report has been received and registered in the system',
      date: report?.createdAt || new Date(),
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Professional Assignment',
      description: psychologist ? `Assigned to ${psychologist.name}` : 'Pending assignment',
      date: new Date(),
      status: report?.status !== 'PENDING' ? ('completed' as const) : ('pending' as const),
    },
    {
      id: '3',
      title: 'Psychological Evaluation',
      description: evaluations.length > 0 ? 'Evaluation completed' : 'Pending evaluation',
      date: new Date(),
      status: evaluations.length > 0 ? ('completed' as const) : (report?.status === 'UNDER_EVALUATION' ? ('current' as const) : ('pending' as const)),
    },
    {
      id: '4',
      title: 'Follow-up and Closure',
      description: 'Case monitoring and resolution',
      date: new Date(),
      status: report?.status === 'RESOLVED' ? ('completed' as const) : (report?.status === 'IN_FOLLOW_UP' ? ('current' as const) : ('pending' as const)),
    },
  ]

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading information...</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-8">
        <Alert
          type="danger"
          title="Error"
          message="Could not load the report"
        />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/victim')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
            <div className="flex gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(report.priority)}`}>
                {report.priority === 'HIGH' ? 'Urgent' : report.priority === 'MEDIUM' ? 'Medium priority' : 'Low priority'}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {getStatusLabel(report.status)}
              </span>
            </div>
          </div>
          <Button variant="outline" size="md">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      
      <Card title="Case Details" className="mb-6">
        <p className="text-gray-700 mb-4">{report.description}</p>
      </Card>

      
      <Card title="Case Progress" className="mb-6">
        <Timeline events={timelineEvents} />
      </Card>

      
      {(psychologist || defender) && (
        <Card title="Your Professional Team" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {psychologist && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{psychologist.name}</h4>
                  <p className="text-sm text-gray-600">Psychologist</p>
                </div>
              </div>
            )}
            {defender && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{defender.name}</h4>
                  <p className="text-sm text-gray-600">Legal Defender</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      
      {evaluations.length > 0 && (
        <Card title="Psychological Evaluations" className="mb-6">
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Evaluation</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(evaluation.date).toLocaleDateString('en-US')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Diagnosis:</strong> {evaluation.diagnosis}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Recommendations:</strong> {evaluation.recommendations.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      
      <Card title="Communication Center" className="mb-6">
        <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/chat')}>
          <MessageCircle className="w-4 h-4" />
          Send message to team
        </Button>
      </Card>

      
      <div className="mb-6">
        <EvidenceVault caseId={report.id} />
      </div>
    </div>
  )
}


