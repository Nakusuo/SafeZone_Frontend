// Tipos del módulo Admin — re-exportados desde la fuente única de verdad.
// Esto evita duplicación y garantiza consistencia con el backend Spring.
export type {
  CaseStatus,
  CasePriority,
  CaseType,
  TriageCase,
  TriageAssignment,
  TriageMetrics,
  AdminUser,
  AssignmentHistory,
} from '@/shared/types'
