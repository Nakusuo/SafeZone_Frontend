import React, { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Plus, Video, Scale, Users } from 'lucide-react'
import { Card, Button } from '@/components'
import { ScheduleAppointmentModal } from '../components/ScheduleAppointmentModal'

export const CalendarView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      title: 'Preliminary Interview (Case #123)',
      description: 'Initial evaluation with the victim. Link: meet.google.com/abc-xyz',
      type: 'PSYCHOLOGICAL',
      date: new Date(new Date().getTime() + 86400000), 
    },
    {
      id: '2',
      title: 'Pre-trial Hearing (Case #98)',
      description: 'Presentation of evidence before the 5th criminal court.',
      type: 'LEGAL',
      date: new Date(new Date().getTime() + 86400000 * 3), 
    }
  ])

  const userData = sessionStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null
  const isProfessional = user?.role === 'PSYCHOLOGIST' || user?.role === 'DEFENDER' || user?.role === 'ADMIN'

  const handleAddAppointment = (appointment: any) => {
    setAppointments(prev => [...prev, appointment].sort((a, b) => a.date.getTime() - b.date.getTime()))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LEGAL': return <Scale className="w-5 h-5 text-indigo-600" />
      case 'PSYCHOLOGICAL': return <Video className="w-5 h-5 text-teal-600" />
      default: return <Users className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'LEGAL': return 'bg-indigo-50 border-indigo-200 text-indigo-900'
      case 'PSYCHOLOGICAL': return 'bg-teal-50 border-teal-200 text-teal-900'
      default: return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Calendar Schedule
          </h1>
          <p className="text-gray-600">
            Manage and view your upcoming appointments, hearings, and evaluations.
          </p>
        </div>
        
        {isProfessional && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2 inline" />
            New Appointment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <Card title="Month Summary" className="border-t-4 border-primary">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-xl">
                <span className="text-sm font-medium text-teal-900">Psychological Consultations</span>
                <span className="text-lg font-bold text-teal-700">
                  {appointments.filter(a => a.type === 'PSYCHOLOGICAL').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                <span className="text-sm font-medium text-indigo-900">Legal Hearings</span>
                <span className="text-lg font-bold text-indigo-700">
                  {appointments.filter(a => a.type === 'LEGAL').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-900">Total Scheduled</span>
                <span className="text-lg font-bold text-gray-700">{appointments.length}</span>
              </div>
            </div>
          </Card>
        </div>

        
        <div className="lg:col-span-2">
          <Card title="Upcoming Events">
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>You have no appointments scheduled soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(app => (
                  <div key={app.id} className={`p-5 rounded-2xl border-2 transition-all hover:shadow-md ${getTypeStyle(app.type)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 rounded-lg">
                          {getTypeIcon(app.type)}
                        </div>
                        <h3 className="font-bold text-lg">{app.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm opacity-80 mb-4">{app.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-full">
                        <CalendarIcon className="w-4 h-4" />
                        {app.date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-full">
                        <Clock className="w-4 h-4" />
                        {app.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <ScheduleAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAppointment}
      />
    </div>
  )
}
