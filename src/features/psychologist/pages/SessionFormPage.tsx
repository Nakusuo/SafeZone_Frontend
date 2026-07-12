import { useState } from 'react'
import { ChevronLeft, Save, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const SessionFormPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    sessionType: 'follow-up',
    mood: 'calm',
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
      setError('Please fill in the date and time of the session')
      return
    }
    
    if (!formData.notes.trim()) {
      setError('Clinical notes cannot be empty')
      return
    }
    
    
    const appDataStr = sessionStorage.getItem('safezone_appdata')
    if (appDataStr) {
      const appData = JSON.parse(appDataStr)
      
      
      if (!appData.evaluations) appData.evaluations = []
      
      const newEvaluation = {
        id: `eval_${Date.now()}`,
        reportId: 'REP-2026-00123', 
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
    
    alert('✓ Session recorded in case log')
    navigate('/psychologist/cases')
  }

  return (
    <div className="w-full px-8 py-8 pb-16">
      
      <div className="flex items-center gap-2 mb-8 text-sm">
        <button onClick={() => navigate(-1)} className="text-teal hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">My Cases</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">María García</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">New Session</span>
      </div>

      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Registration - Patient: M. García (REP-2026-00123)</h1>
        <p className="text-gray-600">Document psychological evaluation and case follow-up</p>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Session Date and Time</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
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

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Session Type</h3>
              <select
                value={formData.sessionType}
                onChange={(e) => handleChange('sessionType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="follow-up">Follow-up</option>
                <option value="initial">Initial Evaluation</option>
                <option value="crisis">Crisis Intervention</option>
                <option value="family">Family Session</option>
              </select>
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Observed Emotional State</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { value: 'calm', label: 'Calm' },
                  { value: 'anxious', label: 'Anxious' },
                  { value: 'withdrawn', label: 'Withdrawn' },
                  { value: 'reactive', label: 'Reactive' }
                ].map(mood => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => handleChange('mood', mood.value)}
                    className={`border px-4 py-2 rounded-lg font-medium transition ${
                      formData.mood === mood.value
                        ? 'bg-teal text-white border-teal'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Detailed Clinical Notes</h3>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Describe clinical observations, patient narrative, and key moments..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal h-32 resize-none"
                required
              />
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Recommendations / Action Plan</h3>
              <textarea
                value={formData.recommendations}
                onChange={(e) => handleChange('recommendations', e.target.value)}
                placeholder="Homework, next steps, or therapeutic objectives..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal h-32 resize-none"
              />
            </div>

            
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sensitive}
                  onChange={(e) => handleChange('sensitive', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-medium text-red-900">Mark as Confidential / Private</span>
              </label>
              <p className="text-xs text-red-800 mt-2">Only clinical staff and the assigned psychologist will have access.</p>
            </div>

            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save to Case Log
              </button>
            </div>
          </form>
        </div>

        
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Patient History</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-teal font-medium">SESSION 12 - OCT 14</p>
                <p className="text-sm text-gray-700">Stable Follow-up</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">SESSION 11 - OCT 7</p>
                <p className="text-sm text-gray-700">Evaluation Review</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 font-medium">SESSION 10 - SEP 30</p>
                <p className="text-sm text-gray-700">Routine Check</p>
              </div>
              <button className="text-teal text-sm font-medium hover:underline">View complete clinical file →</button>
            </div>
          </div>

          
          <div className="bg-teal-900 text-white rounded-lg p-6">
            <h3 className="font-bold mb-4">EMERGENCY CONTACT</h3>
            <div className="space-y-2">
              <p className="font-medium">Elena García (Mother)</p>
              <p className="text-sm">+1 (555) 012-3456</p>
              <p className="text-xs text-teal-100 mt-3">Prioritize call in case of level 3-4 crisis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
