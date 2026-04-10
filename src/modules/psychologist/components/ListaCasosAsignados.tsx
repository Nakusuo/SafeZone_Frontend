import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/shared/components';
import { CaseFollow } from '../types';
import { psychologistService } from '../services';
import { Eye, Plus, AlertCircle } from 'lucide-react';

interface ListaCasosAsignadosProps {
  psychologistId: string;
  onSelectCase?: (caseId: string) => void;
  onCreateNote?: (caseId: string) => void;
}

/**
 * Lista de casos asignados al psicólogo
 * Permite filtrar por estado y acceder rápidamente a cada caso
 */
export const ListaCasosAsignados: React.FC<ListaCasosAsignadosProps> = ({
  psychologistId,
  onSelectCase,
  onCreateNote
}) => {
  const [cases, setCases] = useState<CaseFollow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'completed'>('all');

  useEffect(() => {
    fetchCases();
  }, [psychologistId]);

  const fetchCases = async () => {
    try {
      const data = await psychologistService.getAssignedCases(psychologistId);
      setCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar casos');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = filterStatus === 'all' 
    ? cases 
    : cases.filter(c => c.status === filterStatus);

  const riskColors: Record<string, string> = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  const statusColors: Record<string, string> = {
    'active': 'bg-blue-100 text-blue-800',
    'paused': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'referred': 'bg-purple-100 text-purple-800'
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Casos Asignados</h2>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2 mb-4">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'paused', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando casos...</div>
      ) : filteredCases.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay casos para mostrar</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map(caseItem => (
            <div
              key={caseItem.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">Caso #{caseItem.id.slice(0, 8)}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[caseItem.status]}`}>
                  {caseItem.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nivel de Riesgo:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskColors[caseItem.riskLevel]}`}>
                    {caseItem.riskLevel}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Última sesión:</span>
                  <span className="font-medium">
                    {new Date(caseItem.sessionDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Próxima sesión:</span>
                  <span className="font-medium">
                    {caseItem.nextSessionDate 
                      ? new Date(caseItem.nextSessionDate).toLocaleDateString()
                      : 'Por programar'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Notas registradas:</span>
                  <span className="font-medium">{caseItem.notes?.length || 0}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectCase?.(caseItem.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Eye size={18} />
                  Ver
                </button>
                <button
                  onClick={() => onCreateNote?.(caseItem.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={18} />
                  Nota
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
