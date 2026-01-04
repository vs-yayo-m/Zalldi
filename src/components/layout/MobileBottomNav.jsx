// src/components/layout/MobileBottomNav.jsx

 import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  ShoppingBag, 
  Search, 
  User, 
  Heart, 
  Zap // Added for a "Offers" or "Quick" action if needed, keeping it extensible
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useCart } from '../../hooks/useCart' // Corrected path based on file structure
import { useAuth } from '../../hooks/useAuth' // Corrected path based on file structure

// ==========================================
// Constants & Configuration
// ==========================================

const NAV_HEIGHT = 70 // Height in px for layout calculations
const SCROLL_THRESHOLD = 50 // Pixels to scroll before hiding/showing
const HAPTIC_PATTERN = 10 // ms vibration

/**
 * Variants for the navigation bar container (Hide/Show on scroll)
 */
const navContainerVariants = {
  visible: { 
    y: 0,
    opacity: 1,
    transition: { 
      type: 'spring', 
      damping: 20, 
      stiffness: 300,
      mass: 0.8
    }
  },
  hidden: { 
    y: 100, // Move off-screen
    opacity: 0,
    transition: { 
      type: 'spring', 
      damping: 20, 
      stiffness: 300 
    }
  }
}

/**
 * Variants for the icon animations (Pop effect)
 */
const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  active: { 
    scale: 1.2, 
    transition: { type: 'spring', stiffness: 400, damping: 10 } 
  },
  tap: { scale: 0.8, rotate: -5 }
}

/**
 * Variants for the notification badge (Bounce effect)
 */
const badgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 500, damping: 25 }
  },
  bump: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.3 }
  }
}

// ==========================================
// Sub-Component: NavItem
// ==========================================

const NavItem = React.memo(({ item, isActive, onClick }) => {
  const Icon = item.icon
  
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center justify-center h-full outline-none focus:outline-none touch-manipulation group`}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active Indicator Background (Glow) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-orange-50/50 rounded-xl mx-2 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <div className="relative p-1">
        {/* Icon Animation Wrapper */}
        <motion.div
          variants={iconVariants}
          initial="initial"
          animate={isActive ? "active" : "initial"}
          whileTap="tap"
          className="relative z-10"
        >
          <Icon
            strokeWidth={isActive ? 2.5 : 2}
            className={`w-6 h-6 transition-colors duration-300 ${
              isActive ? 'text-orange-600 fill-orange-100' : 'text-neutral-400 group-hover:text-neutral-600'
            }`}
          />
        </motion.div>

        {/* Notification Badge */}
        <AnimatePresence>
          {item.badge > 0 && (
            <motion.div
              key={`badge-${item.badge}`} // Key change triggers animation re-run
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              exit="initial"
              className="absolute -top-1.5 -right-2 min-w-[1.25rem] h-5 px-1 bg-orange-600 text-white text-[10px] font-bold leading-none rounded-full flex items-center justify-center shadow-sm ring-2 ring-white z-20"
            >
              <motion.span variants={badgeVariants} animate="bump">
                {item.badge > 99 ? '99+' : item.badge}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      <span
        className={`text-[10px] font-medium mt-1 transition-all duration-300 ${
          isActive 
            ? 'text-orange-700 font-semibold translate-y-0' 
            : 'text-neutral-500 translate-y-0.5'
        }`}
      >
        {item.label}
      </span>

      {/* Active Tab Top Indicator Bar */}
      {isActive && (
        <motion.div
          layoutId="activeNavBar"
          className="absolute top-0 w-8 h-1 bg-orange-500 rounded-b-full shadow-[0_2px_8px_rgba(249,115,22,0.4)]"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  )
})

NavItem.displayName = 'NavItem'

// ==========================================
// Main Component: MobileBottomNav
// ==========================================

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart } = useCart()
  const { user } = useAuth()
  
  // State for scroll visibility
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()
  
  // Calculate total items properly
  const cartItemCount = useMemo(() => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  }, [cart?.items])

  /**
   * Scroll Handler:
   * Hides navbar when scrolling down to give more reading space.
   * Shows navbar when scrolling up or at the top.
   */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    // Show if scrolling up or near top
    if (latest < previous || latest < SCROLL_THRESHOLD) {
      setIsVisible(true)
    } 
    // Hide if scrolling down and past threshold
    else if (latest > previous && latest > SCROLL_THRESHOLD) {
      setIsVisible(false)
    }
  })

  // Navigation Items Configuration
  const navItems = useMemo(() => [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/',
      requiresAuth: false
    },
    {
      id: 'search',
      icon: Search,
      label: 'Search',
      path: '/search',
      requiresAuth: false
    },
    {
      id: 'cart',
      icon: ShoppingBag,
      label: 'Cart',
      path: '/cart',
      badge: cartItemCount,
      requiresAuth: false
    },
    {
      id: 'wishlist',
      icon: Heart,
      label: 'Saved', // Shorter label for mobile
      path: '/customer/wishlist',
      requiresAuth: true
    },
    {
      id: 'account',
      icon: User,
      label: 'Account',
      path: '/customer/dashboard',
      fallbackPath: '/login', // Where to go if not auth
      requiresAuth: false // Logic handled inside click
    }
  ], [cartItemCount])

  // Helper to determine active state precisely
  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }, [location.pathname])

  /**
   * Handle Navigation Click
   * Triggers haptic feedback and navigation
   */
  const handleNavClick = useCallback((item) => {
    // 1. Haptic Feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(HAPTIC_PATTERN)
    }

    // 2. Auth Guard
    if (item.requiresAuth && !user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    // 3. Conditional Pathing (e.g. Account vs Login)
    const targetPath = (item.id === 'account' && !user) 
      ? item.fallbackPath 
      : item.path

    // 4. Navigate
    navigate(targetPath)
  }, [navigate, user, location.pathname])

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="h-[70px] md:hidden w-full shrink-0" aria-hidden="true" />

      {/* Navigation Container */}
      <motion.nav
        variants={navContainerVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden print:hidden"
      >
        {/* Glassmorphism Background Layer */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-neutral-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" />

        {/* Content Container (Safe Area Aware) */}
        <div 
          className="relative flex items-center justify-around w-full max-w-lg mx-auto px-1 pb-[env(safe-area-inset-bottom)]"
          style={{ height: NAV_HEIGHT }}
        >
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              item={item}
              isActive={isActive(item.path)}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </div>
      </motion.nav>
    </>
  )
}

