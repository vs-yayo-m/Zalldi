// src/pages/customer/Dashboard.jsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useOrders } from '@hooks/useOrders'
import OrderCard from '@components/customer/OrderCard'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'
import { formatCurrency } from '@utils/formatters'
import { Package, ShoppingBag, MapPin, User, Clock } from 'lucide-react'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { orders, loading: ordersLoading, getActiveOrders } = useOrders({ limitCount: 10 })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  if (authLoading || ordersLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  const activeOrders = getActiveOrders()
  const recentOrders = orders.slice(0, 5)
  const totalSpent = user.totalSpent || 0
  const totalOrders = user.orderCount || 0

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: totalOrders,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Package,
      label: 'Active Orders',
      value: activeOrders.length,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Clock,
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      color: 'bg-green-100 text-green-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-50 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                Welcome back, {user.displayName || 'Customer'}!
              </h1>
              <p className="text-neutral-600">
                Manage your orders and account settings
              </p>
            </div>
            <Button
              onClick={() => navigate('/shop')}
              leftIcon={<ShoppingBag className="w-5 h-5" />}
            >
              Start Shopping
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {activeOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-neutral-900">
                Active Orders
              </h2>
              <Badge variant="warning" size="lg">
                {activeOrders.length} In Progress
              </Badge>
            </div>

            <div className="space-y-4">
              {activeOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold text-neutral-900">
              Recent Orders
            </h2>
            {orders.length > 5 && (
              <Button
                variant="ghost"
                onClick={() => navigate('/customer/orders')}
              >
                View All
              </Button>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Start shopping to see your orders here"
              actionLabel="Browse Products"
              onAction={() => navigate('/shop')}
            />
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <button
            onClick={() => navigate('/customer/addresses')}
            className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Delivery Addresses</p>
                <p className="text-sm text-neutral-600">Manage your saved addresses</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/customer/profile')}
            className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Account Settings</p>
                <p className="text-sm text-neutral-600">Update your profile information</p>
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}