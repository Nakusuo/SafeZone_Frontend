import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, Loader } from 'lucide-react';
import {
  ClosureProgress,
  PsychologistSummaryForm,
  VictimConfirmationForm,
} from '../components';
import { caseClosureService } from '../services';
import type { CaseClosureSummary } from '../types';

export const CaseClosureView: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [closure, setClosure] = useState<CaseClosureSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    const loadClosure = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await caseClosureService.getClosureSummary(caseId);
        setClosure(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading closure');
      } finally {
        setIsLoading(false);
      }
    };

    loadClosure();
  }, [caseId]);

  const handlePsychologistSubmit = async (data: any) => {
    if (!caseId) return;
    try {
      const updated = await caseClosureService.submitPsychologistSummary(
        caseId,
        data
      );
      setClosure(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending summary');
    }
  };

  const handleVictimConfirm = async (data: any) => {
    if (!caseId) return;
    try {
      const updated = await caseClosureService.confirmVictimApproval(
        caseId,
        data
      );
      setClosure(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error confirming');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-on-surface-variant">
        <Loader className="h-5 w-5 animate-spin" />
        <span>Loading closure information...</span>
      </div>
    );
  }

  if (!closure) {
    return (
      <div className="rounded-2xl bg-error/10 p-6 text-error">
        <p>No closure information was found for this case.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="rounded-2xl bg-surface-container-highest p-6">
        <h1 className="text-2xl font-bold text-on-surface">
          Case Closure: {closure.victimName}
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Case ID: {caseId} | Status: {closure.status}
        </p>
      </div>

      
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-error/10 p-4 text-error">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        <div className="lg:col-span-1">
          <ClosureProgress closure={closure} />
        </div>

        
        <div className="space-y-6 lg:col-span-2">
          
          <PsychologistSummaryForm
            closure={closure}
            onSubmit={handlePsychologistSubmit}
          />

          
          {closure.psychologistApprovedAt && (
            <VictimConfirmationForm
              closure={closure}
              onSubmit={handleVictimConfirm}
            />
          )}
        </div>
      </div>

      
      {closure.closedAt && (
        <div className="rounded-2xl bg-green-50 border-2 border-green-200 p-6 text-center">
          <p className="text-2xl mb-2">✅</p>
          <h2 className="font-bold text-green-900">Case Successfully Closed</h2>
          <p className="mt-2 text-green-800">
            The case was closed on{' '}
            {new Date(closure.closedAt).toLocaleDateString('en-US')}
          </p>
        </div>
      )}
    </div>
  );
};
