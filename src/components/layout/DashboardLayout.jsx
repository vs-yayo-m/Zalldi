// src/components/layout/DashboardLayout.jsx

import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getNavigationItems } from '@/utils/roleNavigation'
import * as LucideIcons from 'lucide-react'

export default function DashboardLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const navItems = getNavigationItems(user?.role)
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-neutral-200 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navItems.map(item => {
            const Icon = LucideIcons[item.icon]
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="ml-64 p-6">
        <Outlet />
      </main>
    </div>
  )
}