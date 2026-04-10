import React, { useState } from 'react';
import { Card, Button } from '@/shared/components';
import { CreateSessionNoteDto } from '../types';
import { psychologistService } from '../services';
import { Save, AlertCircle } from 'lucide-react';

interface EditorBitacoraProps {
  followUpId: string;
  onSave?: (note: any) => void;
  initialData?: Partial<CreateSessionNoteDto>;
}

/**
 * Editor de bitácora/notas clínicas para el psicólogo
 * Permite registrar el progreso emocional y observaciones de sesiones
 */
export const EditorBitacora: React.FC<EditorBitacoraProps> = ({
  followUpId,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<CreateSessionNoteDto>({
    content: initialData?.content || '',
    observations: initialData?.observations || '',
    recommendations: initialData?.recommendations || '',
    emotionalState: initialData?.emotionalState || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const note = await psychologistService.createSessionNote(followUpId, formData);
      setSuccess(true);
      onSave?.(note);
      
      // Reset form
      setFormData({
        content: '',
        observations: '',
        recommendations: '',
        emotionalState: ''
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la nota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bitácora Clínica</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Nota de sesión guardada exitosamente
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido de la Sesión
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Resumen de la sesión, temas tratados, actividades realizadas..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado Emocional
          </label>
          <textarea
            name="emotionalState"
            value={formData.emotionalState}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción del estado emocional actual, cambios observados..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones
          </label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Observaciones técnicas, patrones identificados, comportamientos notables..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recomendaciones
          </label>
          <textarea
            name="recommendations"
            value={formData.recommendations}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Recomendaciones para la próxima sesión, tareas, seguimiento..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 flex-1"
          >
            <Save size={20} />
            {loading ? 'Guardando...' : 'Guardar Nota'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
