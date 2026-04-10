import React, { useState } from 'react';
import { Card, Button } from '@/shared/components';
import { Report, CreateReportDto } from '../types';
import { reportService } from '../services';
import { Upload, AlertCircle } from 'lucide-react';

/**
 * Formulario para crear denuncias
 * Gestiona la captura de detalles e evidencias
 */
export const FormularioDenuncia: React.FC = () => {
  const [formData, setFormData] = useState<CreateReportDto>({
    title: '',
    description: '',
    category: 'other',
    severity: 'medium',
    attachments: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
    setFormData(prev => ({ ...prev, attachments: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await reportService.createReport(formData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: 'other',
        severity: 'medium',
        attachments: []
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la denuncia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Denuncia</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Denuncia creada exitosamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Breve descripción del incidente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Cuéntanos qué sucedió..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="harassment">Acoso</option>
              <option value="violence">Violencia</option>
              <option value="discrimination">Discriminación</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severidad
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Archivos/Evidencias
          </label>
          <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="text-center">
              <Upload className="mx-auto mb-2 text-gray-400" size={24} />
              <input
                type="file"
                name="attachments"
                onChange={handleFileChange}
                multiple
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm text-gray-600">
                  {formData.attachments?.length || 0} archivo(s) seleccionado(s)
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Enviando...' : 'Enviar Denuncia'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setFormData({
              title: '',
              description: '',
              category: 'other',
              severity: 'medium',
              attachments: []
            })}
          >
            Limpiar
          </Button>
        </div>
      </form>
    </Card>
  );
};
