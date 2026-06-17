import React from 'react';
import { AlertTriangle, Clock, MapPin, Mail, Phone } from 'lucide-react';
import type { TriageCase, CasePriority } from '../types';

interface TriageTableProps {
  cases: TriageCase[];
  onSelectCase: (caseId: string) => void;
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
  selectedCaseId,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center text-on-surface-variant">
        Loading cases...
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-on-surface-variant" />
        <p className="text-on-surface-variant">No pending cases</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant">
            <th className="px-4 py-3 text-left font-semibold text-on-surface">
              ID
            </th>
            <th className="px-4 py-3 text-left font-semibold text-on-surface">
              Victim
            </th>
            <th className="px-4 py-3 text-left font-semibold text-on-surface">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-on-surface">
              Priority
            </th>
            <th className="px-4 py-3 text-left font-semibold text-on-surface">
              Status
            </th>
            <th className="px-4 py-3 text-left font-semibold text-on-surface">
              Ago
            </th>
            <th className="px-4 py-3 text-left font-semibold text-on-surface">
              Actions
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
                className={`border-b border-outline-variant/30 cursor-pointer transition-colors ${
                  selectedCaseId === caseItem.id
                    ? 'bg-primary-fixed/20'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-primary">
                  {caseItem.reportId}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-on-surface">
                      {caseItem.victimName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
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
                  <span className="text-xs font-medium text-on-surface">
                    {statusLabels[caseItem.status]}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-1 text-xs text-on-surface-variant">
                  <Clock className="h-3 w-3" />
                  {timeDisplay}
                </td>
                <td className="px-4 py-3">
                  <button className="rounded px-3 py-1 text-xs font-semibold text-primary hover:bg-primary-fixed transition-colors">
                    Assign
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
