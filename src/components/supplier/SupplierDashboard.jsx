// src/components/supplier/SupplierDashboard.jsx

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DashboardStats from './DashboardStats'
import RevenueChart from './RevenueChart'
import OrdersChart from './OrdersChart'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { formatCurrency, formatDateTime } from '@utils/formatters'
import { ORDER_STATUS_LABELS } from '@utils/constants'
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function SupplierDashboard({ orders }) {
  const navigate = useNavigate()
  
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })
    
    const pendingOrders = orders.filter(o => ['pending', 'confirmed'].includes(o.status))
    
    const completedOrders = orders.filter(o => o.status === 'delivered')
    
    const totalRevenue = completedOrders.reduce((sum, order) =>
      sum + (order.total || 0), 0
    )
    
    const todayRevenue = todayOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + (order.total || 0), 0)
    
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      todayRevenue
    }
  }, [orders])
  
  const recentOrders = useMemo(() => [...orders].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5), [orders])
  
  const getStatusVariant = (status) => {
    switch (status) {
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'error'
      case 'pending':
        return 'warning'
      default:
        return 'info'
    }
  }
  
  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RevenueChart orders={orders} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <OrdersChart orders={orders} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-neutral-900">
            Recent Orders
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate('/supplier/orders')}
          >
            View All
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/supplier/orders/${order.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {order.items.length} items • {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      {formatCurrency(order.total)}
                    </p>
                    <Badge variant={getStatusVariant(order.status)} size="sm">
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/supplier/products')}
          className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Products</p>
              <p className="text-sm text-neutral-600">Manage catalog</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate('/supplier/orders')}
          className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Orders</p>
              <p className="text-sm text-neutral-600">Process orders</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate('/supplier/inventory')}
          className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Inventory</p>
              <p className="text-sm text-neutral-600">Stock management</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigate('/supplier/analytics')}
          className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Analytics</p>
              <p className="text-sm text-neutral-600">View reports</p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}