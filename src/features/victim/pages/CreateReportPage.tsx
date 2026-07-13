import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, TextArea, Select, Alert } from '@/components'
import { FileText, ArrowLeft, MapPin } from 'lucide-react'
import { reportService } from '@/features/victim/services/reportService'
import { getCurrentPosition } from '@/features/victim/services/emergencyService'

export const CreateReportPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: 'MEDIUM',
    location: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleGetLocation = async () => {
    setIsLoadingLocation(true)
    setError('')
    try {
      const loc = await getCurrentPosition()
      handleChange('location', `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`)
    } catch (err: any) {
      setError(err.message || 'Error getting location')
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return false
    }
    if (!formData.type) {
      setError('You must select an incident type')
      return false
    }
    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters long')
      return false
    }
    if (!formData.location.trim()) {
      setError('Location or address is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const userData = sessionStorage.getItem('user')
    const user = userData ? JSON.parse(userData) : null

    if (!user || user.role !== 'VICTIM') {
      setError('Only victims can create reports')
      return
    }

    setIsLoading(true)
    try {
      await reportService.createReport(user.id, {
        title: formData.title,
        description: formData.description,
        type: formData.type as any,
        priority: formData.priority as any,
        status: 'PENDING',
        location: formData.location,
      })

      setSuccess(true)
      setFormData({ title: '', description: '', type: '', priority: 'MEDIUM', location: '' })
      
      
      setTimeout(() => {
        navigate('/dashboard/victim')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error creating the report')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/victim')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Nuevo Reporte</h1>
        <p className="text-gray-600">
          Tu información está protegida y encriptada. Solo los profesionales asignados podrán verla.
        </p>
      </div>

      
      <div className="mb-6 space-y-3">
        {success && (
          <Alert
            type="success"
            title="Report registered successfully!"
            message="Your report has been sent. You will be redirected shortly..."
          />
        )}
        {error && (
          <Alert
            type="danger"
            title="Error sending report"
            message={error}
            dismissible
            onClose={() => setError('')}
          />
        )}
      </div>

      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="General Information" className="space-y-4">
          <Input
            label="Report Title"
            placeholder="Briefly describe what happened"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            required
          />

          <TextArea
            label="Detailed Description"
            placeholder="Provide all relevant details. Be as specific as possible without including sensitive personal information."
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            maxLength={2000}
            rows={6}
            required
          />

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Incident Location"
                placeholder="City, neighborhood or area (optional)"
                value={formData.location}
                onChange={(value) => handleChange('location', value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="mb-4 whitespace-nowrap"
              onClick={handleGetLocation}
              isLoading={isLoadingLocation}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Get Location
            </Button>
          </div>
        </Card>

        <Card title="Incident Classification" className="space-y-4">
          <Select
            label="Incident Type"
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
            options={[
              { value: '', label: 'Select a type...' },
              { value: 'PHYSICAL_VIOLENCE', label: 'Physical Violence' },
              { value: 'PSYCHOLOGICAL_ABUSE', label: 'Psychological Abuse' },
              { value: 'OTHER', label: 'Other' },
            ]}
            required
          />

          <Select
            label="Urgency Level"
            value={formData.priority}
            onChange={(value) => handleChange('priority', value)}
            options={[
              { value: 'LOW', label: 'Low (can wait)' },
              { value: 'MEDIUM', label: 'Medium (moderate urgency)' },
              { value: 'HIGH', label: 'High (requires immediate attention)' },
            ]}
            required
          />
        </Card>

        <Card type="info" className="flex gap-3">
          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Privacidad y Confidencialidad</p>
            <p className="text-sm text-gray-700">
              Tu reporte es completamente confidencial. Solo se compartirá con los profesionales necesarios para tu caso.
            </p>
          </div>
        </Card>

        
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard/victim')}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Enviar Reporte
          </Button>
        </div>
      </form>
    </div>
  )
}
