// src/components/layout/MobileBottomNav.jsx

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Search, 
  User, 
  Heart,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const NAV_HEIGHT = 72;
const SCROLL_THRESHOLD = 80;

const navContainerVariants = {
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', damping: 25, stiffness: 400 }
  },
  hidden: { 
    y: 120, 
    opacity: 0,
    transition: { type: 'spring', damping: 25, stiffness: 400 }
  }
};

const NavItem = React.memo(({ item, isActive, onClick }) => {
  const Icon = item.icon;
  
  return (
    <button
      onClick={onClick}
      className="relative flex flex-1 flex-col items-center justify-center h-full outline-none select-none active:scale-90 transition-transform duration-200"
      aria-label={item.label}
    >
      <div className="relative p-1">
        <motion.div
          animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
          className="relative z-10"
        >
          <Icon
            strokeWidth={isActive ? 2.5 : 2}
            className={`w-6 h-6 transition-colors duration-300 ${
              isActive ? 'text-orange-500' : 'text-neutral-400'
            }`}
          />
        </motion.div>

        {/* Dynamic Notification Hub */}
        <AnimatePresence>
          {item.badge > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-neutral-900 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            >
              {item.badge > 99 ? '99' : item.badge}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 transition-all duration-300 ${
        isActive ? 'text-neutral-900 opacity-100' : 'text-neutral-400 opacity-0'
      }`}>
        {item.label}
      </span>

      {/* The Magnetic Indicator */}
      {isActive && (
        <motion.div
          layoutId="navTabGlow"
          className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"
        />
      )}
    </button>
  );
});

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  
  const cartItemCount = useMemo(() => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart?.items]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest < previous || latest < SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else if (latest > previous && latest > SCROLL_THRESHOLD) {
      setIsVisible(false);
    }
  });

  const navItems = useMemo(() => [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'search', icon: Search, label: 'Find', path: '/search' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartItemCount },
    { id: 'wishlist', icon: Heart, label: 'Saved', path: '/customer/wishlist', requiresAuth: true },
    { id: 'account', icon: User, label: 'Me', path: '/customer/dashboard' }
  ], [cartItemCount]);

  const handleNavClick = useCallback((item) => {
    if (navigator.vibrate) navigator.vibrate(5);
    if (item.requiresAuth && !user) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      navigate(item.path);
    }
  }, [navigate, user, location.pathname]);

  const currentActivePath = useMemo(() => {
    const activeItem = navItems.find(item => 
      item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
    );
    return activeItem?.id;
  }, [location.pathname, navItems]);

  return (
    <>
      <div className="h-[env(safe-area-inset-bottom)] md:hidden w-full" />
      
      <motion.nav
        variants={navContainerVariants}
        initial="visible"
        animate={isVisible ? "visible" : "hidden"}
        className="fixed bottom-6 left-6 right-6 z-[9999] md:hidden"
      >
        {/* Floating Capsule Body */}
        <div className="relative h-16 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-around px-2 overflow-hidden">
          
          {/* Subtle Dynamic Mesh Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/20 via-transparent to-blue-50/20 pointer-events-none" />

          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              item={item}
              isActive={currentActivePath === item.id}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </div>
      </motion.nav>
    </>
  );
}

