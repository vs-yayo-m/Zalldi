import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useClickOutside } from '@/hooks/useClickOutside';
import MobileMenu from './MobileMenu';
import { getDashboardRoute } from '@/utils/roleNavigation';

// Minimal role visuals for the compact header (badge + gradient class)
const ROLE_CONFIGS = {
  customer: {
    label: 'Customer',
    badge: '👤',
    gradient: 'from-blue-500 to-blue-600'
  },
  supplier: {
    label: 'Supplier',
    badge: '🏪',
    gradient: 'from-purple-500 to-purple-600'
  },
  admin: {
    label: 'Admin',
    badge: '👑',
    gradient: 'from-amber-400 to-amber-500'
  }
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const { items } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerBg, setHeaderBg] = useState('/header/bg-default.webp');

  const rootRef = useRef(null);
  useClickOutside(rootRef, () => {});

  // cart item count
  const cartCount = useMemo(() => items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0, [items]);

  // read user role config
  const role = user?.role || 'customer';
  const roleConfig = ROLE_CONFIGS[role] || ROLE_CONFIGS.customer;

  useEffect(() => {
    // allow quick customization by placing an image at /public/header/ and/or
    // set a custom URL in localStorage under key `zalldi_header_bg`
    try {
      const custom = localStorage.getItem('zalldi_header_bg');
      if (custom) setHeaderBg(custom);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleAccount = () => {
    if (user) {
      const route = getDashboardRoute(user.role);
      navigate(route);
    } else {
      navigate('/login');
    }
  };

  const goBack = () => navigate(-1);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm border-b border-neutral-100"
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* left cluster: back | menu | search */}
          <div className="flex items-center gap-2">
            {location.pathname !== '/' ? (
              <button
                onClick={goBack}
                aria-label="Back"
                className="p-2 rounded-lg hover:bg-neutral-100 transition"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-800" />
              </button>
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                className="p-2 rounded-lg hover:bg-neutral-100 transition lg:hidden"
                title="Menu"
              >
                <Menu className="w-5 h-5 text-neutral-800" />
              </button>
            )}

            <Link to="/search" aria-label="Search" className="p-2 rounded-lg hover:bg-neutral-100 transition">
              <Search className="w-5 h-5 text-neutral-800" />
            </Link>
          </div>

          {/* center: logo (always centered) */}
          <div className="flex-1 flex items-center justify-center pointer-events-none">
            <Link to="/" className="pointer-events-auto">
              <img
                src="/header/logo.svg"
                alt="Zalldi"
                className="h-8 lg:h-10 w-auto"
                onError={(e) => {
                  // fallback: simple wordmark
                  const el = e.currentTarget;
                  if (!el.dataset.fallback) {
                    el.dataset.fallback = '1';
                    const parent = el.parentElement;
                    parent.innerHTML = `
                      <div class=\"flex flex-col items-center leading-none\">
                        <span class=\"text-xl font-extrabold tracking-tight text-neutral-900\">Zalldi</span>
                        <span class=\"text-[9px] font-semibold text-neutral-500 uppercase tracking-widest\">Express</span>
                      </div>`;
                  }
                }}
              />
            </Link>
          </div>

          {/* right cluster: cart | user */}
          <div className="flex items-center gap-3">
            <Link to="/cart" aria-label="Cart" className="relative p-2 rounded-lg hover:bg-neutral-100 transition">
              <ShoppingCart className="w-5 h-5 text-neutral-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-4 text-[11px] font-bold bg-red-600 text-white rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleAccount}
              aria-label="Account"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition"
              title={user ? roleConfig.label : 'Login'}
            >
              <div className="w-8 h-8 rounded-md bg-white/30 flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(0,0,0,0.02))'}}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-md object-cover" />
                ) : (
                  <div className="text-lg">{roleConfig.badge}</div>
                )}
              </div>

              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[10px] font-semibold text-neutral-500">{user ? roleConfig.label : 'Guest'}</span>
                <span className="text-sm font-extrabold text-neutral-900 truncate max-w-[120px]">{user ? (user.displayName?.split(' ')[0] || user.email) : 'Login'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
