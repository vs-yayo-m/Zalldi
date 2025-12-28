// src/components/layout/MobileMenu.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, ShoppingBag, Package, Heart, User, LogOut, Settings, HelpCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { CATEGORIES } from '@/utils/constants'

export default function MobileMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  
  const handleLogout = async () => {
    await logout()
    onClose()
  }
  
  const menuItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: ShoppingBag, label: 'Shop', to: '/shop' },
    ...(user ? [
      { icon: Package, label: 'My Orders', to: '/customer/orders' },
      { icon: Heart, label: 'Wishlist', to: '/customer/wishlist' },
      { icon: User, label: 'Profile', to: '/customer/profile' },
      { icon: Settings, label: 'Settings', to: '/customer/settings' }
    ] : []),
    { icon: HelpCircle, label: 'Help & FAQ', to: '/faq' }
  ]
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <Link to="/" onClick={onClose} className="font-display font-bold text-2xl">
                  <span className="text-orange-500">Zal</span>
                  <span className="text-neutral-800">ldi</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-800 truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-neutral-600 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white text-center font-semibold rounded-lg transition-colors"
                >
                  Login / Register
                </Link>
              )}
            </div>

            <div className="p-4">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200">
              <h3 className="font-semibold text-neutral-800 mb-3">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    onClick={onClose}
                    className="block px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}