// src/components/layout/MobileBottomNav.jsx

import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, Search, User, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart } = useCart()
  const { user } = useAuth()

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      activeColor: 'text-orange-500'
    },
    {
      icon: Search,
      label: 'Search',
      path: '/search',
      activeColor: 'text-orange-500'
    },
    {
      icon: ShoppingBag,
      label: 'Cart',
      path: '/cart',
      badge: cartItemCount,
      activeColor: 'text-orange-500'
    },
    {
      icon: Heart,
      label: 'Wishlist',
      path: '/customer/wishlist',
      activeColor: 'text-orange-500'
    },
    {
      icon: User,
      label: 'Account',
      path: user ? '/customer/dashboard' : '/login',
      activeColor: 'text-orange-500'
    }
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-2xl md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center w-full py-2 px-1"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      active ? item.activeColor : 'text-neutral-400'
                    }`}
                  />
                </motion.div>

                {item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}
              </div>

              <span
                className={`text-xs font-medium mt-1 transition-colors ${
                  active ? item.activeColor : 'text-neutral-500'
                }`}
              >
                {item.label}
              </span>

              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-orange-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}