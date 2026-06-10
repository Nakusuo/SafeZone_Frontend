import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { Button, TextArea } from '@/components'

interface AddLogEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (description: string, type: string) => Promise<void>
}

export const AddLogEntryModal: React.FC<AddLogEntryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [description, setDescription] = useState('')
  const [type, setType] = useState('NOTE')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      setError('Description is required')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      await onAdd(description, type)
      setDescription('')
      setType('NOTE')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error adding log entry')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Agregar Nota a Bitácora</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Nota
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
            >
              <option value="NOTE">Nota General</option>
              <option value="EVALUATION">Evaluación</option>
              <option value="LEGAL_ACTION">Acción Legal</option>
              <option value="MEETING">Reunión / Sesión</option>
            </select>
          </div>

          <TextArea
            label="Descripción detallada"
            value={description}
            onChange={(val) => setDescription(val)}
            placeholder="Escribe los detalles de la sesión o avance..."
            rows={5}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              <Save className="w-4 h-4 mr-2 inline" />
              Guardar Nota
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
