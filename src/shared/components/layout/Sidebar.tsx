import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronRight 
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
}

const getNavigationItems = (role?: string) => {
  const dashboardPath = role === 'ADMIN'
    ? '/dashboard/admin'
    : `/dashboard/${role?.toLowerCase() || 'victim'}`

  const baseItems = [
    { label: 'Dashboard', path: dashboardPath, icon: LayoutDashboard },
  ]

  const roleSpecificItems: Record<string, any[]> = {
    VICTIM: [
      { label: 'My Reports', path: '/victim/my-reports', icon: FileText },
      { label: 'Help', path: '/victim/help', icon: HelpCircle },
      { label: 'Password', path: '/victim/password', icon: Settings },
    ],
    PSYCHOLOGIST: [
      { label: 'My Cases', path: '/psychologist/cases', icon: FileText },
      { label: 'New Session', path: '/psychologist/session-form', icon: FileText },
    ],
    DEFENDER: [
      { label: 'My Cases', path: '/defender/cases', icon: FileText },
      { label: 'Update Legal', path: '/defender/legal-update', icon: FileText },
    ],
    ADMIN: [
      { label: 'Case Triage', path: '/admin/triage', icon: FileText },
      { label: 'User Management', path: '/admin/users', icon: Users },
    ],
  }

  return [...baseItems, ...(roleSpecificItems[role as string] || [])]
}

export const Sidebar = ({ isOpen = true }: SidebarProps) => {
  const location = useLocation()
  
  
  const userData = sessionStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null
  const navigationItems = getNavigationItems(user?.role)

  return (
    <aside className={`
      fixed inset-y-0 left-0 md:relative z-50
      bg-gradient-to-b from-primary to-primary/90 text-white min-h-screen transition-all duration-300 flex flex-col shadow-warm
      overflow-y-auto overflow-x-hidden
      ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}
    `}>
      <div className="p-6 border-b border-primary/30 min-w-[16rem] md:min-w-[5rem]">
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'md:justify-center'}`}>
          <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
            Z
          </div>
          {isOpen && <span className="font-bold text-lg tracking-tight">SafeZone</span>}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 min-w-[16rem] md:min-w-[5rem]">
        <ul className="space-y-1">
          {navigationItems.map((item: any) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.path)
            const isDisabled = item.disabled

            return (
              <li key={item.path}>
                {isDisabled ? (
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 opacity-50 cursor-not-allowed`}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="text-sm font-medium flex-1">{item.label}</span>}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="text-sm font-medium flex-1">{item.label}</span>}
                    {isOpen && isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {isOpen && (
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm min-w-[16rem]">
          <div className="text-xs text-white/80 space-y-1">
            <p className="font-semibold">SafeZone</p>
            <p className="text-white/60">Comprehensive Protection</p>
          </div>
        </div>
      )}
    </aside>
  )
}
