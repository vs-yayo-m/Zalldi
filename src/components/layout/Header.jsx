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
  TrendingUp, 
  History,
  LogOut,
  Package,
  Settings,
  Bell,
  LayoutDashboard,
  Crown,
  Store,
  ShieldCheck,
  ArrowLeft,
  Zap,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useClickOutside } from '@/hooks/useClickOutside';

import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { getDashboardRoute } from '@/utils/roleNavigation';

// --- CONFIGURATION ---
// Background Image Path: Place 'header-bg.webp' in 'public/header/' folder
// Logo Path: Place 'logo.svg' in 'public/header/' folder
const HEADER_CONFIG = {
  bgPattern: 'url(/header/header-bg.webp)', 
  logoPath: '/header/logo.svg'
};

const ROLE_CONFIGS = {
  customer: {
    icon: User,
    color: 'text-neutral-900',
    bg: 'bg-neutral-100',
    label: 'Account'
  },
  supplier: {
    icon: Store,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Vendor'
  },
  admin: {
    icon: ShieldCheck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    label: 'Admin'
  }
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, logout } = useAuth();
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useClickOutside(searchRef, () => setIsSearchFocused(false));

  const cartItemsCount = useMemo(() => 
    items.reduce((total, item) => total + item.quantity, 0), 
  [items]);

  const currentRole = user ? ROLE_CONFIGS[user.role] || ROLE_CONFIGS.customer : ROLE_CONFIGS.customer;
  const RoleIcon = currentRole.icon;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleAccountClick = () => {
    if (user) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-md py-2' 
            : 'bg-white border-b border-neutral-100 py-3 lg:py-4'
        }`}
        style={{
          backgroundImage: isScrolled ? 'none' : HEADER_CONFIG.bgPattern,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-2 lg:gap-8 h-12 relative">
            
            {/* ============================================================
               1. LEFT GROUP: Back | Menu | Search (Mobile Only)
               ============================================================ */}
            <div className="flex items-center gap-1 md:gap-3 flex-1 lg:flex-none">
              
              {/* Back Button (Only if not on Home) */}
              {location.pathname !== '/' && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
              )}

              {/* Hamburger Menu */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </motion.button>

              {/* Mobile Search Trigger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors lg:hidden"
              >
                <Search className="w-6 h-6" />
              </motion.button>

              {/* Desktop Logo Group (Hidden on Mobile) */}
              <div className="hidden lg:flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 group">
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30"
                  >
                    <Zap className="w-6 h-6 fill-current" />
                  </motion.div>
                  <div className="flex flex-col leading-none">
                    <span className="font-black text-2xl tracking-tighter italic text-neutral-900">ZALLDI</span>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em]">Express</span>
                  </div>
                </Link>
                
                {/* Location Picker */}
                <div className="hidden xl:flex items-center gap-2 ml-6 px-3 py-1.5 bg-neutral-50 rounded-xl cursor-pointer hover:bg-orange-50 group transition-colors">
                  <MapPin className="w-4 h-4 text-orange-600 group-hover:animate-bounce" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-neutral-400">Delivering to</p>
                    <p className="text-xs font-bold text-neutral-900 flex items-center">
                      Butwal, Ward 9 <ChevronDown className="w-3 h-3 ml-1" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================
               2. CENTER GROUP: Logo (Mobile Only) | Search Bar (Desktop)
               ============================================================ */}
            
            {/* Mobile Centered Logo */}
            <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link to="/">
                <img 
                  src={HEADER_CONFIG.logoPath} 
                  alt="Zalldi" 
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="font-black text-2xl tracking-tighter italic text-orange-600">ZALLDI</span>';
                  }}
                />
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div ref={searchRef} className="hidden lg:block flex-1 max-w-2xl relative group">
              <form onSubmit={handleSearchSubmit} className={`relative flex items-center transition-all duration-300 rounded-2xl border-2 ${
                isSearchFocused 
                  ? 'bg-white border-orange-500 shadow-xl shadow-orange-500/10' 
                  : 'bg-neutral-100 border-transparent hover:bg-white hover:border-orange-200'
              }`}>
                <Search className={`w-5 h-5 ml-4 ${isSearchFocused ? 'text-orange-500' : 'text-neutral-400'}`} />
                <input
                  type="text"
                  placeholder='Search "milk", "curd", "bread"...'
                  className="w-full px-4 py-3 bg-transparent outline-none text-neutral-900 font-bold placeholder:text-neutral-400"
                  onFocus={() => setIsSearchFocused(true)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="pr-4 text-neutral-400 hover:text-orange-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Desktop Search Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 z-50"
                  >
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">Trending</p>
                    <div className="flex flex-wrap gap-2">
                      {['Fresh Milk', 'Organic Eggs', 'Atta', 'Cold Drinks'].map(tag => (
                        <button key={tag} onClick={() => {setSearchQuery(tag);}} className="px-3 py-1.5 bg-neutral-50 hover:bg-orange-50 text-neutral-600 hover:text-orange-600 rounded-lg text-sm font-bold transition-colors">
                          <TrendingUp className="w-3 h-3 inline mr-1" /> {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ============================================================
               3. RIGHT GROUP: Cart | User
               ============================================================ */}
            <div className="flex items-center justify-end gap-2 lg:gap-4 flex-1 lg:flex-none">
              
              {/* Cart Button */}
              {user?.role === 'customer' && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/cart')}
                  className="relative p-2 lg:px-4 lg:py-2.5 rounded-full lg:rounded-xl bg-transparent lg:bg-neutral-900 text-neutral-900 lg:text-white hover:bg-neutral-100 lg:hover:bg-black transition-all flex items-center gap-3 group"
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6 lg:w-5 lg:h-5 group-hover:fill-current transition-colors" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white lg:border-neutral-900">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                  {/* Desktop Cart Total */}
                  <div className="hidden lg:flex flex-col items-start leading-none">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Total</span>
                    <span className="text-sm font-black">₹{cartTotal}</span>
                  </div>
                </motion.button>
              )}

              {/* User / Role Button */}
              {user ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAccountClick}
                  className={`p-1 pr-1 lg:pr-3 rounded-full flex items-center gap-2 transition-all ${currentRole.bg} hover:ring-2 hover:ring-offset-2 hover:ring-orange-200`}
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentRole.color} bg-white shadow-sm`}>
                      <RoleIcon className="w-4 h-4" />
                    </div>
                  )}
                  <span className="hidden lg:block text-xs font-bold text-neutral-900 pr-1">
                    {user.displayName?.split(' ')[0]}
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="p-2 rounded-full hover:bg-neutral-100 lg:bg-orange-500 lg:hover:bg-orange-600 lg:text-white lg:px-6 lg:py-2.5 lg:rounded-xl transition-all shadow-sm"
                >
                  <User className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2 inline-block" />
                  <span className="hidden lg:inline font-bold text-sm">Login</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Bar */}
          <div className="hidden lg:block mt-2 border-t border-neutral-50 pt-1">
            <Navigation />
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY (Full Screen) */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[60] bg-white p-4"
          >
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 -ml-2 rounded-full hover:bg-neutral-100"
              >
                <ArrowLeft className="w-6 h-6 text-neutral-900" />
              </button>
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-neutral-100 rounded-2xl px-5 font-bold text-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-orange-500 rounded-xl text-white">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Popular Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['Vegetables', 'Dairy', 'Snacks', 'Bakery'].map(cat => (
                    <div key={cat} onClick={() => {navigate(`/shop?category=${cat.toLowerCase()}`); setIsMobileSearchOpen(false);}} className="p-4 bg-neutral-50 rounded-2xl font-bold text-neutral-700 active:scale-95 transition-transform">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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


