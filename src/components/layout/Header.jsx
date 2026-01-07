// src/components/layout/Header.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Heart, 
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
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useClickOutside } from '@/hooks/useClickOutside';

import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

import { getDashboardRoute } from '@/utils/roleNavigation';

const ROLE_CONFIGS = {
  customer: {
    icon: User,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    badge: '👤',
    label: 'Customer'
  },
  supplier: {
    icon: Store,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-purple-600',
    badge: '🏪',
    label: 'Supplier'
  },
  admin: {
    icon: Crown,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-600',
    badge: '👑',
    label: 'Admin'
  }
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  const roleConfig = user ? ROLE_CONFIGS[user.role] || ROLE_CONFIGS.customer : null;
  const RoleIcon = roleConfig?.icon || User;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchFocused(false);
  }, [location.pathname]);

  const handleAccountClick = () => {
    if (user) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute);
    } else {
      navigate('/login');
    }
  };

  const searchDropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'bg-gradient-to-r from-orange-50/95 via-white/95 to-orange-50/95 backdrop-blur-xl shadow-2xl shadow-orange-500/10 py-2' 
            : 'bg-gradient-to-r from-orange-50 via-white to-orange-50 border-b-2 border-orange-100 py-3 lg:py-4'
        }`}
        style={{
          backgroundImage: isScrolled ? 'none' : 'url(/header/bg-pattern.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex items-center justify-between gap-3 lg:gap-6">
            
            {/* LEFT: Back + Menu */}
            <div className="flex items-center gap-2">
              {location.pathname !== '/' && (
                <motion.button
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-orange-500 text-orange-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gradient-to-br from-orange-500 to-orange-600 text-orange-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>

            {/* CENTER: Search (Mobile Hidden) */}
            <Link to="/search" className="lg:hidden p-2 hover:bg-gradient-to-br from-orange-500 to-orange-600 text-orange-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg">
              <Search className="w-6 h-6" />
            </Link>

            {/* LOGO */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 blur-xl opacity-30 rounded-full" />
                <img
                  src="/header/logo.png"
                  alt="Zalldi"
                  className="h-10 lg:h-12 w-auto relative z-10"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="flex flex-col leading-none relative z-10">
                        <span class="font-black text-2xl lg:text-3xl tracking-tighter bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                          ZALLDI
                        </span>
                        <span class="text-[8px] font-bold text-orange-400 tracking-[0.3em] uppercase ml-1">
                          EXPRESS
                        </span>
                      </div>
                    `;
                  }}
                />
              </motion.div>
            </Link>

            {/* Desktop Search */}
            <div ref={searchRef} className="hidden lg:block flex-1 max-w-xl">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className={`relative flex items-center transition-all duration-300 rounded-2xl overflow-hidden border-2 ${
                  isSearchFocused 
                    ? 'bg-white border-orange-500 ring-4 ring-orange-500/20 shadow-xl shadow-orange-500/20' 
                    : 'bg-white/80 border-orange-200 hover:border-orange-300 shadow-md'
                }`}
              >
                <div className="pl-4">
                  <Search className={`w-5 h-5 transition-colors ${isSearchFocused ? 'text-orange-600' : 'text-orange-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder='Search "milk", "bread" or any product...'
                  className="w-full px-4 py-3.5 bg-transparent outline-none text-neutral-800 font-semibold placeholder:text-neutral-400 placeholder:font-medium"
                  onFocus={() => setIsSearchFocused(true)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery('')}
                    className="pr-4 text-neutral-400 hover:text-orange-600"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>

              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    variants={searchDropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white rounded-3xl shadow-2xl border-2 border-orange-100 overflow-hidden backdrop-blur-xl"
                  >
                    <div className="p-6">
                      <div className="mb-5">
                        <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <History className="w-4 h-4" /> Recent Searches
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['Fresh Mango', 'Aashirvaad Atta', 'Amul Butter'].map((item) => (
                            <motion.button 
                              key={item}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-500 hover:to-orange-600 text-neutral-700 hover:text-white rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-lg"
                            >
                              {item}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Trending Now
                        </h4>
                        <ul className="space-y-1">
                          {['Summer Drinks & Beverages', 'Organic Vegetables', 'Daily Essentials'].map((item) => (
                            <motion.li 
                              key={item}
                              whileHover={{ x: 4, backgroundColor: '#FFF7ED' }}
                              className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-all"
                            >
                              <span className="text-neutral-700 font-bold">{item}</span>
                              <ChevronDown className="w-5 h-5 text-orange-400 -rotate-90" />
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-center">
                      <p className="text-sm text-white font-black">🎉 Save up to 50% on your first 3 orders!</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Cart + User */}
            <div className="flex items-center gap-2 lg:gap-3">
              {user?.role === 'customer' && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cart')}
                  className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 lg:px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/70 transition-all"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                    <AnimatePresence>
                      {cartItemsCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-500 shadow-lg"
                        >
                          {cartItemsCount}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-[9px] font-bold opacity-90 uppercase tracking-wider">Cart</span>
                    <span className="text-sm font-black">Rs.{cartTotal?.toLocaleString() || '0'}</span>
                  </div>
                </motion.button>
              )}

              {user ? (
                <div className="relative group">
                  <motion.button
                    onClick={handleAccountClick}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${roleConfig.gradient} hover:shadow-xl hover:shadow-${roleConfig.color}/50 text-white rounded-xl transition-all shadow-lg`}
                  >
                    <div className="relative">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-lg object-cover ring-2 ring-white shadow-md"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-lg backdrop-blur-sm">
                          {roleConfig.badge}
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-[9px] font-bold opacity-90 uppercase tracking-wider">
                        {roleConfig.label}
                      </span>
                      <span className="text-sm font-black truncate max-w-[80px]">
                        {user.displayName?.split(' ')[0] || 'User'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 hidden lg:block" />
                  </motion.button>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border-2 border-neutral-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${roleConfig.gradient}`} />
                    
                    <div className="px-4 py-4 border-b border-neutral-100 mb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 bg-gradient-to-r ${roleConfig.gradient} rounded-lg`}>
                          <RoleIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{roleConfig.label} Account</p>
                          <p className="text-sm font-black text-neutral-800">{user.displayName || 'User'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 font-medium truncate">{user.email}</p>
                    </div>
                    
                    {user.role === 'customer' ? (
                      <>
                        {[
                          { icon: Package, label: 'My Orders', link: '/customer/orders', color: 'blue' },
                          { icon: Heart, label: 'Wishlist', link: '/customer/wishlist', color: 'pink' },
                          { icon: MapPin, label: 'Addresses', link: '/customer/addresses', color: 'green' },
                          { icon: Settings, label: 'Settings', link: '/customer/settings', color: 'gray' },
                        ].map((item) => (
                          <Link 
                            key={item.label} 
                            to={item.link} 
                            className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-all font-bold text-sm group/item"
                          >
                            <item.icon className="w-5 h-5 group-hover/item:scale-110 transition-transform" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link
                        to={getDashboardRoute(user.role)}
                        className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-all font-bold text-sm"
                      >
                        <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-neutral-100 mt-2 pt-2">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-all font-black text-sm"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-orange-500 hover:to-orange-600 text-white text-sm font-black rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">Login</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden lg:block mt-3 pt-3 border-t border-orange-100">
            <Navigation />
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}