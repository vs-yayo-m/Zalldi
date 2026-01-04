// /src/pages/customer/Dashboard.jsx
import React, { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ShieldCheck,
  Truck,
  Star,
  Gift,
  ArrowUpRight,
  Bell,
  Settings,
  Sparkles
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrderCard from '@/components/customer/OrderCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingScreen from '@/components/shared/LoadingScreen';
import EmptyState from '@/components/shared/EmptyState';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import { ORDER_STATUS_LABELS } from '@/utils/constants';

/**
 * ANIMATION VARIANTS
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Greeting Logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Enterprise Stats Engine
  const stats = useMemo(() => {
    const defaultStats = {
      lifetimeOrders: 0,
      monthlyOrders: 0,
      activeDeliveries: 0,
      totalSavings: 0,
      walletBalance: user?.walletBalance || 0,
      totalSpent: 0,
      averageOrder: 0
    };

    if (!orders || orders.length === 0) return defaultStats;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlyOrders = 0;
    let activeDeliveries = 0;
    let totalSavings = 0;
    let totalSpent = 0;

    orders.forEach(order => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) monthlyOrders++;
      if (['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)) activeDeliveries++;
      totalSavings += (order.discount || 0);
      totalSpent += (order.total || 0);
    });

    return {
      lifetimeOrders: orders.length,
      monthlyOrders,
      activeDeliveries,
      totalSavings,
      walletBalance: user?.walletBalance || 0,
      totalSpent,
      averageOrder: orders.length > 0 ? totalSpent / orders.length : 0
    };
  }, [orders, user]);

  const activeOrders = useMemo(() => 
    orders?.filter(o => ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(o.status)) || []
  , [orders]);
  
  const recentOrders = useMemo(() => 
    orders?.slice(0, 3) || []
  , [orders]);

  if (authLoading || ordersLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-orange-100">
      <Header />
      
      <main className="relative pb-24 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-[100px] -z-10 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          
          {/* TOP BAR / GREETING */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center">
                            <Sparkles size={8} className="text-orange-500" />
                        </div>
                    ))}
                </div>
                <span className="text-[11px] font-black text-orange-600/80 uppercase tracking-[0.2em] leading-none">
                  Premium Experience
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none">
                {greeting}, <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {user.displayName?.split(' ')[0] || 'Explorer'}
                </span>
              </h1>
              <p className="text-neutral-500 font-medium text-lg">Your hyper-local marketplace summary.</p>
            </div>

            <div className="flex items-center gap-3">
               <button className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm text-neutral-400 hover:text-orange-500 hover:border-orange-100 transition-all">
                  <Bell size={22} />
               </button>
               <Button
                onClick={() => navigate('/shop')}
                className="h-14 bg-neutral-900 hover:bg-black text-white px-8 rounded-2xl font-black text-base flex items-center gap-3 shadow-2xl shadow-neutral-900/20 group transition-all"
               >
                <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                Shop Now
              </Button>
            </div>
          </motion.div>

          {/* STATS STRIP */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
          >
            <MetricCard 
              label="Orders" 
              value={stats.lifetimeOrders} 
              icon={<ShoppingBag />} 
              accent="text-blue-600"
              bg="bg-blue-50/50"
              subText={stats.monthlyOrders > 0 ? `+${stats.monthlyOrders} this month` : 'Start shopping'}
            />
            <MetricCard 
              label="Live Tracking" 
              value={stats.activeDeliveries} 
              icon={<Truck />} 
              accent="text-orange-500"
              bg="bg-orange-50/50"
              isLive={stats.activeDeliveries > 0}
              subText={stats.activeDeliveries > 0 ? "Tracking your delivery" : "No active orders"}
            />
            <MetricCard 
              label="Savings" 
              value={formatCurrency(stats.totalSavings)} 
              icon={<TrendingUp />} 
              accent="text-emerald-600"
              bg="bg-emerald-50/50"
              subText="Zalldi Gold savings"
            />
            <MetricCard 
              label="Wallet" 
              value={formatCurrency(stats.walletBalance)} 
              icon={<CreditCard />} 
              accent="text-purple-600"
              bg="bg-purple-50/50"
              subText="Available credits"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: ACTIVE & RECENT */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* LIVE DELIVERIES - BLINKIT STYLE */}
              <AnimatePresence>
                {activeOrders.length > 0 && (
                  <motion.section 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                            <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tighter italic">Live Tracking</h2>
                        </div>
                        <Badge className="bg-orange-500 text-white border-none text-[10px] font-black px-3 py-1">Priority</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {activeOrders.map((order) => (
                          <motion.div
                            key={order.id}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white rounded-[2rem] p-1 border-2 border-orange-100 shadow-xl shadow-orange-500/5 overflow-hidden group"
                          >
                            <Link to={`/customer/orders/${order.id}`} className="block p-5 sm:p-7">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                                            <Zap size={28} className="fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Coming in 60m</p>
                                            <h3 className="text-xl font-black text-neutral-900">Order #{order.orderNumber}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        <span className="text-xs font-black uppercase text-neutral-600">{ORDER_STATUS_LABELS[order.status]}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden mb-6">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '65%' }}
                                        className="absolute top-0 left-0 h-full bg-orange-500"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {order.items?.slice(0, 3).map((item, i) => (
                                            <img key={i} src={item.image} className="w-10 h-10 rounded-full border-4 border-white bg-neutral-50 object-cover shadow-sm" alt="" />
                                        ))}
                                        {order.items?.length > 3 && (
                                            <div className="w-10 h-10 rounded-full border-4 border-white bg-neutral-900 text-[10px] font-black text-white flex items-center justify-center">+{order.items.length-3}</div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-orange-600 font-black">
                                        View Details <ChevronRight size={18} />
                                    </div>
                                </div>
                            </Link>
                          </motion.div>
                        ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* RECENT ACTIVITY */}
              <div className="bg-white rounded-[2.5rem] p-1 shadow-sm border border-neutral-100">
                <div className="p-8 sm:p-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Purchase History</h2>
                            <p className="text-neutral-500 font-medium">Your most recent shopping trips</p>
                        </div>
                        <Link to="/customer/orders" className="text-sm font-black text-orange-600 hover:text-orange-700 underline underline-offset-4 decoration-2">
                            Explore full archive
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <EmptyState
                            icon={Package}
                            title="No History Yet"
                            description="Start your first order and it will appear here instantly."
                            action={{ label: 'Go to Shop', onClick: () => navigate('/shop') }}
                        />
                    ) : (
                        <div className="space-y-6">
                            {recentOrders.map((order, idx) => (
                                <motion.div 
                                    variants={itemVariants} 
                                    key={order.id}
                                    custom={idx}
                                >
                                    <OrderCard order={order} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: UTILITIES & MEMBERSHIP */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* NAVIGATION TILES */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] px-2">Account Hub</h3>
                <div className="grid grid-cols-2 gap-4">
                    <DashboardTile 
                        icon={<MapPin />} 
                        label="Addresses" 
                        sub={`${user.addresses?.length || 0} Saved`}
                        color="text-blue-600"
                        bg="bg-blue-50"
                        onClick={() => navigate('/customer/addresses')}
                    />
                    <DashboardTile 
                        icon={<Heart />} 
                        label="Favorites" 
                        sub="Wishlist"
                        color="text-rose-600"
                        bg="bg-rose-50"
                        onClick={() => navigate('/customer/wishlist')}
                    />
                    <DashboardTile 
                        icon={<Settings />} 
                        label="Settings" 
                        sub="Profile"
                        color="text-orange-600"
                        bg="bg-orange-50"
                        onClick={() => navigate('/customer/profile')}
                    />
                    <DashboardTile 
                        icon={<HelpCircle />} 
                        label="Support" 
                        sub="24/7 Help"
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                        onClick={() => navigate('/contact')}
                    />
                </div>
              </div>

              {/* MEMBERSHIP STATUS CARD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-neutral-900 rounded-[3rem] p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-orange-500/20">
                    <Gift size={120} className="rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
                            <Star size={20} className="fill-current" />
                        </div>
                        <div>
                            <h4 className="font-black text-xl uppercase tracking-tighter">Gold Tier</h4>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">VIP Member since 2025</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider italic">Total Investment</span>
                            <span className="text-lg font-black text-orange-500">{formatCurrency(stats.totalSpent)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider italic">Avg. Checkout</span>
                            <span className="text-lg font-black">{formatCurrency(stats.averageOrder)}</span>
                        </div>
                    </div>

                    <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300">
                        View Rewards
                    </button>
                </div>
              </motion.div>

              {/* TRUST BADGE */}
              <div className="p-8 rounded-[2.5rem] bg-neutral-50 border border-neutral-100 flex items-center gap-5 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-neutral-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h5 className="font-black text-neutral-900 uppercase tracking-tight text-sm">Zalldi Secure Pay</h5>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">PCI-DSS Level 1 Security</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

/**
 * SUB-COMPONENT: METRIC CARD
 */
const MetricCard = ({ label, value, icon, accent, bg, subText, isLive }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all relative overflow-hidden group cursor-default"
  >
    <div className={`w-12 h-12 ${bg} ${accent} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>
    
    <div className="space-y-1">
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] leading-none mb-1">
            {label}
        </p>
        <div className="flex items-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tighter italic">{value}</h3>
            {isLive && (
                <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </div>
            )}
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${accent}`}>
            {subText}
        </p>
    </div>
  </motion.div>
);

/**
 * SUB-COMPONENT: DASHBOARD TILE
 */
const DashboardTile = ({ icon, label, sub, color, bg, onClick }) => (
    <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-100 rounded-[2rem] hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all group w-full aspect-square"
    >
        <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-all duration-300`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="text-center">
            <p className="font-black text-neutral-900 text-sm uppercase tracking-tighter leading-none mb-1">{label}</p>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none">{sub}</p>
        </div>
    </motion.button>
);

