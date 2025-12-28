// src/components/admin/PlatformHealth.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@config/firebase'
import Card from '@components/ui/Card'
import ProgressBar from '@components/ui/ProgressBar'
import { Activity, Server, Database, Zap, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function PlatformHealth() {
  const [health, setHealth] = useState({
    overall: 100,
    database: 100,
    orders: 100,
    products: 100,
    users: 100
  })
  const [metrics, setMetrics] = useState({
    activeOrders: 0,
    totalProducts: 0,
    activeUsers: 0,
    systemLoad: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkPlatformHealth()
    const interval = setInterval(checkPlatformHealth, 60000)
    return () => clearInterval(interval)
  }, [])

  const checkPlatformHealth = async () => {
    try {
      setLoading(true)
      const healthChecks = {
        database: 100,
        orders: 100,
        products: 100,
        users: 100
      }

      const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
        getDocs(query(collection(db, 'orders'), where('status', 'in', ['pending', 'confirmed', 'picking', 'packing', 'out_for_delivery']))),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'users'))
      ])

      const activeOrders = ordersSnap.size
      const totalProducts = productsSnap.size
      const activeUsers = usersSnap.size

      if (activeOrders > 100) {
        healthChecks.orders = Math.max(50, 100 - (activeOrders - 100))
      }

      const activeProducts = productsSnap.docs.filter(doc => doc.data().active !== false).length
      const productHealth = (activeProducts / totalProducts) * 100
      healthChecks.products = Math.round(productHealth)

      const lowStockCount = productsSnap.docs.filter(doc => {
        const stock = doc.data().stock || 0
        return stock > 0 && stock < 5
      }).length

      if (lowStockCount > 0) {
        healthChecks.products = Math.max(70, healthChecks.products - (lowStockCount * 2))
      }

      const pendingOrders = ordersSnap.docs.filter(doc => doc.data().status === 'pending').length
      if (pendingOrders > 20) {
        healthChecks.orders = Math.max(60, 100 - (pendingOrders - 20) * 2)
      }

      const overall = Math.round(
        (healthChecks.database + healthChecks.orders + healthChecks.products + healthChecks.users) / 4
      )

      setHealth({
        overall,
        ...healthChecks
      })

      const systemLoad = Math.min(100, Math.round((activeOrders / 50) * 100))

      setMetrics({
        activeOrders,
        totalProducts,
        activeUsers,
        systemLoad
      })
    } catch (error) {
      console.error('Error checking platform health:', error)
      setHealth({
        overall: 50,
        database: 50,
        orders: 50,
        products: 50,
        users: 50
      })
    } finally {
      setLoading(false)
    }
  }

  const getHealthStatus = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'green', icon: CheckCircle }
    if (score >= 70) return { label: 'Good', color: 'blue', icon: CheckCircle }
    if (score >= 50) return { label: 'Fair', color: 'amber', icon: AlertCircle }
    return { label: 'Poor', color: 'red', icon: XCircle }
  }

  const overallStatus = getHealthStatus(health.overall)

  const healthItems = [
    {
      label: 'Database',
      value: health.database,
      icon: Database,
      description: 'Connection & Performance'
    },
    {
      label: 'Order Processing',
      value: health.orders,
      icon: Activity,
      description: `${metrics.activeOrders} active orders`
    },
    {
      label: 'Product Catalog',
      value: health.products,
      icon: Server,
      description: `${metrics.totalProducts} total products`
    },
    {
      label: 'User System',
      value: health.users,
      icon: Zap,
      description: `${metrics.activeUsers} registered users`
    }
  ]

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-800">
          Platform Health
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-neutral-600">Live</span>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="flex items-center justify-center mb-3">
            <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-${overallStatus.color}-400 to-${overallStatus.color}-600 flex items-center justify-center`}>
              <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-neutral-800">
                  {health.overall}%
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-wide">
                  Health
                </span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${overallStatus.color}-100 text-${overallStatus.color}-700`}>
              <overallStatus.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{overallStatus.label}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {healthItems.map((item, index) => {
          const status = getHealthStatus(item.value)
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-${status.color}-100`}>
                  <item.icon className={`w-4 h-4 text-${status.color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-800">
                      {item.label}
                    </span>
                    <span className={`text-sm font-semibold text-${status.color}-600`}>
                      {item.value}%
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-2">
                    {item.description}
                  </p>
                  <ProgressBar
                    value={item.value}
                    color={status.color}
                    size="sm"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">System Load</span>
          <span className="font-semibold text-neutral-800">
            {metrics.systemLoad}%
          </span>
        </div>
        <ProgressBar
          value={metrics.systemLoad}
          color={metrics.systemLoad > 80 ? 'red' : metrics.systemLoad > 60 ? 'amber' : 'green'}
          className="mt-2"
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Auto-refresh:</span> Health metrics update every minute
        </p>
      </div>
    </Card>
  )
}