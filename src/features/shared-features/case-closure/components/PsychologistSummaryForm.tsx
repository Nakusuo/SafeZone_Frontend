import React, { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import type { CaseClosureSummary } from '../types';

interface PsychologistSummaryFormProps {
  closure: CaseClosureSummary | null;
  isLoading?: boolean;
  onSubmit: (data: {
    summary: string;
    sessionCount: number;
    clinicalOutcome: 'improved' | 'stable' | 'declined';
    recommendations: string;
  }) => Promise<void>;
}

export const PsychologistSummaryForm: React.FC<PsychologistSummaryFormProps> = ({
  closure,
  isLoading = false,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    summary: closure?.psychologistSummary || '',
    sessionCount: closure?.sessionCount || 0,
    clinicalOutcome: closure?.clinicalOutcome || 'stable' as const,
    recommendations: closure?.recommendations || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        summary: '',
        sessionCount: 0,
        clinicalOutcome: 'stable',
        recommendations: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (closure?.psychologistApprovedAt) {
    return (
      <div className="space-y-4 rounded-2xl bg-primary/10 p-6 border border-primary/20">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <span>✓</span> Psychological Summary Approved
        </div>
        <div className="text-sm text-on-surface">
          <p className="font-semibold mb-2">Summary:</p>
          <p className="text-on-surface-variant">{closure.psychologistSummary}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface-container-lowest p-6">
      <h3 className="font-bold text-on-surface">Psychological Summary</h3>

      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Clinical Summary
        </label>
        <textarea
          value={formData.summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          placeholder="Describe the progress, sessions conducted, emotional improvements..."
          className="w-full rounded-lg border border-outline bg-surface p-3 text-on-surface placeholder-on-surface-variant"
          rows={5}
          required
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Number of Sessions
        </label>
        <input
          type="number"
          value={formData.sessionCount}
          onChange={(e) =>
            setFormData({ ...formData, sessionCount: parseInt(e.target.value) })
          }
          min="0"
          className="w-full rounded-lg border border-outline bg-surface p-3 text-on-surface"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Clinical Outcome
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['improved', 'stable', 'declined'].map((outcome) => (
            <button
              key={outcome}
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  clinicalOutcome: outcome as 'improved' | 'stable' | 'declined',
                })
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                formData.clinicalOutcome === outcome
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {outcome === 'improved'
                ? '📈 Improved'
                : outcome === 'stable'
                  ? '➡️ Stable'
                  : '📉 Declined'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Recommendations
        </label>
        <textarea
          value={formData.recommendations}
          onChange={(e) =>
            setFormData({ ...formData, recommendations: e.target.value })
          }
          placeholder="Recommendations for future follow-up..."
          className="w-full rounded-lg border border-outline bg-surface p-3 text-on-surface placeholder-on-surface-variant"
          rows={3}
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {isLoading ? 'Loading...' : 'Submit Summary'}
      </button>
    </form>
  );
};
