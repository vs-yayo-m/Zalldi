// src/pages/customer/Dashboard.jsx (PREMIUM - ENTERPRISE GRADE)

import { useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, MapPin, Heart, HelpCircle, ChevronRight, Clock, Zap, TrendingUp,
  ShoppingBag, Truck, Star, Gift, Calendar, CreditCard, Bell
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import { formatCurrency, formatRelativeTime, formatDate } from '@/utils/formatters'
import { ORDER_STATUS_LABELS } from '@/utils/constants'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { orders, activeOrders, completedOrders, loading: ordersLoading, totalOrders, activeCount } = useOrders()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  const stats = useMemo(() => {
    const totalSpent = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalSavings = completedOrders.reduce((sum, o) => sum + (o.discount || 0), 0)
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    
    return {
      totalOrders,
      activeOrders: activeCount,
      completedOrders: completedOrders.length,
      totalSpent,
      totalSavings,
      avgOrderValue,
      savedAddresses: user?.addresses?.length || 0,
      memberSince: user?.createdAt
    }
  }, [orders, totalOrders, activeCount, completedOrders, user])

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders])

  if (authLoading || ordersLoading) return <LoadingScreen />
  if (!user) return null

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-orange-50/30 pb-24 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Live Dashboard</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  {user.displayName?.split(' ')[0] || 'Friend'}
                </span>
              </h1>
              <p className="text-neutral-600 mt-2 text-lg">Ready to order? Your favorites are just a tap away</p>
            </div>
            
            <Button 
              onClick={() => navigate('/shop')} 
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-xl shadow-orange-200 px-8 py-4 rounded-2xl group"
            >
              <Zap size={20} className="mr-2 group-hover:animate-pulse" /> 
              <span className="font-black">Order Now</span>
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={ShoppingBag} 
              label="Total Orders" 
              value={stats.totalOrders}
              color="from-blue-500 to-blue-600"
              link="/customer/orders"
            />
            <StatCard 
              icon={Truck} 
              label="Active" 
              value={stats.activeOrders}
              color="from-orange-500 to-orange-600"
              pulse={stats.activeOrders > 0}
              link="/customer/orders?status=active"
            />
            <StatCard 
              icon={TrendingUp} 
              label="Total Spent" 
              value={formatCurrency(stats.totalSpent)}
              color="from-green-500 to-green-600"
            />
            <StatCard 
              icon={Gift} 
              label="Savings" 
              value={formatCurrency(stats.totalSavings)}
              color="from-purple-500 to-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-6">
              
              <AnimatePresence>
                {activeOrders.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl shadow-orange-200"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-widest">Live Tracking</span>
                        </div>
                        <h2 className="text-3xl font-black">Active Deliveries</h2>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="font-black text-lg">{activeOrders.length}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {activeOrders.slice(0, 2).map((order, idx) => (
                        <Link
                          key={order.id}
                          to={`/track/${order.id}`}
                          className="block bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 transition-all border border-white/20 group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-white/80 text-sm font-bold mb-1">Order #{order.orderNumber}</p>
                              <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span className="text-sm">{formatRelativeTime(order.createdAt)}</span>
                              </div>
                            </div>
                            <span className="bg-white text-orange-600 text-xs font-black px-3 py-1.5 rounded-full">
                              {ORDER_STATUS_LABELS[order.status]}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck size={18} />
                              <span className="text-sm font-medium">Track in real-time</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xl">{formatCurrency(order.total)}</span>
                              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {activeOrders.length > 2 && (
                      <Link 
                        to="/customer/orders?status=active"
                        className="block mt-4 text-center text-white/90 hover:text-white text-sm font-bold"
                      >
                        View all {activeOrders.length} active orders →
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-neutral-900">Recent Orders</h2>
                    <p className="text-neutral-600 text-sm mt-1">Your last 3 purchases</p>
                  </div>
                  {totalOrders > 0 && (
                    <Link to="/customer/orders" className="text-orange-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                      View All <ChevronRight size={16} />
                    </Link>
                  )}
                </div>

                {recentOrders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="Start shopping to see your order history"
                    action={{ label: 'Browse Products', onClick: () => navigate('/shop') }}
                  />
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order, idx) => (
                      <OrderCard key={order.id} order={order} index={idx} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 text-white overflow-hidden relative shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Member Status</p>
                      <p className="text-2xl font-black">Zalldi Premium</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <StatRow icon={Calendar} label="Member Since" value={formatDate(stats.memberSince?.toDate?.() || stats.memberSince, 'MMM yyyy')} />
                    <StatRow icon={ShoppingBag} label="Orders Placed" value={stats.totalOrders} />
                    <StatRow icon={CreditCard} label="Avg Order" value={formatCurrency(stats.avgOrderValue)} />
                    <StatRow icon={Gift} label="Total Saved" value={formatCurrency(stats.totalSavings)} highlight />
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
              </motion.div>

              <div className="space-y-3">
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest px-2">Quick Actions</h3>
                
                <QuickAction 
                  icon={MapPin} 
                  label="Addresses" 
                  count={stats.savedAddresses}
                  color="bg-blue-500"
                  to="/customer/addresses"
                />
                
                <QuickAction 
                  icon={Heart} 
                  label="Wishlist" 
                  color="bg-rose-500"
                  to="/customer/wishlist"
                />
                
                <QuickAction 
                  icon={Bell} 
                  label="Notifications" 
                  color="bg-purple-500"
                  to="/customer/settings"
                />
                
                <QuickAction 
                  icon={HelpCircle} 
                  label="Help & Support" 
                  color="bg-emerald-500"
                  to="/contact"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

const StatCard = ({ icon: Icon, label, value, color, pulse, link }) => (
  <Link to={link || '#'}>
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-xl hover:shadow-orange-100/20 transition-all h-full relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-5 rounded-full -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-3xl font-black text-neutral-900">{value}</p>
        
        {pulse && (
          <div className="absolute top-4 right-4">
            <div className="relative flex h-3 w-3">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <div className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  </Link>
)

const StatRow = ({ icon: Icon, label, value, highlight }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl ${highlight ? 'bg-orange-500/20' : 'bg-white/5'}`}>
    <div className="flex items-center gap-3">
      <Icon size={18} className={highlight ? 'text-orange-400' : 'text-white/60'} />
      <span className="text-sm font-medium text-white/80">{label}</span>
    </div>
    <span className={`font-black ${highlight ? 'text-orange-400' : 'text-white'}`}>{value}</span>
  </div>
)

const QuickAction = ({ icon: Icon, label, count, color, to }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ x: 4 }}
      className="bg-white rounded-2xl p-5 border border-neutral-100 hover:border-orange-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-black text-neutral-900">{label}</p>
            {count !== undefined && (
              <p className="text-sm text-neutral-600">{count} saved</p>
            )}
          </div>
        </div>
        <ChevronRight className="text-neutral-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  </Link>
)

const OrderCard = ({ order, index }) => (
  <Link to={`/customer/orders/${order.id}`}>
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-5 bg-neutral-50 hover:bg-orange-50 rounded-2xl transition-all border-2 border-transparent hover:border-orange-200 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-black text-neutral-900">#{order.orderNumber}</p>
          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
            <Clock size={12} /> {formatRelativeTime(order.createdAt)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">{order.items?.length || 0} items</span>
        <div className="flex items-center gap-2">
          <span className="font-black text-lg text-neutral-900">{formatCurrency(order.total)}</span>
          <ChevronRight className="text-neutral-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" size={18} />
        </div>
      </div>
    </motion.div>
  </Link>
)