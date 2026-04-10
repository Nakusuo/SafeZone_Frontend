import React, { useEffect, useState } from 'react';
import { Card, DataTable, Button } from '@/shared/components';
import { Report } from '../types';
import { reportService } from '../services';
import { Eye, Trash2, Plus } from 'lucide-react';

interface DashboardVictimProps {
  onCreateNew?: () => void;
  onViewReport?: (reportId: string) => void;
}

/**
 * Dashboard para víctimas
 * Resumen de denuncias y estado de casos
 */
export const DashboardVictima: React.FC<DashboardVictimProps> = ({
  onCreateNew,
  onViewReport
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportService.getMyReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar denuncias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar esta denuncia?')) {
      try {
        await reportService.deleteReport(id);
        setReports(reports.filter(r => r.id !== id));
      } catch (err) {
        alert('Error al eliminar la denuncia');
      }
    }
  };

  const statusColors: Record<Report['status'], string> = {
    'draft': 'bg-gray-100 text-gray-800',
    'submitted': 'bg-blue-100 text-blue-800',
    'under-review': 'bg-yellow-100 text-yellow-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-red-100 text-red-800'
  };

  const severityColors: Record<Report['severity'], string> = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mis Denuncias</h2>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus size={20} />
            Nueva Denuncia
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando denuncias...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tienes denuncias. Crea una nueva.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Título</th>
                  <th className="text-left py-3 px-4 font-semibold">Categoría</th>
                  <th className="text-left py-3 px-4 font-semibold">Severidad</th>
                  <th className="text-left py-3 px-4 font-semibold">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{report.title}</td>
                    <td className="py-3 px-4 text-sm capitalize">{report.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${severityColors[report.severity]}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewReport?.(report.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
