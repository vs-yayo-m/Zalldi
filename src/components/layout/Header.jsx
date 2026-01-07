import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  MapPin,
  ChevronDown,
  X,
  ShieldCheck,
  Store,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useClickOutside } from '@/hooks/useClickOutside';

import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { getDashboardRoute } from '@/utils/roleNavigation';

// --- CONFIGURATION ---
// Customize your header background here. 
// Options: 'bg-white', 'bg-neutral-900', or a custom image url like 'url(/header/bg.webp)'
const HEADER_BG = "bg-white/80 backdrop-blur-xl border-b border-neutral-100";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // For mobile overlay
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  
  // Close search when clicking outside
  useClickOutside(searchRef, () => setIsSearchOpen(false));
  
  // Cart Count Logic
  const cartItemsCount = useMemo(() =>
    items.reduce((total, item) => total + item.quantity, 0),
    [items]);
  
  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };
  
  // Role-Based User Icon Logic
  const UserIcon = () => {
    if (!user) return <User className="w-6 h-6" />;
    switch (user.role) {
      case 'admin':
        return <ShieldCheck className="w-6 h-6 text-purple-600" />;
      case 'supplier':
        return <Store className="w-6 h-6 text-blue-600" />;
      default:
        return <User className="w-6 h-6 text-neutral-900" />;
    }
  };
  
  const handleAccountClick = () => {
    if (user) {
      navigate(getDashboardRoute(user.role));
    } else {
      navigate('/login');
    }
  };
  
  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${HEADER_BG} ${
          isScrolled ? 'shadow-md py-2' : 'py-3'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-2 h-12">
            
            {/* ================= LEFT SECTION: Back | Menu | Search ================= */}
            <div className="flex items-center gap-1 md:gap-4 flex-1">
              
              {/* 1. Back Button (Conditional) */}
              {location.pathname !== '/' && (
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-700" />
                </button>
              )}

              {/* 2. Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition-transform"
              >
                <Menu className="w-6 h-6 text-neutral-700" />
              </button>

              {/* 3. Search Icon (Triggers Overlay on Mobile) */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition-transform lg:hidden"
              >
                <Search className="w-6 h-6 text-neutral-700" />
              </button>

              {/* Desktop Location Badge (Hidden on Mobile) */}
              <div className="hidden lg:flex items-center gap-2 cursor-pointer bg-neutral-50 px-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors">
                <MapPin className="w-4 h-4 text-orange-600" />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Delivery to</span>
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                    Butwal, Ward 9 <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* ================= CENTER SECTION: Logo ================= */}
            <div className="flex-shrink-0 flex justify-center">
              <Link to="/" className="relative group">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {/* Primary Logo from Public Folder */}
                  <img 
                    src="./header/logo.png" 
                    alt="Zalldi" 
                    className="h-8 md:h-10 w-auto object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Text Fallback */}
                  <div className="hidden flex-col items-center leading-none" style={{ display: 'none' }}>
                    <span className="font-black text-2xl tracking-tighter italic text-orange-600">ZALLDI</span>
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* ================= RIGHT SECTION: Cart | User ================= */}
            <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
              
              {/* Desktop Search Bar (Hidden on Mobile) */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-64 xl:w-80 group">
                <input
                  type="text"
                  placeholder="Search essentials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border-2 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-orange-500" />
              </form>

              {/* 5. Cart Button */}
              <button 
                onClick={() => navigate('/cart')}
                className="relative p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition-transform group"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-neutral-900 group-hover:text-orange-600 transition-colors" />
                  <AnimatePresence>
                    {cartItemsCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white"
                      >
                        {cartItemsCount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>

              {/* 6. User / Role Icon */}
              <button 
                onClick={handleAccountClick}
                className="relative p-2 rounded-full hover:bg-neutral-100 active:scale-95 transition-transform"
              >
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="User" 
                    className="w-7 h-7 rounded-full object-cover border-2 border-neutral-100" 
                  />
                ) : (
                  <UserIcon />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Row */}
          <div className="hidden lg:block mt-2 pt-2 border-t border-neutral-100/50">
            <Navigation />
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-white p-4 shadow-xl"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-12 pl-12 pr-4 bg-neutral-100 rounded-xl font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-3 bg-neutral-100 rounded-xl text-neutral-500 font-bold text-xs uppercase"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}