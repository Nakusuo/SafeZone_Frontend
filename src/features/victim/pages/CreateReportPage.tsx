import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, TextArea, Select, Alert } from '@/shared/components'
import { FileText, ArrowLeft } from 'lucide-react'
import { reportService } from '@/features/victim/services/reportService'

export const CreateReportPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título es requerido')
      return false
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida')
      return false
    }
    if (!formData.type) {
      setError('Debes seleccionar el tipo de incidente')
      return false
    }
    if (formData.description.length < 20) {
      setError('La descripción debe tener al menos 20 caracteres')
      return false
    }
    if (!formData.location.trim()) {
      setError('La ubicación o dirección es requerida')
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
      setError('Solo las víctimas pueden crear denuncias')
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
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard/victim')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error al crear la denuncia')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/victim')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Nueva Denuncia</h1>
        <p className="text-gray-600">
          Tu información está protegida y encriptada. Solo los profesionales asignados podrán verla.
        </p>
      </div>

      {/* Alertas */}
      <div className="mb-6 space-y-3">
        {success && (
          <Alert
            type="success"
            title="¡Denuncia registrada exitosamente!"
            message="Tu denuncia ha sido enviada. Serás redirigido en unos momentos..."
          />
        )}
        {error && (
          <Alert
            type="danger"
            title="Error al enviar"
            message={error}
            dismissible
            onClose={() => setError('')}
          />
        )}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Información General" className="space-y-4">
          <Input
            label="Título de la denuncia"
            placeholder="Describe brevemente lo ocurrido"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            required
          />

          <TextArea
            label="Descripción detallada"
            placeholder="Proporciona todos los detalles relevantes. Sé lo más específico posible sin incluir información personal sensible."
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            maxLength={2000}
            rows={6}
            required
          />

          <Input
            label="Ubicación del incidente"
            placeholder="Ciudad, barrio o zona (opcional)"
            value={formData.location}
            onChange={(value) => handleChange('location', value)}
          />
        </Card>

        <Card title="Clasificación del Incidente" className="space-y-4">
          <Select
            label="Tipo de incidente"
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
            options={[
              { value: '', label: 'Selecciona un tipo...' },
              { value: 'PHYSICAL_VIOLENCE', label: 'Violencia Física' },
              { value: 'PSYCHOLOGICAL_ABUSE', label: 'Abuso Psicológico' },
              { value: 'OTHER', label: 'Otro' },
            ]}
            required
          />

          <Select
            label="Nivel de urgencia"
            value={formData.priority}
            onChange={(value) => handleChange('priority', value)}
            options={[
              { value: 'LOW', label: 'Baja (puede esperar)' },
              { value: 'MEDIUM', label: 'Media (moderada urgencia)' },
              { value: 'HIGH', label: 'Alta (requiere atención inmediata)' },
            ]}
            required
          />
        </Card>

        <Card type="info" className="flex gap-3">
          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Privacidad y Confidencialidad</p>
            <p className="text-sm text-gray-700">
              Tu denuncia es completamente confidencial. Solo será compartida con los profesionales necesarios para tu caso.
            </p>
          </div>
        </Card>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
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
            Enviar Denuncia
          </Button>
        </div>
      </form>
    </div>
  )
}
