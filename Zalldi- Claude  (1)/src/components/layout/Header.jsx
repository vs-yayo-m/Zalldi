// src/components/layout/Header.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'
import Badge from '@/components/ui/Badge'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const { items } = useCart()
  
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)
  
  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-neutral-700" />
              </button>

              <Link to="/" className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="font-display font-bold text-2xl lg:text-3xl"
                >
                  <span className="text-orange-500">Zal</span>
                  <span className="text-neutral-800">ldi</span>
                </motion.div>
              </Link>
            </div>

            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <Link
                to="/search"
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-neutral-600" />
                <span className="text-neutral-500">Search products...</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                to="/search"
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-6 h-6 text-neutral-700" />
              </Link>

              {user && (
                <Link
                  to="/customer/wishlist"
                  className="hidden md:flex p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-6 h-6 text-neutral-700" />
                </Link>
              )}

              <Link
                to="/cart"
                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-6 h-6 text-neutral-700" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="solid"
                    className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </Badge>
                )}
              </Link>

              {user ? (
                <Link
                  to="/customer/dashboard"
                  className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="hidden lg:block font-medium text-neutral-800">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <Navigation className="hidden lg:block" />
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}