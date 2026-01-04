// src/pages/customer/Dashboard.jsx

import React, { useEffect, useMemo, useState } from 'react';
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
  TrendingDown
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log('Dashboard - Orders:', orders);
  console.log('Dashboard - User:', user);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const stats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        lifetimeOrders: 0,
        monthlyOrders: 0,
        activeDeliveries: 0,
        totalSavings: 0,
        walletBalance: user?.walletBalance || 0,
        totalSpent: 0,
        averageOrder: 0
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lifetimeOrders = orders.length;

    const monthlyOrders = orders.filter(order => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    }).length;

    const activeDeliveries = orders.filter(order => 
      ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
    ).length;

    const totalSavings = orders.reduce((sum, order) => sum + (order.discount || 0), 0);
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrder = lifetimeOrders > 0 ? totalSpent / lifetimeOrders : 0;

    return {
      lifetimeOrders,
      monthlyOrders,
      activeDeliveries,
      totalSavings,
      walletBalance: user?.walletBalance || 0,
      totalSpent,
      averageOrder
    };
  }, [orders, user]);

  const activeOrders = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return orders.filter(order => 
      ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
    );
  }, [orders]);
  
  const recentOrders = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return orders.slice(0, 3);
  }, [orders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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
              <p className="text-gray-500 font-medium mt-1">Here's what's happening with your account today.</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatCard 
              label="Lifetime Orders" 
              value={stats.lifetimeOrders} 
              icon={<ShoppingBag />} 
              color="bg-blue-50 text-blue-600" 
              trend={stats.monthlyOrders > 0 ? `+${stats.monthlyOrders} this month` : 'No orders this month'}
              trendUp={stats.monthlyOrders > 0}
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
              label="Zalldi Savings" 
              value={formatCurrency(stats.totalSavings)} 
              icon={<TrendingUp />} 
              color="bg-green-50 text-green-600" 
              trend="Total saved"
              link="/customer/orders"
            />
            <StatCard 
              label="Wallet Balance" 
              value={formatCurrency(stats.walletBalance)} 
              icon={<CreditCard />} 
              color="bg-purple-50 text-purple-600" 
              trend="Add money"
              link="/customer/wallet"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-8">
              
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
                        <Link
                          key={order.id}
                          to={`/customer/orders/${order.id}`}
                          className="block bg-white rounded-2xl p-6 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm font-bold text-neutral-500 mb-1">
                                Order #{order.orderNumber}
                              </p>
                              <p className="text-xs text-neutral-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt)}
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                              {ORDER_STATUS_LABELS[order.status]}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mb-4">
                            {order.items?.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-neutral-600 font-medium">
                              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-lg font-black text-neutral-900">
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
                    <h2 className="text-2xl font-black text-gray-900">Recent History</h2>
                    <p className="text-sm text-gray-500 font-medium">Your last 3 orders at Zalldi</p>
                  </div>
                  {recentOrders.length > 0 && (
                    <Link
                      to="/customer/orders"
                      className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                    >
                      See All <ChevronRight size={16} />
                    </Link>
                  )}
                </div>

                {recentOrders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No past orders"
                    description="Your order history is currently empty. Let's fill it with fresh groceries!"
                    action={{
                      label: 'Explore Shop',
                      onClick: () => navigate('/shop')
                    }}
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

            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-xl font-black text-gray-900 mb-4 px-2">Quick Access</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <NavTile 
                  onClick={() => navigate('/customer/addresses')}
                  icon={<MapPin size={24} />}
                  label="Saved Addresses"
                  sub={`${user.addresses?.length || 0} saved`}
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
                  onClick={() => navigate('/contact')}
                  icon={<HelpCircle size={24} />}
                  label="Help Center"
                  sub="24/7 Support"
                  color="bg-green-600"
                />
              </div>

              {stats.lifetimeOrders > 0 && (
                <div className="mt-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] p-6 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <Gift className="mb-3" size={32} />
                    <h4 className="font-bold text-lg mb-1">Member Insights</h4>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-100 text-sm">Total Spent</span>
                        <span className="font-black">{formatCurrency(stats.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-100 text-sm">Average Order</span>
                        <span className="font-black">{formatCurrency(stats.averageOrder)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-100 text-sm">Member Since</span>
                        <span className="font-black text-sm">
                          {new Date(user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>
              )}

              <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
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
      <Footer />
    </>
  );
}

const StatCard = ({ label, value, icon, color, trend, pulse, trendUp, link }) => (
  <div onClick={() => link && window.location.href !== link && (window.location.href = link)} className="cursor-pointer">
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
      {trend && (
        <p className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${trendUp !== false ? 'text-green-600' : 'text-gray-400'}`}>
          {trendUp !== false && <ArrowUpRight size={12} />}
          {trend}
        </p>
      )}
    </motion.div>
  </div>
);

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