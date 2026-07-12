import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, FileText, Calendar, ShieldAlert } from 'lucide-react'
import { Card, Button, Timeline, Alert } from '@/components'
import { reportService } from '@/features/victim/services/reportService'
import { Report } from '@/shared/types'
import { AddLogEntryModal } from '../components/AddLogEntryModal'
import { EvidenceVault } from '@/features/shared-features/evidence/components/EvidenceVault'

export const CaseLogPage = () => {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [logEntries, setLogEntries] = useState<any[]>([])

  const userData = sessionStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!caseId) return
        const reportData = await reportService.getReportById(caseId)
        
        if (!reportData) {
          throw new Error('Case not found.')
        }

        
        
        if (user?.role === 'PSYCHOLOGIST' && reportData.psychologistId !== user.id) {
          throw new Error('You do not have access to this case (not assigned).')
        }
        if (user?.role === 'DEFENDER' && reportData.defenderId !== user.id) {
          throw new Error('You do not have access to this case (not assigned).')
        }

        setReport(reportData)
        
        
        setLogEntries([
          {
            id: 'init-1',
            title: 'Case assigned and reviewed',
            description: 'The case has been opened and assigned to the multidisciplinary team.',
            date: reportData?.createdAt || new Date(),
            status: 'completed'
          }
        ])

      } catch (err: any) {
        setError(err.message || 'Error loading case')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [caseId, user?.id, user?.role])

  const handleAddLog = async (description: string, type: string) => {
    
    
    const newEntry = {
      id: Date.now().toString(),
      title: `Note: ${type === 'NOTE' ? 'General' : type === 'EVALUATION' ? 'Evaluation' : type === 'LEGAL_ACTION' ? 'Legal Action' : 'Meeting'}`,
      description: `${description} (Added by ${user?.name})`,
      date: new Date(),
      status: 'current'
    }
    setLogEntries(prev => [newEntry, ...prev])
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Loading case information...</p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Alert type="danger" title="Access Denied / Error" message={error} />
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Cases
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Log</h1>
          <p className="text-gray-600">
            ID: {caseId} • {report.title}
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 inline mr-2" />
          Add Note to Log
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="space-y-6 lg:col-span-1">
          <Card title="General Information" className="border-t-4 border-primary">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Violence Type</p>
                <p className="text-sm text-gray-900">{report.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Priority</p>
                <p className={`text-sm font-semibold ${report.priority === 'HIGH' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {report.priority}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
                <p className="text-sm text-gray-900">{report.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Location</p>
                <p className="text-sm text-gray-900 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-gray-400" />
                  {report.location || 'Not provided'}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Original Description" className="bg-gray-50/50">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.description}</p>
          </Card>
        </div>

        
        <div className="lg:col-span-2">
          <Card title="Follow-up Registry (Log)">
            {logEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>There are no entries in the log yet.</p>
              </div>
            ) : (
              <Timeline events={logEntries} />
            )}
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <EvidenceVault caseId={caseId || ''} />
      </div>

      <AddLogEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddLog}
      />
    </div>
  )
}
