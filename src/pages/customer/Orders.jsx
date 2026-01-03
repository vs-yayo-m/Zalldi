import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Search, 
  Filter, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Truck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

// Existing project architecture imports
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/customer/OrderCard';
import Tabs from '../../components/ui/Tabs';
import LoadingScreen from '../../components/shared/LoadingScreen';
import EmptyState from '../../components/shared/EmptyState';
import Button from '../../components/ui/Button';

/**
 * ZALLDI - Enterprise Order Management Hub
 * Enhanced with dynamic filtering, micro-animations, and production-grade UX patterns.
 */

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, getActiveOrders, getCompletedOrders, getCancelledOrders } = useOrders();
  
  // Local UI State
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Auth Guard: Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/orders', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Performance Optimization: Memoize filtered results to prevent re-renders
  const filteredOrders = useMemo(() => {
    let baseOrders = [];
    switch (activeTab) {
      case 'active': baseOrders = getActiveOrders(); break;
      case 'completed': baseOrders = getCompletedOrders(); break;
      case 'cancelled': baseOrders = getCancelledOrders(); break;
      default: baseOrders = orders || [];
    }

    if (!searchQuery) return baseOrders;
    
    return baseOrders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeTab, orders, searchQuery, getActiveOrders, getCompletedOrders, getCancelledOrders]);

  // Tab configuration with live counts
  const tabs = [
    { id: 'all', label: 'All', icon: <Package size={16} />, count: orders?.length || 0 },
    { id: 'active', label: 'Active', icon: <Truck size={16} />, count: getActiveOrders().length },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={16} />, count: getCompletedOrders().length },
    { id: 'cancelled', label: 'Cancelled', icon: <XCircle size={16} />, count: getCancelledOrders().length }
  ];

  if (authLoading || ordersLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9FA] pb-20 pt-24"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-bold text-sm mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Order <span className="text-orange-500">History</span>
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Track, manage and reorder your essentials</p>
          </motion.div>

          {/* Inline Stats Summary */}
          <div className="hidden lg:flex gap-4">
            <QuickStat icon={<Clock className="text-blue-500" />} label="Ongoing" value={getActiveOrders().length} />
            <QuickStat icon={<ShoppingBag className="text-orange-500" />} label="Total Spend" value={`₹${user?.totalSpend || 0}`} />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by Order ID or Product Name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                  activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-pill" className="absolute inset-0 border-2 border-orange-500/10 rounded-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Feed */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-12"
              >
                <EmptyState
                  icon={Package}
                  title={searchQuery ? "No matching orders found" : `No ${activeTab === 'all' ? '' : activeTab} orders yet`}
                  description={
                    searchQuery 
                    ? "Try checking the order ID or search for a different product."
                    : "Your kitchen is waiting! Explore our fresh collection and start your first order."
                  }
                  actionLabel="Start Shopping"
                  onAction={() => navigate('/shop')}
                />
              </motion.div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <OrderCard order={order} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Support CTA */}
        {filteredOrders.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 p-8 bg-white rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <Package size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Having trouble with an order?</h4>
                <p className="text-sm text-gray-500">Our 24/7 support team is here to help you.</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full md:w-auto rounded-2xl font-bold border-gray-200 hover:bg-orange-50 hover:border-orange-200"
              onClick={() => navigate('/static/support')}
            >
              Contact Support
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Enterprise Stat Component for Header
 */
const QuickStat = ({ icon, label, value }) => (
  <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-lg font-black text-gray-900 leading-none">{value}</p>
    </div>
  </div>
);

export default Orders;

