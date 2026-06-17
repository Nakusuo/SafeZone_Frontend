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
      label: 'Psychological Summary',
      completed: !!closure.psychologistApprovedAt,
      date: closure.psychologistApprovedAt,
    },
    {
      id: 'defender',
      label: 'Legal Summary',
      completed: !!closure.defenderApprovedAt,
      date: closure.defenderApprovedAt,
    },
    {
      id: 'victim',
      label: 'Victim Confirmation',
      completed: !!closure.victimConfirmedAt,
      date: closure.victimConfirmedAt,
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6 rounded-2xl bg-surface-container-lowest p-6">
      <div>
        <h3 className="font-bold text-on-surface">Closure Progress</h3>
        <div className="mt-4 h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant">
          {completedSteps} of {steps.length} steps completed
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
                  {new Date(step.date).toLocaleDateString('en-US', {
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
            <p className="text-sm font-semibold">Closure Rejected</p>
            <p className="text-xs">The closure was rejected and requires review</p>
          </div>
        </div>
      )}
    </div>
  );
};
