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
        setError(err instanceof Error ? err.message : 'Error al cargar cierre');
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
      setError(err instanceof Error ? err.message : 'Error al enviar resumen');
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
      setError(err instanceof Error ? err.message : 'Error al confirmar');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-on-surface-variant">
        <Loader className="h-5 w-5 animate-spin" />
        <span>Cargando información del cierre...</span>
      </div>
    );
  }

  if (!closure) {
    return (
      <div className="rounded-2xl bg-error/10 p-6 text-error">
        <p>No se encontró información de cierre para este caso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-surface-container-highest p-6">
        <h1 className="text-2xl font-bold text-on-surface">
          Cierre de Caso: {closure.victimName}
        </h1>
        <p className="mt-2 text-on-surface-variant">
          ID del Caso: {caseId} | Estado: {closure.status}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-error/10 p-4 text-error">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <ClosureProgress closure={closure} />
        </div>

        {/* Forms Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Psychologist Form */}
          <PsychologistSummaryForm
            closure={closure}
            onSubmit={handlePsychologistSubmit}
          />

          {/* Victim Confirmation - Show only after psychologist approval */}
          {closure.psychologistApprovedAt && (
            <VictimConfirmationForm
              closure={closure}
              onSubmit={handleVictimConfirm}
            />
          )}
        </div>
      </div>

      {/* Case Completed State */}
      {closure.closedAt && (
        <div className="rounded-2xl bg-green-50 border-2 border-green-200 p-6 text-center">
          <p className="text-2xl mb-2">✅</p>
          <h2 className="font-bold text-green-900">Caso Cerrado Exitosamente</h2>
          <p className="mt-2 text-green-800">
            El caso se cerró el{' '}
            {new Date(closure.closedAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}
    </div>
  );
};
