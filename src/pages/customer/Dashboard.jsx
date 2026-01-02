import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  MapPin, 
  User, 
  Clock, 
  ChevronRight, 
  Zap, 
  Heart, 
  HelpCircle,
  TrendingUp,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

// Existing project architecture imports
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/customer/OrderCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingScreen from '../../components/shared/LoadingScreen';
import EmptyState from '../../components/shared/EmptyState';
import { formatCurrency } from '../../utils/formatters';

/**
 * ZALLDI - Enterprise Customer Dashboard
 * Features: Time-based greetings, Bento-grid navigation, Live order prioritization.
 */

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, getActiveOrders } = useOrders({ limitCount: 10 });

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Dynamic Time-based Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  if (authLoading || ordersLoading) return <LoadingScreen />;
  if (!user) return null;

  const activeOrders = getActiveOrders();
  const recentOrders = orders?.slice(0, 3) || [];
  const totalSpent = user.totalSpent || 0;
  const totalOrders = user.orderCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9FA] pb-24 pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Welcome & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                Member Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {greeting}, <span className="text-orange-500">{user.displayName?.split(' ')[0] || 'Member'}!</span>
            </h1>
            <p className="text-gray-500 font-medium">Here's what's happening with your account today.</p>
          </motion.div>

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Button
              onClick={() => navigate('/shop')}
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-200 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 group"
            >
              <Zap size={20} className="fill-white group-hover:scale-125 transition-transform" />
              Start New Order
            </Button>
          </motion.div>
        </div>

        {/* STATS OVERVIEW GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard 
            label="Lifetime Orders" 
            value={totalOrders} 
            icon={<ShoppingBag />} 
            color="bg-blue-50 text-blue-600" 
            trend="+2 this month"
          />
          <StatCard 
            label="Active Deliveries" 
            value={activeOrders.length} 
            icon={<TruckIcon />} 
            color="bg-orange-50 text-orange-600" 
            pulse={activeOrders.length > 0}
          />
          <StatCard 
            label="Zalldi Savings" 
            value={formatCurrency(totalSpent * 0.1)} 
            icon={<TrendingUp />} 
            color="bg-green-50 text-green-600" 
          />
          <StatCard 
            label="Wallet Balance" 
            value={formatCurrency(user.walletBalance || 0)} 
            icon={<CreditCard />} 
            color="bg-purple-50 text-purple-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Orders Tracking */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Priority Section: Active Orders */}
            <AnimatePresence>
              {activeOrders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                      Ongoing Deliveries
                    </h2>
                    <Badge className="bg-orange-100 text-orange-600 border-none font-bold">
                      {activeOrders.length} Order{activeOrders.length > 1 ? 's' : ''} Moving
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <OrderCard key={order.id} order={order} variant="compact" />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Recent History */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Recent History</h2>
                  <p className="text-sm text-gray-500 font-medium">Your last 3 orders at Zalldi</p>
                </div>
                <button 
                  onClick={() => navigate('/customer/orders')}
                  className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                >
                  See All <ChevronRight size={16} />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No past orders"
                  description="Your order history is currently empty. Let's fill it with fresh groceries!"
                  actionLabel="Explore Shop"
                  onAction={() => navigate('/shop')}
                />
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Bento Navigation & Profile */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl font-black text-gray-900 mb-4 px-2">Quick Access</h2>
            
            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              <NavTile 
                onClick={() => navigate('/customer/addresses')}
                icon={<MapPin size={24} />}
                label="Saved Addresses"
                sub="Home, Work..."
                color="bg-blue-500"
              />
              <NavTile 
                onClick={() => navigate('/customer/wishlist')}
                icon={<Heart size={24} />}
                label="My Wishlist"
                sub="Quick Reorder"
                color="bg-red-500"
              />
              <NavTile 
                onClick={() => navigate('/customer/profile')}
                icon={<User size={24} />}
                label="Account Info"
                sub="Edit Profile"
                color="bg-orange-500"
              />
              <NavTile 
                onClick={() => navigate('/static/support')}
                icon={<HelpCircle size={24} />}
                label="Help Center"
                sub="24/7 Support"
                color="bg-green-600"
              />
            </div>

            {/* Loyalty/Security Banner */}
            <div className="mt-8 bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <ShieldCheck className="text-orange-500 mb-3" size={32} />
                <h4 className="font-bold text-lg mb-1">Zalldi Protect</h4>
                <p className="text-xs text-gray-400 mb-4">Your data and payments are secured with enterprise-grade encryption.</p>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-orange-500" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

/**
 * Enterprise Stat Card with Trend/Pulse Support
 */
const StatCard = ({ label, value, icon, color, trend, pulse }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/20 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      {pulse && (
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
      )}
    </div>
    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-2xl font-black text-gray-900">{value}</h3>
    {trend && <p className="text-[10px] font-bold text-green-600 mt-2">{trend}</p>}
  </motion.div>
);

/**
 * Bento Grid Tile for Navigation
 */
const NavTile = ({ onClick, icon, label, sub, color }) => (
  <button
    onClick={onClick}
    className="p-5 rounded-3xl bg-white border border-gray-100 text-left hover:border-orange-200 hover:shadow-lg transition-all group"
  >
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="font-black text-gray-900 text-sm leading-tight">{label}</p>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{sub}</p>
  </button>
);

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export default CustomerDashboard;

