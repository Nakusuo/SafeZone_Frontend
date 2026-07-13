import React, { useState, useEffect } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import {
  TriageTable,
  AssignmentModal,
  CaseDetailSidebar,
} from '../components/index';
import { triageService, adminProfessionalService } from '../services/triageService';
import type { TriageCase, TriageAssignment } from '@/shared/types';

export const TriageView: React.FC = () => {
  const [cases, setCases] = useState<TriageCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(
    undefined,
  );
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [psychologistsList, setPsychologistsList] = useState<any[]>([]);
  const [defendersList, setDefendersList] = useState<any[]>([]);
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const loadCases = async () => {
      try {
        setIsLoadingCases(true);
        setError(null);
        const data = await triageService.getPendingCases();
        setCases(data);
        if (data.length > 0) {
          setSelectedCaseId(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar casos");
      } finally {
        setIsLoadingCases(false);
      }
    };

    loadCases();
  }, []);
  useEffect(() => {
  // 1. Si no está abierto, salimos
  if (!isModalOpen) return;
  
  // 2. Si ya tenemos datos, NO volvemos a cargar (evita el parpadeo)
  if (psychologistsList.length > 0 || defendersList.length > 0) return;

  const loadProfessionals = async () => {
    try {
      setIsLoadingProfessionals(true);
      
      const [psychList, defList] = await Promise.all([
        adminProfessionalService.getAvailablePsychologists(),
        adminProfessionalService.getAvailableDefenders(),
      ]);
      
      setPsychologistsList(psychList || []);
      setDefendersList(defList || []);
      
    } catch (err) {
      console.error('Error al cargar profesionales:', err);
    } finally {
      setIsLoadingProfessionals(false);
    }
  };

  loadProfessionals();
}, [isModalOpen]);
  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  const handleAssignCase = async (assignment: TriageAssignment) => {
    if (!selectedCaseId) return;
    setIsAssigning(true);
    try {
      const updatedCase = await triageService.assignCase(assignment);
      const assignedFromApi = updatedCase.assignedTo || {
        psychologist:
          (updatedCase as any).psychologist ||
          (updatedCase as any).psychologistName ||
          (updatedCase as any).psicologoNombre,
        legalDefender:
          (updatedCase as any).legalDefender ||
          (updatedCase as any).defenderLegal ||
          (updatedCase as any).defenderName ||
          (updatedCase as any).defensorNombre,
      };
      const psychologistName =
        assignedFromApi.psychologist ||
        psychologistsList.find((p) => p.id === assignment.psychologistId)?.name;
      const defenderName =
        assignedFromApi.legalDefender ||
        defendersList.find((d) => d.id === assignment.defenderLegalId)?.name;

      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === selectedCaseId
            ? {
                ...c,
                status: "assigned",
                assignedTo: {
                  psychologist: psychologistName,
                  legalDefender: defenderName,
                },
              }
            : c,
        ),
      );
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar caso');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Centro de Triaje y Asignación
        </h1>
        <p className="mt-2 text-slate-500 font-medium">
          Casos pendientes de revisión y asignación
        </p>
      </div>

      
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-error/10 p-4 text-error">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-surface-container-lowest p-4">
            {isLoadingCases ? (
              <div className="flex items-center justify-center gap-2 py-12 text-on-surface-variant">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Cargando casos...</span>
              </div>
            ) : cases.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <AlertTriangle className="h-8 w-8 text-on-surface-variant" />
                <p className="text-on-surface-variant">
                  No hay casos pendientes
                </p>
              </div>
            ) : (
              <TriageTable
                cases={cases}
                selectedCaseId={selectedCaseId}
                onSelectCase={handleSelectCase}
                onOpenAssign={(caseId) => {
                  handleSelectCase(caseId)
                  setIsModalOpen(true)
                }}
                isLoading={false}
              />
            )}
          </div>
        </div>

        
        <div className="flex flex-col gap-4">
          <CaseDetailSidebar
            caseData={selectedCase ?? null}
            isLoading={isLoadingDetail}
          />

          {/* Action Button */}
          {selectedCase && selectedCase.status === "new" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary hover:bg-primary/90 transition-colors"
            >
              Asignar Caso
            </button>
          )}
          {selectedCase && selectedCase.status !== "new" && (
            <button className="rounded-lg bg-surface-container px-4 py-3 font-semibold text-on-surface-variant cursor-not-allowed opacity-50">
              Caso Asignado
            </button>
          )}
        </div>
      </div>

     {selectedCase && isModalOpen && (
     <AssignmentModal
  isOpen={isModalOpen}
  caseId={selectedCase.id}
  currentPriority={selectedCase.priority}
  psychologists={psychologistsList} 
  defenders={defendersList}         
  onAssign={handleAssignCase}
  onCancel={() => setIsModalOpen(false)}
  isLoading={isLoadingProfessionals || isAssigning}
/>
)}
    </div>
  );
};