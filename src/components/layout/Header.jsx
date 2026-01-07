// src/components/layout/Header.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Heart, 
  ArrowLeft,
  X, 
  TrendingUp, 
  History,
  LogOut,
  Package,
  Settings,
  Bell,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useClickOutside } from '@/hooks/useClickOutside';

import MobileMenu from './MobileMenu';
import { getDashboardRoute } from '@/utils/roleNavigation';

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

  const isHomePage = location.pathname === '/';

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
    }
  };

  const searchDropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white border-b border-neutral-100'
        }`}
      >
        <div className="container mx-auto px-3 lg:px-4">
          <div className="flex items-center justify-between gap-2 h-14 lg:h-16">
            
            {/* Left Section: Back + Menu + Search Icon */}
            <div className="flex items-center gap-1 lg:gap-2">
              {!isHomePage && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-orange-50 text-neutral-700 rounded-full transition-all"
                >
                  <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                </motion.button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 hover:bg-orange-50 text-neutral-700 rounded-full transition-all"
              >
                <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>

              <button
                onClick={() => navigate('/search')}
                className="lg:hidden p-2 hover:bg-orange-50 text-neutral-700 rounded-full transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Logo */}
            <Link to="/" className="flex items-center justify-center flex-1 lg:flex-none">
              <motion.img
                src="/header/logo.png"
                alt="Zalldi"
                className="h-8 lg:h-10 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="flex flex-col leading-none">
                      <span class="font-black text-xl lg:text-2xl tracking-tighter italic">
                        <span class="text-orange-500">ZAL</span><span class="text-neutral-900">LDI</span>
                      </span>
                      <span class="text-[8px] font-bold text-neutral-400 tracking-[0.15em] uppercase -mt-1 ml-0.5">Express</span>
                    </div>
                  `;
                }}
              />
            </Link>

            {/* Desktop Search Bar */}
            <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className={`relative flex items-center transition-all duration-300 rounded-xl overflow-hidden border-2 ${
                  isSearchFocused 
                    ? 'bg-white border-orange-500 ring-4 ring-orange-500/10' 
                    : 'bg-neutral-100 border-transparent hover:bg-neutral-200/70'
                }`}>
                  <Search className={`ml-3 w-5 h-5 transition-colors ${isSearchFocused ? 'text-orange-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder='Search products...'
                    className="w-full px-3 py-2.5 bg-transparent outline-none text-neutral-800 font-medium placeholder:text-neutral-400 text-sm"
                    onFocus={() => setIsSearchFocused(true)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mr-3 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    variants={searchDropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden mx-4"
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <History className="w-3 h-3" /> Recent
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['Fresh Mango', 'Atta', 'Butter'].map((item) => (
                            <button 
                              key={item} 
                              onClick={() => setSearchQuery(item)}
                              className="px-3 py-1.5 bg-neutral-50 hover:bg-orange-50 text-neutral-600 hover:text-orange-600 rounded-lg text-sm font-medium transition-colors border border-neutral-100"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" /> Trending
                        </h4>
                        <ul className="space-y-1">
                          {['Summer Drinks', 'Organic Vegetables', 'Daily Essentials'].map((item) => (
                            <li 
                              key={item} 
                              onClick={() => setSearchQuery(item)}
                              className="group flex items-center justify-between p-2 hover:bg-neutral-50 rounded-xl cursor-pointer transition-colors"
                            >
                              <span className="text-neutral-700 font-medium group-hover:text-orange-600 text-sm">{item}</span>
                              <ChevronDown className="w-4 h-4 text-neutral-300 -rotate-90" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Section: Cart + User */}
            <div className="flex items-center gap-1 lg:gap-2">
              {user?.role === 'customer' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cart')}
                  className="relative p-2 hover:bg-orange-50 rounded-full transition-all"
                >
                  <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-neutral-700" />
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </motion.button>
              )}

              {user ? (
                <div className="relative group">
                  <motion.button
                    onClick={handleAccountClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-orange-50 rounded-full transition-all"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                    ) : (
                      <div className="w-7 h-7 lg:w-8 lg:h-8 bg-neutral-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                  </motion.button>
                  
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="px-4 py-3 border-b border-neutral-50 mb-2">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Welcome!</p>
                      <p className="text-sm font-black text-neutral-800 truncate">{user.email}</p>
                    </div>
                    {user.role === 'customer' ? (
                      <>
                        {[
                          { icon: Package, label: 'My Orders', link: '/customer/orders' },
                          { icon: Heart, label: 'Wishlist', link: '/customer/wishlist' },
                          { icon: Settings, label: 'Settings', link: '/customer/settings' },
                        ].map((item) => (
                          <Link 
                            key={item.label} 
                            to={item.link} 
                            className="flex items-center gap-3 px-4 py-2.5 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-colors font-semibold text-sm"
                          >
                            <item.icon className="w-4 h-4" /> {item.label}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link
                        to={getDashboardRoute(user.role)}
                        className="flex items-center gap-3 px-4 py-2.5 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-colors font-semibold text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-red-500 hover:bg-red-50 transition-colors font-bold text-sm border-t border-neutral-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden lg:flex px-4 py-2 bg-neutral-900 hover:bg-orange-600 text-white text-sm font-black rounded-xl transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}