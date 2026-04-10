import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/shared/components';
import { LegalCase, InteroperabilityData } from '../types';
import { defenderService } from '../services';
import { Eye, Plus, AlertCircle, FileText } from 'lucide-react';

interface ExpedienteLegalProps {
  caseId: string;
  onViewDocuments?: () => void;
}

/**
 * Expediente Legal
 * Visualiza todos los detalles del caso incluyendo notas del psicólogo
 * Demuestra interoperabilidad entre módulos
 */
export const ExpedienteLegal: React.FC<ExpedienteLegalProps> = ({
  caseId,
  onViewDocuments
}) => {
  const [caseData, setCaseData] = useState<InteroperabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseDetail();
  }, [caseId]);

  const fetchCaseDetail = async () => {
    try {
      const data = await defenderService.getCaseDetail(caseId);
      setCaseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el expediente');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors: Record<string, string> = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  const statusColors: Record<string, string> = {
    'open': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'pending-trial': 'bg-orange-100 text-orange-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return <Card className="p-6"><div className="text-center py-8">Cargando expediente...</div></Card>;
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  if (!caseData) {
    return <Card className="p-6"><div className="text-center py-8">No hay datos disponibles</div></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Información del Caso */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Expediente Legal</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-600">Número de Caso</label>
            <p className="text-lg font-semibold text-gray-800">{caseData.caseId}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Estado</label>
            <p className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              En Proceso
            </p>
          </div>
        </div>

        <Button onClick={onViewDocuments} className="flex items-center gap-2">
          <FileText size={20} />
          Ver Documentos Adjuntos
        </Button>
      </Card>

      {/* Información de la Víctima */}
      {caseData.victimInfo && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Información de la Víctima</h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <p className="text-gray-800">{caseData.victimInfo.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Estado</label>
              <p className="text-gray-800">{caseData.victimInfo.status || 'N/A'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Notas del Psicólogo - Interoperabilidad */}
      {caseData.psychologistNotes && caseData.psychologistNotes.length > 0 && (
        <Card className="p-6 border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📋 Notas del Psicólogo (Acceso Coordinado)
          </h3>
          <div className="space-y-3">
            {caseData.psychologistNotes.map((note, index) => (
              <div
                key={index}
                className="p-3 bg-purple-50 border border-purple-200 rounded"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-purple-800">
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                    {note.emotionalState || 'Seguimiento'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{note.content}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Documentos Legales */}
      {caseData.legalDocuments && caseData.legalDocuments.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Documentos Adjuntos</h3>
          <div className="space-y-2">
            {caseData.legalDocuments.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded"
              >
                <div>
                  <p className="font-medium text-gray-800">{doc.fileName}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
