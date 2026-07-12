import React, { useState, useEffect } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import {
  TriageTable,
  AssignmentModal,
  CaseDetailSidebar,
} from "../components/index";
import {
  adminProfessionalService,
  triageService,
} from "../services/triageService";
import type { TriageCase, TriageAssignment } from "@/shared/types";

export const TriageView: React.FC = () => {
  const [cases, setCases] = useState<TriageCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(
    undefined,
  );
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [psychologists, setPsychologists] = useState<any[]>([]);
  const [defenders, setDefenders] = useState<any[]>([]);

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
    if (!isModalOpen) return;

    const loadProfessionals = async () => {
      try {
        // Llamamos al servicio real
        const [psychList, defList] = await Promise.all([
          adminProfessionalService.getAvailablePsychologists(),
          adminProfessionalService.getAvailableDefenders(),
        ]);

        // AGREGA ESTO PARA DEPURAR
        console.log(">>> Datos de psicólogos:", psychList);
        console.log(">>> Datos de defensores:", defList);

        setPsychologists(psychList);
        setDefenders(defList);
      } catch (err) {
        console.error("Error cargando profesionales:", err);
        setError("No se pudieron cargar los especialistas.");
      }
    };

    loadProfessionals();
  }, [isModalOpen]);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  const handleAssignCase = async (assignment: TriageAssignment) => {
    if (!selectedCaseId) return;
    try {
      await triageService.assignCase(assignment);
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === selectedCaseId
            ? {
                ...c,
                status: "assigned",
                assignedTo: {
                  psychologist: psychologists.find(
                    (p) => p.id === assignment.psychologistId,
                  )?.name,
                  legalDefender: defenders.find(
                    (d) => d.id === assignment.defenderLegalId,
                  )?.name,
                },
              }
            : c,
        ),
      );
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar caso");
    }
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  return (
    <div className="space-y-4">
      
      <div className="rounded-2xl bg-surface-container-highest p-6">
        <h1 className="text-2xl font-bold text-on-surface">
          Triage and Assignment Center
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Cases pending review and assignment
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
                <span>Loading cases...</span>
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
              Assign Case
            </button>
          )}
          {selectedCase && selectedCase.status !== "new" && (
            <button className="rounded-lg bg-surface-container px-4 py-3 font-semibold text-on-surface-variant cursor-not-allowed opacity-50">
              Already Assigned
            </button>
          )}
        </div>
      </div>

      
      {selectedCase && (
        <AssignmentModal
          isOpen={isModalOpen}
          caseId={selectedCase.id}
          currentPriority={selectedCase.priority}
          psychologists={psychologists}
          defenders={defenders}
          onAssign={handleAssignCase}
          onCancel={() => setIsModalOpen(false)}
          isLoading={false}
        />
      )}
    </div>
  );
};
