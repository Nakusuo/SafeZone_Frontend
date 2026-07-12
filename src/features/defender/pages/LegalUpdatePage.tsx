import { useState } from 'react'
import { ChevronLeft, Save, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const LegalUpdatePage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    updateType: 'hearing',
    court: '',
    outcome: '',
    legalSteps: '',
    confidential: false,
  })
  const [error, setError] = useState('')

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time) {
      setError('Please fill in the date and time of the update')
      return
    }
    
    if (!formData.court.trim()) {
      setError('The court or entity cannot be empty')
      return
    }
    
    if (!formData.outcome.trim()) {
      setError('The outcome description cannot be empty')
      return
    }
    
    
    const appDataStr = sessionStorage.getItem('safezone_appdata')
    if (appDataStr) {
      const appData = JSON.parse(appDataStr)
      
      if (!appData.legalUpdates) appData.legalUpdates = []
      
      const newUpdate = {
        id: `legal_${Date.now()}`,
        reportId: 'REP-2026-00123',
        defenderId: 'defender_1',
        date: `${formData.date}T${formData.time}`,
        status: formData.updateType,
        updateType: formData.updateType,
        court: formData.court,
        outcome: formData.outcome,
        nextSteps: formData.legalSteps,
        confidential: formData.confidential,
        notes: formData.outcome
      }
      
      appData.legalUpdates.push(newUpdate)
      sessionStorage.setItem('safezone_appdata', JSON.stringify(appData))
    }
    
    alert('✓ Legal update saved')
    navigate('/defender/cases')
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
        <span className="text-gray-900 font-medium">Update Legal Status</span>
      </div>

      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Legal Status: Patient M. García (REP-2026-00123)</h1>
        <p className="text-gray-600">
          Record critical updates, hearing outcomes, and procedural changes to maintain the integrity of the protection file.
        </p>
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
              <h3 className="font-bold text-gray-900 mb-4">Date and Time of the Update/Hearing</h3>
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
              <h3 className="font-bold text-gray-900 mb-4">Update Type</h3>
              <select
                value={formData.updateType}
                onChange={(e) => handleChange('updateType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="hearing">Hearing</option>
                <option value="submission">Legal Submission</option>
                <option value="order">Protection Order</option>
                <option value="investigation">Investigation Update</option>
              </select>
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Competent Court / Entity</h3>
              <input
                type="text"
                value={formData.court}
                onChange={(e) => handleChange('court', e.target.value)}
                placeholder="e.g. Superior Court of Justice, District 4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                required
              />
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Outcome / Summary</h3>
              <textarea
                value={formData.outcome}
                onChange={(e) => handleChange('outcome', e.target.value)}
                placeholder="Detailed description of procedures or progress made..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal h-32 resize-none"
                required
              />
            </div>

            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Next Legal Steps</h3>
              <textarea
                value={formData.legalSteps}
                onChange={(e) => handleChange('legalSteps', e.target.value)}
                placeholder="Identify immediate required actions..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal h-32 resize-none"
              />
            </div>

            
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.confidential}
                  onChange={(e) => handleChange('confidential', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-medium text-red-900">Confidentiality Note</span>
              </label>
              <p className="text-xs text-red-800 mt-2">
                All information entered here is confidential and subject to attorney-client privilege. 
                Ensure that all details are appropriate for official legal records.
              </p>
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
                Save Update
              </button>
            </div>
          </form>
        </div>

        
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Case Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">INCIDENT TYPE</p>
                <p className="text-sm text-gray-900">Report of Workplace Harassment</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">STATUS</p>
                <p className="text-sm">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Intervention in Progress
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">ORIGINAL DESCRIPTION</p>
                <p className="text-sm text-gray-600">
                  Systemic patterns of verbal abuse reported within the clinical department. Patient seeks formal protection and reassignment.
                </p>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-teal pl-4">
                <p className="text-xs text-gray-500">May 12, 2026</p>
                <p className="text-sm font-medium text-gray-900">First report submitted</p>
              </div>
              <div className="border-l-2 border-gray-300 pl-4">
                <p className="text-xs text-gray-500">May 15, 2026</p>
                <p className="text-sm font-medium text-gray-900">Protection order draft</p>
              </div>
            </div>
          </div>

          
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Legal Reminder</h4>
                <p className="text-xs text-blue-800">
                  Ensure that all documentation complies with procedural requirements and local legal regulations for admissibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
