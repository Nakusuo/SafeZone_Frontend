import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import type { CaseClosureSummary } from '../types';

interface VictimConfirmationFormProps {
  closure: CaseClosureSummary | null;
  isLoading?: boolean;
  onSubmit: (data: { safetyConfirmed: boolean; notes?: string }) => Promise<void>;
}

export const VictimConfirmationForm: React.FC<VictimConfirmationFormProps> = ({
  closure,
  isLoading = false,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    safetyConfirmed: closure?.safetyConfirmed || false,
    notes: closure?.victimNotes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({ safetyConfirmed: false, notes: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (closure?.victimConfirmedAt) {
    return (
      <div className="space-y-4 rounded-2xl bg-green-50 p-6 border border-green-200">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <CheckCircle2 className="h-5 w-5" />
          Safety Confirmation Completed
        </div>
        <div className="text-sm text-on-surface">
          <p className="font-semibold mb-2">Safety Status: ✅ Confirmed</p>
          {closure.victimNotes && (
            <p className="text-on-surface-variant mt-2">{closure.victimNotes}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface-container-lowest p-6">
      <h3 className="font-bold text-on-surface">Safety Confirmation</h3>

      <div className="rounded-lg bg-secondary/10 p-4 border border-secondary/20">
        <p className="text-sm text-on-surface">
          The professionals have completed their review. Do you confirm that you feel safe and wish to close this case?
        </p>
      </div>

      
      {closure?.psychologistSummary && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase">
            📋 Psychological Summary
          </p>
          <p className="text-sm bg-surface rounded-lg p-3 text-on-surface">
            {closure.psychologistSummary}
          </p>
        </div>
      )}

      
      {closure?.legalSummary && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase">
            ⚖️ Legal Summary
          </p>
          <p className="text-sm bg-surface rounded-lg p-3 text-on-surface">
            {closure.legalSummary}
          </p>
        </div>
      )}

      
      <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-3">
        <input
          type="checkbox"
          id="safetyConfirmed"
          checked={formData.safetyConfirmed}
          onChange={(e) =>
            setFormData({ ...formData, safetyConfirmed: e.target.checked })
          }
          className="mt-1 h-4 w-4 cursor-pointer"
          required
        />
        <label htmlFor="safetyConfirmed" className="text-sm text-on-surface cursor-pointer">
          <p className="font-semibold">I confirm that I feel safe</p>
          <p className="text-on-surface-variant">
            I have reviewed the case and authorize its closure.
          </p>
        </label>
      </div>

      
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Additional Comments (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Share any comments or additional concerns..."
          className="w-full rounded-lg border border-outline bg-surface p-3 text-on-surface placeholder-on-surface-variant"
          rows={3}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.safetyConfirmed}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {isLoading ? 'Confirming...' : 'Confirm and Close Case'}
      </button>
    </form>
  );
};
