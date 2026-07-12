import React from 'react';
import { MapPin, Mail, Phone, FileText, Clock } from 'lucide-react';
import type { TriageCase } from '../types';

interface CaseDetailSidebarProps {
  caseData: TriageCase | null;
  isLoading?: boolean;
}

export const CaseDetailSidebar: React.FC<CaseDetailSidebarProps> = ({
  caseData,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 rounded-2xl bg-white p-6">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-slate-500">
        Selecciona un caso para ver detalles
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {caseData.reportId}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">
          {caseData.victimName}
        </h3>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Contacto
        </p>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <a
            href={`mailto:${caseData.victimEmail}`}
            className="hover:text-primary transition-colors"
          >
            {caseData.victimEmail || 'Sin correo'}
          </a>
        </div>
        {caseData.location && (
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span>{caseData.location}</span>
          </div>
        )}
      </div>

      {/* Case Details */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Detalles del Incidente
        </p>
        <div>
          <p className="text-xs text-slate-500">Tipo</p>
          <p className="font-semibold text-slate-900 capitalize">
            {caseData.incidentType}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Descripción</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            {caseData.description}
          </p>
        </div>
      </div>

      {/* Timing */}
      <div className="flex items-center gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <span>
          Reportado:{' '}
          {new Date(caseData.submittedAt).toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Current Assignment */}
      {caseData.assignedTo && (
        <div className="space-y-2 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Asignado a
          </p>
          {caseData.assignedTo.psychologist && (
            <p className="text-sm text-slate-700">
              📋 Psicólogo: {caseData.assignedTo.psychologist}
            </p>
          )}
          {caseData.assignedTo.legalDefender && (
            <p className="text-sm text-slate-700">
              ⚖️ Defensor: {caseData.assignedTo.legalDefender}
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      {caseData.notes && (
        <div className="space-y-2 border-t border-slate-200 pt-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Notas Internas
          </p>
          <p className="text-sm text-slate-700">{caseData.notes}</p>
        </div>
      )}
    </div>
  );
};
