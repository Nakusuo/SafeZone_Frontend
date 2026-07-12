import React, { useState } from 'react'
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Button, Input, TextArea, Select } from '@/components'

interface ScheduleAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (appointment: any) => void
}

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PSYCHOLOGICAL',
    date: '',
    time: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    
    setTimeout(() => {
      onAdd({
        id: Date.now().toString(),
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`),
      })
      setFormData({ title: '', description: '', type: 'PSYCHOLOGICAL', date: '', time: '' })
      setIsLoading(false)
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Schedule New Appointment
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Meeting Title"
            placeholder="e.g., Preliminary interview, Hearing #1..."
            value={formData.title}
            onChange={(val) => setFormData(prev => ({ ...prev, title: val }))}
            required
          />

          <Select
            label="Appointment Type"
            value={formData.type}
            onChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
            options={[
              { value: 'PSYCHOLOGICAL', label: 'Psychological Consultation' },
              { value: 'LEGAL', label: 'Hearing / Legal Review' },
              { value: 'GENERAL', label: 'General Meeting' }
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <TextArea
            label="Description or Video Call Link"
            value={formData.description}
            onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
            placeholder="Add details, instructions or the Meet/Zoom link..."
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
