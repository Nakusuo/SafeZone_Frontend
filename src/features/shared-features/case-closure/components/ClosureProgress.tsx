import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { CaseClosureSummary } from '../types';

interface ClosureProgressProps {
  closure: CaseClosureSummary;
}

export const ClosureProgress: React.FC<ClosureProgressProps> = ({
  closure,
}) => {
  const steps = [
    {
      id: 'psychologist',
      label: 'Resumen Psicológico',
      completed: !!closure.psychologistApprovedAt,
      date: closure.psychologistApprovedAt,
    },
    {
      id: 'defender',
      label: 'Resumen Legal',
      completed: !!closure.defenderApprovedAt,
      date: closure.defenderApprovedAt,
    },
    {
      id: 'victim',
      label: 'Confirmación de Víctima',
      completed: !!closure.victimConfirmedAt,
      date: closure.victimConfirmedAt,
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6 rounded-2xl bg-surface-container-lowest p-6">
      <div>
        <h3 className="font-bold text-on-surface">Progreso del Cierre</h3>
        <div className="mt-4 h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant">
          {completedSteps} de {steps.length} pasos completados
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-1 ${
                  step.completed
                    ? 'bg-green-100'
                    : 'bg-surface-container'
                }`}
              >
                <CheckCircle
                  className={`h-5 w-5 ${
                    step.completed
                      ? 'text-green-700'
                      : 'text-on-surface-variant'
                  }`}
                />
              </div>
              {index < steps.length - 1 && (
                <div className="my-1 h-4 w-1 bg-outline-variant/20"></div>
              )}
            </div>
            <div className="flex-1 py-1">
              <p className="font-semibold text-on-surface">{step.label}</p>
              {step.date && (
                <p className="text-xs text-on-surface-variant">
                  {new Date(step.date).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {closure.status === 'rejected' && (
        <div className="flex gap-2 rounded-lg bg-error/10 p-3 text-error">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Cierre Rechazado</p>
            <p className="text-xs">El cierre fue rechazado y necesita revisión</p>
          </div>
        </div>
      )}
    </div>
  );
};
