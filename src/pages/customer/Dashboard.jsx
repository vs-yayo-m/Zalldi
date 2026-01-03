// src/pages/customer/Dashboard.jsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  Truck,
  PiggyBank,
  Wallet,
  TrendingUp,
  MapPin,
  Clock,
  ShoppingBag,
  Heart,
  ChevronRight,
  Star,
  Gift
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/formatters'
import { ORDER_STATUS_LABELS } from '@/utils/constants'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { orders, loading: ordersLoading } = useOrders()
  const [stats, setStats] = useState({
    lifetimeOrders: 0,
    monthlyOrders: 0,
    activeDeliveries: 0,
    totalSavings: 0,
    walletBalance: 0
  })

  useEffect(() => {
    if (orders && orders.length > 0) {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const lifetimeOrders = orders.length

      const monthlyOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      }).length

      const activeDeliveries = orders.filter(order => 
        ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
      ).length

      const totalSavings = orders.reduce((sum, order) => {
        return sum + (order.discount || 0)
      }, 0)

      const walletBalance = user?.walletBalance || 0

      setStats({
        lifetimeOrders,
        monthlyOrders,
        activeDeliveries,
        totalSavings,
        walletBalance
      })
    }
  }, [orders, user])

  const recentOrders = orders?.slice(0, 3) || []

  const statsCards = [
    {
      label: 'Lifetime Orders',
      value: stats.lifetimeOrders,
      change: `+${stats.monthlyOrders} this month`,
      icon: Package,
      color: 'orange',
      link: '/customer/orders'
    },
    {
      label: 'Active Deliveries',
      value: stats.activeDeliveries,
      change: 'Track in real-time',
      icon: Truck,
      color: 'blue',
      link: '/customer/orders?status=active'
    },
    {
      label: 'Zalldi Savings',
      value: formatCurrency(stats.totalSavings),
      change: 'Total saved',
      icon: PiggyBank,
      color: 'green',
      link: '/customer/orders'
    },
    {
      label: 'Wallet Balance',
      value: formatCurrency(stats.walletBalance),
      change: 'Add money',
      icon: Wallet,
      color: 'purple',
      link: '/customer/wallet'
    }
  ]

  const quickActions = [
    { icon: ShoppingBag, label: 'Shop Now', link: '/shop', color: 'orange' },
    { icon: Package, label: 'My Orders', link: '/customer/orders', color: 'blue' },
    { icon: Heart, label: 'Wishlist', link: '/customer/wishlist', color: 'red' },
    { icon: MapPin, label: 'Addresses', link: '/customer/addresses', color: 'green' }
  ]

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      picking: 'bg-purple-100 text-purple-700',
      packing: 'bg-indigo-100 text-indigo-700',
      out_for_delivery: 'bg-orange-100 text-orange-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-neutral-100 text-neutral-700'
  }

  if (ordersLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 pb-20">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Shopper'}! 👋
            </h1>
            <p className="text-neutral-600 font-medium">
              Here's what's happening with your orders today
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={stat.link}
                  className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-500">{stat.label}</p>
                    <p className="text-3xl font-black text-neutral-900">{stat.value}</p>
                    <p className="text-xs font-medium text-neutral-400">{stat.change}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-black text-neutral-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-all group"
                >
                  <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center bg-${action.color}-100 text-${action.color}-600 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-neutral-700 group-hover:text-orange-600 transition-colors">
                    {action.label}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-neutral-900">Recent History</h2>
              {orders?.length > 0 && (
                <Link
                  to="/customer/orders"
                  className="text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  See All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {orders?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12">
                <EmptyState
                  icon={Package}
                  title="No past orders"
                  description="Your order history is currently empty. Let's fill it with fresh groceries!"
                  action={{
                    label: 'Start Shopping',
                    link: '/shop'
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
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
                      <div>
                        <p className="text-sm text-neutral-600 font-medium">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-neutral-900">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {order.deliveryAddress?.area}, Ward {order.deliveryAddress?.ward}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Promotional Banner */}
          {orders?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Gift className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-wider">Special Offer</span>
                      </div>
                      <h3 className="text-2xl font-black mb-2">Get 20% off your next order!</h3>
                      <p className="text-orange-100 font-medium mb-6">
                        Use code <span className="font-black text-white">ZALLDI20</span> at checkout
                      </p>
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
                      >
                        Shop Now
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}