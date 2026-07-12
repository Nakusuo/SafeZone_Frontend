import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, ClipboardList, AlertTriangle, CheckCircle2,
  ArrowRight, TrendingUp, Shield, Clock,
} from 'lucide-react'
import { useAuth } from '@/core/auth/AuthContext'
import { triageService } from '../services/triageService'
import { TriageMetrics } from '@/shared/types'
import { EmergencyAlertsPanel } from '@/features/shared-features/emergency/EmergencyAlertsPanel'






const QUICK_ACTIONS = [
  {
    label: 'Case Triage',
    description: 'Review and assign pending reports',
    path: '/admin/triage',
    icon: ClipboardList,
    color: 'bg-rose-500',
  },
  {
    label: 'User Management',
    description: 'Manage administrators and managers',
    path: '/admin/users',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    label: 'Critical Cases',
    description: 'Unattended high-priority cases',
    path: '/admin/triage?filter=critical',
    icon: AlertTriangle,
    color: 'bg-amber-500',
  },
  {
    label: 'Resolved Cases',
    description: 'History of closed cases',
    path: '/admin/triage?filter=closed',
    icon: CheckCircle2,
    color: 'bg-emerald-500',
  },
]

export const AdminDashboard = () => {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<TriageMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    triageService.getMetrics()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Administration Panel
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome, <span className="font-medium text-gray-700">{user?.name}</span>. Here is the system summary.
        </p>
      </div>

      
      <EmergencyAlertsPanel />

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Pending Cases"
          value={loading ? '—' : String(metrics?.totalPending ?? 0)}
          icon={Clock}
          color="text-amber-600 bg-amber-50"
          loading={loading}
        />
        <MetricCard
          label="Assigned Cases"
          value={loading ? '—' : String(metrics?.totalAssigned ?? 0)}
          icon={TrendingUp}
          color="text-blue-600 bg-blue-50"
          loading={loading}
        />
        <MetricCard
          label="Critical Cases"
          value={loading ? '—' : String(metrics?.criticalCases ?? 0)}
          icon={AlertTriangle}
          color="text-rose-600 bg-rose-50"
          loading={loading}
        />
        <MetricCard
          label="Total in System"
          value={loading ? '—' : String((metrics?.totalPending ?? 0) + (metrics?.totalAssigned ?? 0))}
          icon={Shield}
          color="text-emerald-600 bg-emerald-50"
          loading={loading}
        />
      </div>

      
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.path}
                to={action.path}
                className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 group"
              >
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {action.label}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      </div>

      
      {metrics && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cases by Type</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="space-y-3">
              {Object.entries(metrics.casesByType).map(([type, count]) => (
                <CaseTypeBar key={type} type={type} count={count} total={metrics.totalPending + metrics.totalAssigned} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



interface MetricCardProps {
  label: string
  value: string
  icon: React.ElementType
  color: string
  loading?: boolean
}

const MetricCard = ({ label, value, icon: Icon, color, loading }: MetricCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold text-gray-900 ${loading ? 'animate-pulse' : ''}`}>{value}</p>
    </div>
  </div>
)

const TYPE_LABELS: Record<string, string> = {
  physical: 'Physical Violence',
  psychological: 'Psychological Abuse',
  sexual: 'Sexual Violence',
  legal: 'Legal Conflict',
  other: 'Others',
}

const TYPE_COLORS: Record<string, string> = {
  physical: 'bg-rose-500',
  psychological: 'bg-purple-500',
  sexual: 'bg-orange-500',
  legal: 'bg-blue-500',
  other: 'bg-gray-400',
}

const CaseTypeBar = ({ type, count, total }: { type: string; count: number; total: number }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-40 flex-shrink-0">{TYPE_LABELS[type] ?? type}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className={`${TYPE_COLORS[type] ?? 'bg-gray-400'} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
    </div>
  )
}
