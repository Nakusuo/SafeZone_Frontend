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
      <div className="space-y-4 rounded-2xl bg-surface-container-lowest p-6">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-surface-container-low"></div>
        <div className="h-4 w-full animate-pulse rounded-lg bg-surface-container-low"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="rounded-2xl bg-surface-container-lowest p-6 text-center text-on-surface-variant">
        Select a case to view details
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl bg-surface-container-lowest p-6">
      
      <div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {caseData.reportId}
        </p>
        <h3 className="mt-1 text-lg font-bold text-primary">
          {caseData.victimName}
        </h3>
      </div>

      
      <div className="space-y-3 border-t border-outline-variant/20 pt-6">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Contact
        </p>
        <div className="flex items-center gap-2 text-sm text-on-surface">
          <Mail className="h-4 w-4 text-on-surface-variant" />
          <a
            href={`mailto:${caseData.victimEmail}`}
            className="hover:text-primary"
          >
            {caseData.victimEmail}
          </a>
        </div>
        {caseData.location && (
          <div className="flex items-center gap-2 text-sm text-on-surface">
            <MapPin className="h-4 w-4 text-on-surface-variant" />
            <span>{caseData.location}</span>
          </div>
        )}
      </div>

      
      <div className="space-y-3 border-t border-outline-variant/20 pt-6">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Incident Details
        </p>
        <div>
          <p className="text-xs text-on-surface-variant">Type</p>
          <p className="font-semibold text-on-surface capitalize">
            {caseData.incidentType}
          </p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant">Description</p>
          <p className="mt-1 text-sm leading-relaxed text-on-surface">
            {caseData.description}
          </p>
        </div>
      </div>

      
      <div className="flex items-center gap-2 border-t border-outline-variant/20 pt-6 text-sm text-on-surface-variant">
        <Clock className="h-4 w-4" />
        <span>
          Reported:{' '}
          {new Date(caseData.submittedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      
      {caseData.assignedTo && (
        <div className="space-y-2 rounded-lg bg-surface-container p-3">
          <p className="text-xs font-bold text-secondary uppercase tracking-wider">
            Assigned to
          </p>
          {caseData.assignedTo.psychologist && (
            <p className="text-sm text-on-surface">
              📋 Psychologist: {caseData.assignedTo.psychologist}
            </p>
          )}
          {caseData.assignedTo.legalDefender && (
            <p className="text-sm text-on-surface">
              ⚖️ Defender: {caseData.assignedTo.legalDefender}
            </p>
          )}
        </div>
      )}

      
      {caseData.notes && (
        <div className="space-y-2 border-t border-outline-variant/20 pt-6">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Internal Notes
          </p>
          <p className="text-sm text-on-surface">{caseData.notes}</p>
        </div>
      )}
    </div>
  );
};
