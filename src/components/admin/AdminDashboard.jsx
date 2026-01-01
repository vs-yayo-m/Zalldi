import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';

// Configuration & Icons
import { db } from '@/config/firebase';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Activity,
  Zap,
  RefreshCw,
  Bell,
  Search,
  LayoutGrid
} from 'lucide-react';

// Sub-components & UI
import ExecutiveMetrics from './ExecutiveMetrics';
import LiveOrderFeed from './LiveOrderFeed';
import PlatformHealth from './PlatformHealth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * ZALLDI COMMAND CENTER (ADMIN DASHBOARD)
 * An enterprise-grade mission control for platform administrators.
 */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    activeCustomers: 0,
    activeSuppliers: 0,
    pendingOrders: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Setup Real-time Listeners
  useEffect(() => {
    loadDashboardData();
    
    // Live stream for recent orders
    const unsubscribe = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(15)),
      (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentActivity(activities);
      },
      (error) => console.error("Snapshot error:", error)
    );

    return () => unsubscribe();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Batch queries for performance
      const [
        todayOrdersSnap,
        yesterdayOrdersSnap,
        customersSnap,
        suppliersSnap,
        pendingOrdersSnap,
        productsSnap
      ] = await Promise.all([
        getDocs(query(collection(db, 'orders'), where('createdAt', '>=', today))),
        getDocs(query(collection(db, 'orders'), where('createdAt', '>=', yesterday), where('createdAt', '<', today))),
        getDocs(query(collection(db, 'users'), where('role', '==', 'customer'))),
        getDocs(query(collection(db, 'users'), where('role', '==', 'supplier'), where('verified', '==', true))),
        getDocs(query(collection(db, 'orders'), where('status', 'in', ['pending', 'confirmed']))),
        getDocs(collection(db, 'products'))
      ]);

      const todayRevenue = todayOrdersSnap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
      const yesterdayRevenue = yesterdayOrdersSnap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
      
      const revenueGrowth = yesterdayRevenue > 0 
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
        : 0;

      const ordersGrowth = yesterdayOrdersSnap.size > 0 
        ? ((todayOrdersSnap.size - yesterdayOrdersSnap.size) / yesterdayOrdersSnap.size) * 100 
        : 0;

      // Active customers logic (placed order in last 30 days)
      const activeCustomersCount = customersSnap.docs.filter(doc => {
        const lastOrder = doc.data().lastOrderDate?.toDate();
        if (!lastOrder) return false;
        const daysSince = (new Date() - lastOrder) / (1000 * 60 * 60 * 24);
        return daysSince <= 30;
      }).length;

      setMetrics({
        todayRevenue,
        todayOrders: todayOrdersSnap.size,
        activeCustomers: activeCustomersCount,
        activeSuppliers: suppliersSnap.size,
        pendingOrders: pendingOrdersSnap.size,
        totalProducts: productsSnap.size,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10
      });

      // Generate context-aware alerts
      const criticalAlerts = [];
      if (pendingOrdersSnap.size > 15) {
        criticalAlerts.push({
          id: 'orders-pending',
          type: 'warning',
          title: 'High Order Volume',
          message: `${pendingOrdersSnap.size} orders are pending confirmation. Dispatch teams are approaching capacity.`,
          actionLabel: 'Prioritize Orders',
          action: () => navigate('/admin/orders?status=pending')
        });
      }

      const lowStockCount = productsSnap.docs.filter(doc => (doc.data().stock || 0) < 5).length;
      if (lowStockCount > 0) {
        criticalAlerts.push({
          id: 'stock-alert',
          type: 'info',
          title: 'Inventory Warning',
          message: `${lowStockCount} essential items are critically low on stock.`,
          actionLabel: 'Restock Now',
          action: () => navigate('/admin/products?filter=low-stock')
        });
      }

      setAlerts(criticalAlerts);
    } catch (error) {
      console.error('Master load error:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const statCards = useMemo(() => [
    {
      title: "Today's Revenue",
      value: formatCurrency(metrics.todayRevenue),
      change: metrics.revenueGrowth,
      icon: DollarSign,
      color: "orange",
      description: "Gross revenue generated today"
    },
    {
      title: "Active Orders",
      value: metrics.todayOrders,
      change: metrics.ordersGrowth,
      icon: ShoppingCart,
      color: "blue",
      description: "Total order volume today"
    },
    {
      title: 'Active Customers',
      value: metrics.activeCustomers,
      icon: Users,
      color: "emerald",
      description: "Customers active in last 30d"
    },
    {
      title: 'Live Inventory',
      value: metrics.totalProducts,
      icon: Package,
      color: "purple",
      description: `Managed by ${metrics.activeSuppliers} suppliers`
    }
  ], [metrics]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" />
        </div>
        <p className="text-neutral-500 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Synchronizing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        
        {/* 1. Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500 rounded-lg text-white">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                Platform Overview
              </h1>
            </div>
            <div className="flex items-center gap-3 text-neutral-500 text-sm font-medium">
              <Activity className="w-4 h-4 text-orange-500" />
              <span>Real-time Operations Hub</span>
              <span className="text-neutral-300">•</span>
              <span>{formatDate(new Date(), 'EEEE, MMMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={loadDashboardData}
              className={`p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5 text-neutral-600" />
            </button>
            <Button 
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-neutral-200"
              onClick={() => navigate('/admin/reports')}
            >
              Generate Report
            </Button>
          </div>
        </div>

        {/* 2. Intelligent Alerts Section */}
        <AnimatePresence>
          {alerts.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-8 space-y-3"
            >
              {alerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className={`p-4 border-l-4 overflow-hidden relative ${
                    alert.type === 'warning' 
                      ? 'border-amber-500 bg-amber-50/50' 
                      : 'border-blue-500 bg-blue-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-neutral-900 uppercase tracking-wider">{alert.title}</p>
                        <p className="text-sm text-neutral-600 font-medium">{alert.message}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50 h-9 font-bold px-4 rounded-lg flex items-center gap-2"
                      onClick={alert.action}
                    >
                      {alert.actionLabel} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 relative overflow-hidden group hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.change !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black ${
                      stat.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-400 font-medium">
                    {stat.description}
                  </p>
                </div>
                {/* Visual Accent */}
                <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon className="w-24 h-24" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 4. Core Visuals Section */}
        <div className="mb-10">
          <ExecutiveMetrics metrics={metrics} />
        </div>

        {/* 5. Live Feed & Health Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LiveOrderFeed orders={recentActivity} />
          </div>
          <div className="space-y-8">
            <PlatformHealth />
            
            {/* Quick Actions Panel */}
            <Card className="p-6 bg-neutral-900 border-none shadow-2xl">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Quick Operations
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Dispatch Center', icon: ShoppingCart, to: '/admin/orders' },
                  { label: 'Inventory Manager', icon: Package, to: '/admin/products' },
                  { label: 'Customer Support', icon: Users, to: '/admin/support' },
                  { label: 'Search System', icon: Search, to: '/admin/search' }
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.to)}
                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className="w-5 h-5 text-neutral-500 group-hover:text-orange-500" />
                      <span className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">{action.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

