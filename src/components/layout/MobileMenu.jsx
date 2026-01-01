import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  ShoppingBag, 
  Package, 
  Heart, 
  User, 
  LogOut, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Zap,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES, APP_NAME } from '@/utils/constants';

/**
 * ZALLDI MOBILE NAVIGATION HUB
 * A high-density, tactile side-menu optimized for mobile-first commerce.
 */

export default function MobileMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };
  
  const menuItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: ShoppingBag, label: 'Shop All', to: '/shop' },
    ...(user ? [
      { icon: Package, label: 'My Orders', to: '/customer/orders' },
      { icon: Heart, label: 'Wishlist', to: '/customer/wishlist' },
      { icon: User, label: 'Account', to: '/customer/profile' },
      { icon: Settings, label: 'Preferences', to: '/customer/settings' }
    ] : []),
  ];

  const isActive = (path) => location.pathname === path;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Immersive Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100] lg:hidden"
          />

          {/* 2. Side Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-white z-[101] lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header / Brand Section */}
            <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" onClick={onClose} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Zap className="w-5 h-5 text-white fill-current" />
                  </div>
                  <div className="font-display font-black text-2xl tracking-tighter">
                    <span className="text-orange-500">Zal</span>
                    <span className="text-neutral-900">ldi</span>
                  </div>
                </Link>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-200 rounded-xl active:scale-90 transition-all"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* User Profile / Auth Action */}
              {user ? (
                <div className="flex items-center gap-4 p-4 bg-white border border-neutral-100 rounded-[1.25rem] shadow-sm">
                  <div className="relative">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-500/20">
                        <User className="w-6 h-6 text-orange-600" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral-900 truncate leading-none mb-1">
                      {user.displayName || 'Customer'}
                    </p>
                    <p className="text-xs text-neutral-500 font-medium truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  SIGN IN / REGISTER
                </Link>
              )}
            </div>

            {/* Main Navigation Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* Primary Links */}
              <div className="px-4 space-y-1 mb-8">
                <p className="px-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Main Menu</p>
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${
                      isActive(item.to) 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={`w-5 h-5 ${isActive(item.to) ? 'text-orange-600' : 'text-neutral-400'}`} />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-30 group-hover:opacity-100 transition-all ${isActive(item.to) ? 'opacity-100' : ''}`} />
                  </Link>
                ))}
              </div>

              {/* Browse Categories */}
              <div className="px-4 mb-8">
                <p className="px-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Categories</p>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {CATEGORIES.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      onClick={onClose}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
                    >
                      <span className="text-sm font-bold text-neutral-700 group-hover:text-orange-600 text-center line-clamp-1">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Butwal Trust Banner */}
              <div className="mx-6 p-4 bg-neutral-900 rounded-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-tighter">
                    <Clock className="w-3 h-3" /> 60 MIN DELIVERY
                  </div>
                  <p className="text-white text-xs font-bold">Serving all of Butwal</p>
                  <div className="flex items-center gap-1 text-neutral-500 text-[10px] font-medium">
                    <MapPin className="w-3 h-3" /> Ward 1 - 19
                  </div>
                </div>
                <Zap className="absolute -right-4 -bottom-4 w-20 h-20 text-white/5" />
              </div>
            </div>

            {/* Fixed Bottom Quick Actions */}
            <div className="p-6 border-t border-neutral-100 bg-white">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link
                  to="/faq"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center py-3 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-600"
                >
                  <HelpCircle className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Help</span>
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center py-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-600"
                  >
                    <LogOut className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Logout</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center justify-center py-3 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-400">
                    <Settings className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Settings</span>
                  </div>
                )}
              </div>
              <p className="text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Version 2.0.4 <span className="text-neutral-200 mx-1">|</span> {APP_NAME}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Logic for LogIn icon (not provided by lucide-react in previous prompt)
const LogIn = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

