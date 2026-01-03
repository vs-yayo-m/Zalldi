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
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useSearch } from '@/hooks/useSearch';
import { useClickOutside } from '@/hooks/useClickOutside';

import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import Badge from '@/components/ui/Badge';
import Dropdown from '@/components/ui/Dropdown';

import { getDashboardRoute, getNavigationItems } from '@/utils/roleNavigation';

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

  const navItems = user ? getNavigationItems(user.role) : [];

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
            ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
            : 'bg-white border-b border-neutral-100 py-3 lg:py-4'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            <div className="flex items-center gap-4 lg:gap-10 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-orange-50 text-neutral-700 rounded-full transition-all"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <Link to="/" className="group flex items-center">
                  <motion.div
                    initial={false}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col leading-none"
                  >
                    <span className="font-black text-2xl lg:text-3xl tracking-tighter italic">
                      <span className="text-orange-500">ZAL</span>
                      <span className="text-neutral-900">LDI</span>
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-[0.2em] uppercase mt-[-2px] ml-1">
                      Express
                    </span>
                  </motion.div>
                </Link>
              </div>

              <div className="hidden xl:flex items-center gap-2 cursor-pointer group border-l border-neutral-200 pl-8">
                <div className="p-2 bg-orange-100 rounded-full text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-neutral-900 flex items-center gap-1 uppercase tracking-wider">
                    Delivery in 12 mins <ChevronDown className="w-3 h-3 text-orange-500" />
                  </span>
                  <span className="text-sm text-neutral-500 font-medium truncate max-w-[180px]">
                    HSR Layout, Sector 7, Bangalore...
                  </span>
                </div>
              </div>
            </div>

            <div ref={searchRef} className="hidden lg:block relative flex-1 max-w-2xl group">
              <div className={`relative flex items-center transition-all duration-300 rounded-xl overflow-hidden border-2 ${
                isSearchFocused 
                  ? 'bg-white border-orange-500 ring-4 ring-orange-500/10' 
                  : 'bg-neutral-100 border-transparent hover:bg-neutral-200/70'
              }`}>
                <div className="pl-4">
                  <Search className={`w-5 h-5 transition-colors ${isSearchFocused ? 'text-orange-500' : 'text-neutral-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder='Search "milk", "bread" or "detergent"'
                  className="w-full px-4 py-3 bg-transparent outline-none text-neutral-800 font-medium placeholder:text-neutral-400"
                  onFocus={() => setIsSearchFocused(true)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="pr-4 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    variants={searchDropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <History className="w-3 h-3" /> Recent Searches
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['Fresh Mango', 'Aashirvaad Atta', 'Amul Butter'].map((item) => (
                            <button key={item} className="px-3 py-1.5 bg-neutral-50 hover:bg-orange-50 text-neutral-600 hover:text-orange-600 rounded-lg text-sm font-medium transition-colors border border-neutral-100">
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" /> Trending Now
                        </h4>
                        <ul className="space-y-1">
                          {['Summer Drinks & Beverages', 'Organic Vegetables', 'Daily Essentials'].map((item) => (
                            <li key={item} className="group flex items-center justify-between p-2.5 hover:bg-neutral-50 rounded-xl cursor-pointer transition-colors">
                              <span className="text-neutral-700 font-medium group-hover:text-orange-600">{item}</span>
                              <ChevronDown className="w-4 h-4 text-neutral-300 -rotate-90" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 text-center">
                      <p className="text-xs text-orange-700 font-semibold italic">Save up to 50% on your first 3 orders!</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 lg:gap-5">
              <Link to="/search" className="lg:hidden p-2 text-neutral-700 hover:bg-orange-50 rounded-full">
                <Search className="w-6 h-6" />
              </Link>

              {user?.role === 'customer' && (
                <Link
                  to="/customer/wishlist"
                  className="hidden md:flex relative p-2.5 text-neutral-700 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all group"
                >
                  <Heart className="w-6 h-6 group-hover:fill-orange-500" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </Link>
              )}

              {user?.role === 'customer' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/cart')}
                  className="relative flex items-center gap-2 lg:gap-3 bg-orange-500 hover:bg-orange-600 text-white px-3 lg:px-5 py-2.5 rounded-xl shadow-lg shadow-orange-200 transition-all group"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                    <AnimatePresence>
                      {cartItemsCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-3 -right-3 bg-white text-orange-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-500 shadow-sm"
                        >
                          {cartItemsCount}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-[10px] font-bold opacity-80 uppercase">My Cart</span>
                    <span className="text-sm font-black">₹{cartTotal?.toLocaleString() || '0'}</span>
                  </div>
                </motion.button>
              )}

              {user ? (
                <div className="relative group">
                  <motion.button
                    onClick={handleAccountClick}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 cursor-pointer p-1 pr-2 hover:bg-neutral-50 rounded-full border border-transparent hover:border-neutral-100 transition-all"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div className="hidden lg:flex flex-col">
                      <span className="text-xs font-bold text-neutral-400">
                        {user.role === 'customer' ? 'Account' : 'Dashboard'}
                      </span>
                      <span className="text-sm font-black text-neutral-800 truncate max-w-[80px]">
                        {user.displayName?.split(' ')[0]}
                      </span>
                    </div>
                  </motion.button>
                  
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="px-4 py-3 border-b border-neutral-50 mb-2">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Welcome back!</p>
                      <p className="text-sm font-black text-neutral-800 truncate">{user.email}</p>
                    </div>
                    {user.role === 'customer' ? (
                      <>
                        {[
                          { icon: Package, label: 'My Orders', link: '/customer/orders' },
                          { icon: Heart, label: 'Wishlist', link: '/customer/wishlist' },
                          { icon: MapPin, label: 'Saved Addresses', link: '/customer/addresses' },
                          { icon: Bell, label: 'Notifications', link: '/customer/notifications' },
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
                        <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
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
                  className="hidden lg:flex px-6 py-2.5 bg-neutral-900 hover:bg-orange-600 text-white text-sm font-black rounded-xl transition-all shadow-lg hover:shadow-orange-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:block mt-2 border-t border-neutral-50 pt-2">
            <Navigation />
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