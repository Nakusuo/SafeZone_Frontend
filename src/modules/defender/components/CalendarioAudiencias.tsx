import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/shared/components';
import { CaseHearing } from '../types';
import { hearingService } from '../services';
import { Calendar, Clock, MapPin, AlertCircle, Plus } from 'lucide-react';

interface CalendarioAudienciasProps {
  defenderId?: string;
  onCreateHearing?: () => void;
}

/**
 * Calendario de Audiencias
 * Gestiona y visualiza las fechas de audiencias programadas
 */
export const CalendarioAudiencias: React.FC<CalendarioAudienciasProps> = ({
  defenderId,
  onCreateHearing
}) => {
  const [hearings, setHearings] = useState<CaseHearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | string>('all');

  useEffect(() => {
    fetchHearings();
  }, [defenderId]);

  const fetchHearings = async () => {
    try {
      const data = await hearingService.getSchedule(defenderId);
      setHearings(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar audiencias');
    } finally {
      setLoading(false);
    }
  };

  const filteredHearings = filterType === 'all' 
    ? hearings 
    : hearings.filter(h => h.type === filterType);

  const upcomingHearings = filteredHearings.filter(h => new Date(h.date) > new Date());
  const pastHearings = filteredHearings.filter(h => new Date(h.date) <= new Date());

  const typeColors: Record<string, string> = {
    'initial': 'bg-blue-100 text-blue-800',
    'preliminary': 'bg-yellow-100 text-yellow-800',
    'trial': 'bg-orange-100 text-orange-800',
    'appeal': 'bg-purple-100 text-purple-800',
    'other': 'bg-gray-100 text-gray-800'
  };

  const HearingCard: React.FC<{ hearing: CaseHearing; isPast?: boolean }> = ({ hearing, isPast }) => (
    <div className={`p-4 border rounded-lg ${isPast ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200 hover:shadow-md'} transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800">Caso #{hearing.caseId.slice(0, 8)}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[hearing.type]}`}>
          {hearing.type}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-blue-600" />
          <span>{new Date(hearing.date).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={16} className="text-green-600" />
          <span>{hearing.time || 'Hora pendiente'}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={16} className="text-red-600" />
          <span>{hearing.location || 'Ubicación pendiente'}</span>
        </div>

        {hearing.judge && (
          <div className="text-gray-600">
            <strong>Juez:</strong> {hearing.judge}
          </div>
        )}

        {hearing.court && (
          <div className="text-gray-600">
            <strong>Juzgado:</strong> {hearing.court}
          </div>
        )}

        {hearing.notes && (
          <div className="text-gray-600 mt-2 p-2 bg-gray-100 rounded italic">
            {hearing.notes}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calendario de Audiencias</h2>
        <Button onClick={onCreateHearing} className="flex items-center gap-2">
          <Plus size={20} />
          Nueva Audiencia
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2 mb-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando audiencias...</div>
      ) : (
        <>
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Todas
            </button>
            {['initial', 'preliminary', 'trial', 'appeal'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {filteredHearings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay audiencias para mostrar
            </div>
          ) : (
            <>
              {/* Próximas Audiencias */}
              {upcomingHearings.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    📅 Próximas Audiencias ({upcomingHearings.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingHearings.map(hearing => (
                      <HearingCard key={hearing.id} hearing={hearing} />
                    ))}
                  </div>
                </div>
              )}

              {/* Audiencias Pasadas */}
              {pastHearings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    ✓ Audiencias Completadas ({pastHearings.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastHearings.map(hearing => (
                      <HearingCard key={hearing.id} hearing={hearing} isPast />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
};
