import { useState } from 'react'
import { ChevronLeft, Save, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const SessionFormPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    sessionType: 'seguimiento',
    mood: 'calmo',
    notes: '',
    recommendations: '',
    sensitive: false,
  })
  const [error, setError] = useState('')

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time) {
      setError('Por favor completa la fecha y hora de la sesión')
      return
    }
    
    if (!formData.notes.trim()) {
      setError('Las notas clínicas no pueden estar vacías')
      return
    }
    
    // Guardar sesión en sessionStorage
    const appDataStr = sessionStorage.getItem('safezone_appdata')
    if (appDataStr) {
      const appData = JSON.parse(appDataStr)
      
      // Agregar evaluación a las evaluations
      if (!appData.evaluations) appData.evaluations = []
      
      const newEvaluation = {
        id: `eval_${Date.now()}`,
        reportId: 'REP-2026-00123', // Patient ID
        psychologistId: 'psychologist_1',
        date: `${formData.date}T${formData.time}`,
        diagnosis: formData.mood,
        notes: formData.notes,
        recommendations: formData.recommendations ? [formData.recommendations] : [],
        type: formData.sessionType,
        sensitive: formData.sensitive
      }
      
      appData.evaluations.push(newEvaluation)
      sessionStorage.setItem('safezone_appdata', JSON.stringify(appData))
    }
    
    alert('✓ Sesión registrada en bitácora')
    navigate('/psychologist/cases')
  }

  return (
    <div className="w-full px-8 py-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        <button onClick={() => navigate(-1)} className="text-teal hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Mis Casos</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">María García</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Nueva Sesión</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Sesión - Paciente: M. García (REP-2026-00123)</h1>
        <p className="text-gray-600">Documentar evaluación psicológica y seguimiento del caso</p>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Date and Time */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Fecha y Hora de la Sesión</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Session Type */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Tipo de Sesión</h3>
              <select
                value={formData.sessionType}
                onChange={(e) => handleChange('sessionType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="seguimiento">Seguimiento</option>
                <option value="inicial">Evaluación Inicial</option>
                <option value="crisis">Intervención de Crisis</option>
                <option value="familiar">Sesión Familiar</option>
              </select>
            </div>

            {/* Mood */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Estado Emocional Observado</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { value: 'calmo', label: 'Calmado' },
                  { value: 'ansioso', label: 'Ansioso' },
                  { value: 'retraido', label: 'Retraído' },
                  { value: 'reactivo', label: 'Reactivo' }
                ].map(mood => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => handleChange('mood', mood.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      formData.mood === mood.value
                        ? 'bg-teal text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Notas Clínicas Detalladas</h3>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Describe observaciones clínicas, narrativa del paciente y momentos clave..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal h-32 resize-none"
                required
              />
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Recomendaciones / Plan de Acción</h3>
              <textarea
                value={formData.recommendations}
                onChange={(e) => handleChange('recommendations', e.target.value)}
                placeholder="Deberes, próximos pasos u objetivos terapéuticos..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal h-32 resize-none"
              />
            </div>

            {/* Sensitive */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sensitive}
                  onChange={(e) => handleChange('sensitive', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-medium text-red-900">Marcar como Confidencial / Privado</span>
              </label>
              <p className="text-xs text-red-800 mt-2">Solo personal clínico actual y psicólogo asignado tendrán acceso.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Guardar en Bitácora
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Patient History Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Historial del Paciente</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-teal font-medium">SESIÓN 12 - 14 OCT</p>
                <p className="text-sm text-gray-700">Seguimiento Estable</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">SESIÓN 11 - 07 OCT</p>
                <p className="text-sm text-gray-700">Revisión de Evaluación</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 font-medium">SESIÓN 10 - 30 SEP</p>
                <p className="text-sm text-gray-700">Chequeo Rutinario</p>
              </div>
              <button className="text-teal text-sm font-medium hover:underline">Ver archivo clínico completo →</button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-teal-900 text-white rounded-lg p-6">
            <h3 className="font-bold mb-4">CONTACTO DE EMERGENCIA</h3>
            <div className="space-y-2">
              <p className="font-medium">Elena García (Madre)</p>
              <p className="text-sm">+1 (555) 012-3456</p>
              <p className="text-xs text-teal-100 mt-3">Priorizar llamada en caso de crisis nivel 3-4.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
