import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { TriageAssignment, CasePriority } from '../types';

interface AssignmentModalProps {
  isOpen: boolean;
  caseId: string;
  currentPriority: CasePriority;
  psychologists: Array<{ id: string; name: string; caseCount: number }>;
  defenders: Array<{ id: string; name: string; caseCount: number }>;
  onAssign: (assignment: TriageAssignment) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  caseId,
  currentPriority,
  psychologists,
  defenders,
  onAssign,
  onCancel,
  isLoading,
}) => {
  const [selectedPsychologist, setSelectedPsychologist] = useState<
    string | undefined
  >();
  const [selectedDefender, setSelectedDefender] = useState<string | undefined>();
  const [priority, setPriority] = useState<CasePriority>(currentPriority);

  const handleConfirm = async () => {
    if (!selectedPsychologist && !selectedDefender) {
      alert('Selecciona al menos un profesional');
      return;
    }
    // 1. Definimos el payload correctamente
  const payload = {
    caseId,
    psychologistId: selectedPsychologist,
    defenderLegalId: selectedDefender,
    assignedAt: new Date().toISOString(),
    assignedBy: 'current-user-id',
    priority,
  } satisfies TriageAssignment;

  // 2. Verificamos en consola
  console.log("Enviando al servidor:", payload);

  // 3. Llamamos a la función UNA SOLA VEZ
  try {
    await onAssign(payload);
    onCancel();
  } catch (error) {
    console.error("Error al asignar:", error);
    alert("Hubo un error al intentar asignar el caso.");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div 
      className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg"
      onClick={(e) => e.stopPropagation()} 
       >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Asignar Caso</h2>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Priority Assignment */}
        <div className="mb-6 space-y-3">
          <label className="block text-sm font-semibold text-on-surface">
            Prioridad
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['critical', 'high', 'medium', 'low'] as CasePriority[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    priority === p
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
   {/* Psychologist Selection */}
        <select
  value={selectedPsychologist || ''}
  onChange={(e) => setSelectedPsychologist(e.target.value || undefined)}
  style={{ color: '#000000', opacity: 1 }} // 🚨 FUERZA EL COLOR NEGRO
  className="w-full rounded-lg border-none bg-surface-container-low px-3 py-2 focus:ring-2 focus:ring-primary"
  >
  <option value="" className="text-gray-500">-- Sin asignar --</option>
  {(psychologists || []).map((p) => (
    <option key={p.id} value={p.id} style={{ color: '#000000' }}>
      {p.name} ({p.caseCount} casos)
    </option>
  ))}
   </select>
 {/* Defender Selection */}
  <div className="mb-6 space-y-3">
  <label className="block text-sm font-semibold text-on-surface">
    Defensor Legal
  </label>
  <select
    value={selectedDefender || ''}
    onChange={(e) => setSelectedDefender(e.target.value || undefined)}
    disabled={isLoading || !defenders?.length}
    className="w-full rounded-lg border-none bg-surface-container-low px-3 py-2 text-on-surface focus:ring-2 focus:ring-primary disabled:opacity-50"
  >
    <option value="">{isLoading ? 'Cargando...' : '-- Sin asignar --'}</option>
    {(defenders || []).map((d) => (
      <option key={d.id} value={d.id}>
        {d.name} ({d.caseCount} casos)
      </option>
    ))}
  </select>
</div>

        {/* Warning */}
        {priority === 'critical' && (
          <div className="mb-6 flex gap-3 rounded-lg bg-red-100/50 p-3 text-sm text-red-700">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p>Este es un caso crítico. Se notificará inmediatamente.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-outline-variant px-4 py-2 font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || (!selectedPsychologist && !selectedDefender)}
            className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
          >
            {isLoading ? 'Asignando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
