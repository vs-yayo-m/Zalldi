// src/components/layout/Header.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Heart, 
  MapPin, 
  ChevronDown, 
  Bell, 
  ArrowRight,
  LogOut,
  Settings,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks & Contexts
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// UI Components
import Badge from '@/components/ui/Badge';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { Dropdown } from '@/components/ui/Dropdown';

/**
 * ZALLDI ENTERPRISE HEADER
 * Inspired by Blinkit's hyper-local fast commerce UI.
 * Features: Sticky Glassmorphism, Animated Search, Location Picker, and Advanced Cart Preview.
 */

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logout } = useAuth();
  const { items, totalPrice } = useCart();
  const scrollPosition = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  // Calculate cart metrics
  const cartItemsCount = useMemo(() => 
    items.reduce((total, item) => total + item.quantity, 0), 
  [items]);

  const isSticky = scrollPosition > 50;

  // Animation Variants
  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  const cartPulseVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1], transition: { duration: 0.3 } }
  };

  return (
    <>
      {/* Top Banner - Utility Bar (Enterprise Grade) */}
      <div className="hidden lg:block bg-neutral-900 text-white py-1.5 overflow-hidden">
        <div className="container mx-auto px-6 flex justify-between items-center text-xs font-medium uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-orange-400">
              <Zap className="w-3 h-3 fill-current" />
              Delivery in 10 minutes
            </span>
            <span className="text-neutral-400">|</span>
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Partner with us</span>
          </div>
          <div className="flex items-center gap-6 text-neutral-300">
            <Link to="/static/how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link to="/static/support" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>

      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isSticky 
            ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
            : 'bg-white border-b border-neutral-100 py-3'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* 1. Brand & Location Section */}
            <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-orange-50 text-neutral-700 rounded-xl transition-all active:scale-90"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <Link to="/" className="group flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative flex items-center"
                  >
                    <div className="font-display font-black text-2xl lg:text-3xl tracking-tighter flex items-baseline">
                      <span className="text-orange-500 group-hover:text-orange-600 transition-colors">Zal</span>
                      <span className="text-neutral-900">ldi</span>
                    </div>
                    <motion.div 
                      className="absolute -right-2 -top-1 w-2 h-2 bg-orange-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </motion.div>
                </Link>
              </div>

              {/* Location Picker (Blinkit Style) */}
              <button className="hidden sm:flex flex-col items-start group transition-all max-w-[150px] lg:max-w-[200px]">
                <div className="flex items-center gap-1 text-neutral-900 font-bold text-sm">
                  <span className="truncate">Delivering to Home</span>
                  <ChevronDown className="w-4 h-4 text-orange-500 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center gap-1 truncate w-full">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Sector 45, Gurgaon, Haryana, India...</span>
                </div>
              </button>
            </div>

            {/* 2. Advanced Search Bar (Hyper-Functional) */}
            <div className="hidden md:flex flex-1 max-w-2xl relative group">
              <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${
                isSearchFocused 
                  ? 'bg-white border-orange-500 shadow-md ring-4 ring-orange-500/10' 
                  : 'bg-neutral-100 border-transparent hover:bg-neutral-200/70'
              }`}>
                <Search className={`w-5 h-5 transition-colors ${isSearchFocused ? 'text-orange-500' : 'text-neutral-500'}`} />
                <input 
                  type="text"
                  placeholder='Search "milk", "bread" or "organic eggs"'
                  className="bg-transparent border-none outline-none w-full text-sm font-medium text-neutral-800 placeholder:text-neutral-500"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-300 bg-white text-[10px] text-neutral-400 font-sans pointer-events-none">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
              
              {/* Quick Results Overlay (Skeleton/Draft) */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 z-50 overflow-hidden"
                  >
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Trending Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Fresh Fruits', 'Dairy', 'Ice Cream', 'Personal Care', 'Soft Drinks'].map((item) => (
                        <button key={item} className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold rounded-full transition-colors flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Actions Section */}
            <div className="flex items-center gap-1 lg:gap-3">
              <button className="md:hidden p-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-all">
                <Search className="w-6 h-6" />
              </button>

              {user && (
                <button className="hidden lg:flex p-2.5 text-neutral-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all relative group">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                </button>
              )}

              {/* Advanced User Dropdown */}
              {user ? (
                <div className="relative group">
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => navigate('/customer/dashboard')}
                    className="flex items-center gap-2 p-1.5 lg:pr-3 hover:bg-neutral-100 rounded-xl transition-all"
                  >
                    <div className="relative">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                      ) : (
                        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-200">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-[13px] font-bold text-neutral-900 truncate max-w-[80px]">
                        {user.displayName?.split(' ')[0] || 'Member'}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-medium">Account</span>
                    </div>
                  </motion.button>

                  {/* Desktop Hover Menu */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2">
                      <div className="px-3 py-2 mb-2 border-b border-neutral-50">
                        <p className="text-xs font-medium text-neutral-400">Welcome back!</p>
                        <p className="text-sm font-bold text-neutral-800 truncate">{user.email}</p>
                      </div>
                      <Link to="/customer/orders" className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors text-sm font-semibold">
                        <ShoppingBag className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/customer/wishlist" className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors text-sm font-semibold">
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      <Link to="/customer/settings" className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors text-sm font-semibold">
                        <Settings className="w-4 h-4" /> Profile Settings
                      </Link>
                      <div className="my-1 border-t border-neutral-50" />
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-200"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* Advanced Cart Component (Blinkit style "Total Display") */}
              <motion.button
                variants={cartPulseVariants}
                animate={cartItemsCount > 0 ? "animate" : "initial"}
                onClick={() => navigate('/cart')}
                className={`flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-xl transition-all border ${
                  cartItemsCount > 0 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200' 
                    : 'bg-white border-neutral-200 text-neutral-800 hover:border-orange-500'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="lg:hidden absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                {isDesktop && (
                   <div className="flex flex-col items-start pr-1">
                    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80 leading-none">
                      {cartItemsCount} {cartItemsCount === 1 ? 'Item' : 'Items'}
                    </span>
                    <span className="text-sm font-black leading-tight">
                      {cartItemsCount > 0 ? `₹${totalPrice.toLocaleString()}` : 'My Cart'}
                    </span>
                  </div>
                )}
                {cartItemsCount > 0 && isDesktop && (
                  <div className="pl-1 border-l border-white/20">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* 4. Secondary Navigation (Only visible on scroll or specific pages) */}
          <AnimatePresence>
            {!isSticky && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="hidden lg:block overflow-hidden"
              >
                <div className="pt-4 mt-2 border-t border-neutral-50">
                  <Navigation />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Global Modals/Drawers */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

