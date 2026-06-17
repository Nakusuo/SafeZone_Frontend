import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar?: () => void
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate()
  const userData = sessionStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="bg-white border-b-2 border-gray-100 shadow-soft">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-50 rounded-lg transition-all hover:scale-105"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-primary tracking-tight">SafeZone</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right border-r border-gray-200 pr-4">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize font-medium">{user.role.toLowerCase()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-accent rounded-md transition-all"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
