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
  ArrowUpRight
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

  // Dynamic Greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Performance optimized stats calculation
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

    const lifetimeOrders = orders.length;
    let monthlyOrders = 0;
    let activeDeliveries = 0;
    let totalSavings = 0;
    let totalSpent = 0;

    orders.forEach(order => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        monthlyOrders++;
      }

      if (['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)) {
        activeDeliveries++;
      }

      totalSavings += (order.discount || 0);
      totalSpent += (order.total || 0);
    });

    return {
      lifetimeOrders,
      monthlyOrders,
      activeDeliveries,
      totalSavings,
      walletBalance: user?.walletBalance || 0,
      totalSpent,
      averageOrder: lifetimeOrders > 0 ? totalSpent / lifetimeOrders : 0
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
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#F8F9FA] pb-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Member Dashboard
                </span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {greeting}, <span className="text-orange-500">{user.displayName?.split(' ')[0] || 'Member'}!</span>
              </h1>
              <p className="text-gray-500 font-medium mt-1">Manage your orders and account details.</p>
            </div>

            <Button
              onClick={() => navigate('/shop')}
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-200/40 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 group transition-all"
            >
              <Zap size={20} className="fill-white group-hover:scale-110 transition-transform" />
              Start New Order
            </Button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatCard 
              label="Lifetime Orders" 
              value={stats.lifetimeOrders} 
              icon={<ShoppingBag />} 
              color="bg-blue-50 text-blue-600" 
              trend={stats.monthlyOrders > 0 ? `+${stats.monthlyOrders} this month` : null}
              link="/customer/orders"
            />
            <StatCard 
              label="Active Deliveries" 
              value={stats.activeDeliveries} 
              icon={<Truck />} 
              color="bg-orange-50 text-orange-600" 
              pulse={stats.activeDeliveries > 0}
              link="/customer/orders?status=active"
            />
            <StatCard 
              label="Total Savings" 
              value={formatCurrency(stats.totalSavings)} 
              icon={<TrendingUp />} 
              color="bg-green-50 text-green-600" 
              link="/customer/orders"
            />
            <StatCard 
              label="Wallet Balance" 
              value={formatCurrency(stats.walletBalance)} 
              icon={<CreditCard />} 
              color="bg-purple-50 text-purple-600" 
              link="/customer/wallet"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Content: Orders */}
            <div className="lg:col-span-8 space-y-8">
              
              <AnimatePresence>
                {activeOrders.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        Live Deliveries
                      </h2>
                      <Badge className="bg-orange-100 text-orange-600 border-none font-bold">
                        {activeOrders.length} In Progress
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {activeOrders.map((order) => (
                        <Link
                          key={order.id}
                          to={`/customer/orders/${order.id}`}
                          className="block bg-white rounded-[2rem] p-6 border border-transparent hover:border-orange-100 hover:shadow-lg transition-all group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">
                                Order #{order.orderNumber}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                {formatRelativeTime(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt)}
                              </div>
                            </div>
                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                              {ORDER_STATUS_LABELS[order.status]}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-3">
                              {order.items?.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 overflow-hidden shadow-sm">
                                  {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                                </div>
                              ))}
                              {order.items?.length > 4 && (
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                  +{order.items.length - 4}
                                </div>
                              )}
                            </div>
                            <p className="text-xl font-black text-neutral-900">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Orders</h2>
                    <p className="text-sm text-gray-500 font-medium">Tracking your last 3 purchases</p>
                  </div>
                  {recentOrders.length > 0 && (
                    <Link
                      to="/customer/orders"
                      className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                    >
                      View All History <ChevronRight size={16} />
                    </Link>
                  )}
                </div>

                {recentOrders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="When you shop, your order history will appear here."
                    action={{ label: 'Go Shopping', onClick: () => navigate('/shop') }}
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

            {/* Sidebar: Navigation Tiles & Membership */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-xl font-black text-gray-900 px-2 uppercase tracking-tight">Quick Access</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <NavTile 
                  onClick={() => navigate('/customer/addresses')}
                  icon={<MapPin size={24} />}
                  label="Addresses"
                  sub={`${user.addresses?.length || 0} saved`}
                  color="bg-blue-500"
                />
                <NavTile 
                  onClick={() => navigate('/customer/wishlist')}
                  icon={<Heart size={24} />}
                  label="Wishlist"
                  sub="Your Favs"
                  color="bg-rose-500"
                />
                <NavTile 
                  onClick={() => navigate('/customer/profile')}
                  icon={<User size={24} />}
                  label="Profile"
                  sub="Edit Settings"
                  color="bg-orange-500"
                />
                <NavTile 
                  onClick={() => navigate('/contact')}
                  icon={<HelpCircle size={24} />}
                  label="Support"
                  sub="24/7 Help"
                  color="bg-emerald-600"
                />
              </div>

              {/* Membership Insight Card */}
              {stats.lifetimeOrders > 0 && (
                <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="bg-orange-500/20 text-orange-500 p-3 rounded-2xl w-fit mb-6">
                        <Gift size={28} />
                    </div>
                    <h4 className="font-black text-2xl uppercase tracking-tighter mb-4">Zalldi Gold</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-neutral-400 text-xs font-bold uppercase">Total Spent</span>
                        <span className="font-black text-orange-500">{formatCurrency(stats.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-neutral-400 text-xs font-bold uppercase">Average Order</span>
                        <span className="font-black">{formatCurrency(stats.averageOrder)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 text-xs font-bold uppercase">Member Since</span>
                        <span className="font-black">
                          {new Date(user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all duration-700" />
                </div>
              )}

              {/* Secure Payments Info */}
              <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-black text-neutral-900 text-sm uppercase">Zalldi Secure</h4>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">PCI Compliant Payments</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}

const StatCard = ({ label, value, icon, color, trend, pulse, link }) => (
  <Link to={link || '#'} className="block">
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/10 transition-all cursor-pointer h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} shadow-sm`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {pulse && (
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
          </span>
        )}
      </div>
      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{value}</h3>
      {trend && (
        <p className="text-[10px] font-bold mt-2 flex items-center gap-1 text-green-600">
          <ArrowUpRight size={12} />
          {trend}
        </p>
      )}
    </motion.div>
  </Link>
);

const NavTile = ({ onClick, icon, label, sub, color }) => (
  <button
    onClick={onClick}
    className="p-5 rounded-[2rem] bg-white border border-gray-100 text-left hover:border-orange-200 hover:shadow-lg transition-all group flex flex-col h-full"
  >
    <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="mt-auto">
      <p className="font-black text-neutral-900 text-sm uppercase tracking-tight leading-tight">{label}</p>
      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-1">{sub}</p>
    </div>
  </button>
);

