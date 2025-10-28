'use client'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  BookOpen, 
  Settings, 
  LogOut, 
  User
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to log out')
    }
  }

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Goals', id: 'goals', icon: Target },
    { name: 'Tasks', id: 'tasks', icon: CheckSquare },
    { name: 'Journal', id: 'journal', icon: BookOpen },
    { name: 'Settings', id: 'settings', icon: Settings },
  ]

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-blue-950 border-r border-neutral-800 text-white">
  {/* Logo/Header */}
  <div className="flex items-center justify-center h-16 border-b border-neutral-800 mb-2">
    <h1 className="text-xl font-extrabold tracking-tight text-white">Thrive Pad</h1>
  </div>

  {/* Navigation */}
  <nav className="flex-1 flex flex-col gap-1 px-2">
    {navigation.map((item) => {
      const Icon = item.icon
      const isActive = currentPage === item.id
      return (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          className={`
            flex items-center gap-3 px-4 py-2 text-base font-medium rounded-lg group transition 
            ${
              isActive
                ? 'bg-neutral-800 text-blue-400 font-semibold shadow-inner'
                : 'hover:bg-neutral-800 hover:text-blue-200 text-neutral-200'
            }
          `}
        >
          <Icon
            className={`w-5 h-5 transition-colors
              ${isActive ? 'text-blue-400' : 'text-neutral-400 group-hover:text-blue-300'}
            `}
          />
          {item.name}
        </button>
      )
    })}
  </nav>

  {/* User Footer */}
  <div className="mt-auto p-4 border-t border-neutral-800">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center font-semibold text-base text-white">
        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-bold truncate text-white">{user?.displayName || 'User'}</span>
        <span className="text-xs text-neutral-400 truncate">{user?.email}</span>
      </div>
    </div>
    <button
      onClick={handleLogout}
      className="mt-4 w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-neutral-800 text-neutral-300 hover:text-red-400 hover:bg-neutral-700 transition"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  </div>
</aside>

  )
}
