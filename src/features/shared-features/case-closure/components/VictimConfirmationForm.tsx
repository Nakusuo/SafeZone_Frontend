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
          Confirmación de Seguridad Completada
        </div>
        <div className="text-sm text-on-surface">
          <p className="font-semibold mb-2">Estado de Seguridad: ✅ Confirmado</p>
          {closure.victimNotes && (
            <p className="text-on-surface-variant mt-2">{closure.victimNotes}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface-container-lowest p-6">
      <h3 className="font-bold text-on-surface">Confirmación de Seguridad</h3>

      <div className="rounded-lg bg-secondary/10 p-4 border border-secondary/20">
        <p className="text-sm text-on-surface">
          Los profesionales han completado su revisión. ¿Confirmas que te sientes segura(o) y que deseas cerrar este caso?
        </p>
      </div>

      {/* Psychologist Summary */}
      {closure?.psychologistSummary && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase">
            📋 Resumen Psicológico
          </p>
          <p className="text-sm bg-surface rounded-lg p-3 text-on-surface">
            {closure.psychologistSummary}
          </p>
        </div>
      )}

      {/* Defender Summary */}
      {closure?.legalSummary && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase">
            ⚖️ Resumen Legal
          </p>
          <p className="text-sm bg-surface rounded-lg p-3 text-on-surface">
            {closure.legalSummary}
          </p>
        </div>
      )}

      {/* Safety Confirmation Checkbox */}
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
          <p className="font-semibold">Confirmo que me siento segura(o)</p>
          <p className="text-on-surface-variant">
            He revisado el caso y autorizo su cierre.
          </p>
        </label>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Comentarios Adicionales (Opcional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Comparte cualquier comentario o preocupación adicional..."
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
        {isLoading ? 'Confirmando...' : 'Confirmar y Cerrar Caso'}
      </button>
    </form>
  );
};
