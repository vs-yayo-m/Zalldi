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
  Crown,
  Store,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useClickOutside } from '@/hooks/useClickOutside';

import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

import { getDashboardRoute } from '@/utils/roleNavigation';

const RoleIcon = ({ role, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const roleConfig = {
    admin: {
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
      label: 'Admin'
    },
    supplier: {
      icon: Store,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
      label: 'Supplier'
    },
    customer: {
      icon: User,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      label: 'Customer'
    }
  };

  const config = roleConfig[role] || roleConfig.customer;
  const IconComponent = config.icon;

  return <IconComponent className={`${sizes[size]} ${config.textColor}`} />;
};

const UserAvatar = ({ user }) => {
  const roleConfig = {
    admin: 'from-purple-500 to-pink-500',
    supplier: 'from-blue-500 to-cyan-500',
    customer: 'from-orange-500 to-orange-600'
  };

  const gradient = roleConfig[user?.role] || roleConfig.customer;

  if (user?.photoURL) {
    return (
      <div className="relative">
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-lg"
        />
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center ring-2 ring-white shadow-sm`}>
          <RoleIcon role={user.role} size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black shadow-lg ring-2 ring-white`}>
      {user?.displayName?.[0]?.toUpperCase() || 'U'}
    </div>
  );
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

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const searchDropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { label: 'Admin', color: 'from-purple-500 to-pink-500', textColor: 'text-purple-600' },
      supplier: { label: 'Supplier', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-600' },
      customer: { label: 'Member', color: 'from-orange-500 to-orange-600', textColor: 'text-orange-600' }
    };
    return badges[role] || badges.customer;
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg py-2' 
            : 'bg-white py-3'
        }`}
        style={{
          backgroundImage: isScrolled ? 'none' : 'url(/header/header-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            
            {/* LEFT: Back + Menu */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackClick}
                className="p-2.5 hover:bg-orange-50 text-neutral-700 hover:text-orange-600 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 hover:bg-orange-50 text-neutral-700 hover:text-orange-600 rounded-xl transition-all"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>

            {/* CENTER: Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <img
                  src="/header/logo.png"
                  alt="Zalldi"
                  className="h-10 md:h-12 w-auto drop-shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex flex-col items-center"><span class="font-black text-2xl md:text-3xl tracking-tighter"><span class="text-orange-500">ZAL</span><span class="text-neutral-900">LDI</span></span><span class="text-[8px] font-bold text-neutral-400 tracking-[0.2em] uppercase">Express</span></div>';
                  }}
                />
              </motion.div>
            </Link>

            {/* RIGHT: Search + Cart + User */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="p-2.5 hover:bg-orange-50 text-neutral-700 hover:text-orange-600 rounded-xl transition-all"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {user?.role === 'customer' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cart')}
                  className="relative p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white"
                    >
                      {cartItemsCount}
                    </motion.div>
                  )}
                </motion.button>
              )}

              {user ? (
                <div className="relative group">
                  <motion.button
                    onClick={handleAccountClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 hover:bg-neutral-50 rounded-xl transition-all"
                  >
                    <UserAvatar user={user} />
                  </motion.button>
                  
                  {/* Desktop Dropdown */}
                  <div className="hidden md:block absolute top-full right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className={`p-6 bg-gradient-to-br ${roleBadge.color} text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          <UserAvatar user={user} />
                          <div>
                            <p className="font-black text-lg">{user.displayName?.split(' ')[0] || 'User'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <RoleIcon role={user.role} size="sm" />
                              <span className="text-xs font-bold opacity-90">{roleBadge.label}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs opacity-80 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="p-2">
                      {user.role === 'customer' ? (
                        <>
                          {[
                            { icon: Package, label: 'My Orders', link: '/customer/orders' },
                            { icon: Heart, label: 'Wishlist', link: '/customer/wishlist' },
                            { icon: Bell, label: 'Notifications', link: '/customer/notifications' },
                            { icon: Settings, label: 'Settings', link: '/customer/settings' },
                          ].map((item) => (
                            <Link 
                              key={item.label} 
                              to={item.link} 
                              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all font-semibold text-sm group"
                            >
                              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                              {item.label}
                            </Link>
                          ))}
                        </>
                      ) : (
                        <Link
                          to={getDashboardRoute(user.role)}
                          className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all font-semibold text-sm group"
                        >
                          <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                          Go to Dashboard
                        </Link>
                      )}

                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm border-t border-neutral-100 group"
                      >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30"
                >
                  <User className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block mt-3 pt-3 border-t border-neutral-100">
            <Navigation />
          </div>
        </div>
      </header>

      {/* Search Modal for Desktop */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden lg:flex items-start justify-center pt-24"
            onClick={() => setIsSearchFocused(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mx-4"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-6 h-6 text-orange-500" />
                  <input
                    type="text"
                    placeholder='Search products, categories...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 text-xl font-semibold outline-none"
                  />
                  <button onClick={() => setIsSearchFocused(false)}>
                    <X className="w-6 h-6 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <History className="w-4 h-4" /> Recent
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Fresh Mango', 'Atta', 'Amul Butter'].map((item) => (
                        <button key={item} className="px-4 py-2 bg-neutral-50 hover:bg-orange-50 text-neutral-700 hover:text-orange-600 rounded-xl text-sm font-semibold transition-all">
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Trending
                    </h4>
                    <div className="space-y-1">
                      {['Summer Drinks', 'Organic Vegetables', 'Daily Essentials'].map((item) => (
                        <button key={item} className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-xl font-semibold text-neutral-700 hover:text-orange-600 transition-all">
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-center">
                <p className="text-sm text-white font-bold">Save up to 50% on your first 3 orders! 🎉</p>
              </div>
            </motion.div>
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