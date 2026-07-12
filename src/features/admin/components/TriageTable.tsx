import React from 'react';
import { AlertTriangle, Clock, MapPin, Mail, Phone } from 'lucide-react';
import type { TriageCase, CasePriority } from '../types';

interface TriageTableProps {
  cases: TriageCase[];
  onSelectCase: (caseId: string) => void;
  onOpenAssign?: (caseId: string) => void;
  selectedCaseId?: string;
  isLoading?: boolean;
}

const priorityColors: Record<CasePriority, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  closed: 'Closed',
};

export const TriageTable: React.FC<TriageTableProps> = ({
  cases,
  onSelectCase,
  onOpenAssign,
  selectedCaseId,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center text-slate-500">
        Cargando casos...
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-slate-400" />
        <p className="text-slate-500">No hay casos pendientes</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-left font-semibold text-slate-900">
              ID
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">
              Víctima
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">
              Tipo
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">
              Prioridad
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">
              Estado
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">
              Hace
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => {
            const timeAgo = new Date(caseItem.submittedAt);
            const minutes = Math.floor(
              (Date.now() - timeAgo.getTime()) / (1000 * 60)
            );
            const timeDisplay =
              minutes < 60
                ? `${minutes}m`
                : `${Math.floor(minutes / 60)}h`;

            return (
              <tr
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem.id)}
                className={`border-b border-slate-200/30 cursor-pointer transition-colors ${
                  selectedCaseId === caseItem.id
                    ? 'bg-blue-50'
                    : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-900">
                  {caseItem.reportId}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {caseItem.victimName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {caseItem.victimEmail}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold capitalize">
                    {caseItem.incidentType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      priorityColors[caseItem.priority]
                    }`}
                  >
                    {caseItem.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-slate-700">
                    {statusLabels[caseItem.status]}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {timeDisplay}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenAssign?.(caseItem.id);
                    }}
                    className="rounded px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    Asignar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};