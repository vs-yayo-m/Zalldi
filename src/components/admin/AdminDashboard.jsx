// src/components/admin/AdminDashboard.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ExecutiveMetrics from './ExecutiveMetrics'
import LiveOrderFeed from './LiveOrderFeed'
import PlatformHealth from './PlatformHealth'
import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency, formatDate } from '@utils/formatters'
import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import Button from '@components/ui/Button'
import Card from '@components/ui/Card'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    activeCustomers: 0,
    activeSuppliers: 0,
    pendingOrders: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    loadDashboardData()
    
    const unsubscribe = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10)),
      (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setRecentActivity(activities)
      }
    )

    return () => unsubscribe()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

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
      ])

      const todayRevenue = todayOrdersSnap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0)
      const yesterdayRevenue = yesterdayOrdersSnap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0)
      
      const revenueGrowth = yesterdayRevenue > 0 
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
        : 0

      const ordersGrowth = yesterdayOrdersSnap.size > 0 
        ? ((todayOrdersSnap.size - yesterdayOrdersSnap.size) / yesterdayOrdersSnap.size) * 100 
        : 0

      const activeCustomers = customersSnap.docs.filter(doc => {
        const lastOrder = doc.data().lastOrderDate?.toDate()
        if (!lastOrder) return false
        const daysSince = (new Date() - lastOrder) / (1000 * 60 * 60 * 24)
        return daysSince <= 30
      }).length

      setMetrics({
        todayRevenue,
        todayOrders: todayOrdersSnap.size,
        activeCustomers,
        activeSuppliers: suppliersSnap.size,
        pendingOrders: pendingOrdersSnap.size,
        totalProducts: productsSnap.size,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10
      })

      const criticalAlerts = []
      
      if (pendingOrdersSnap.size > 20) {
        criticalAlerts.push({
          type: 'warning',
          message: `${pendingOrdersSnap.size} pending orders need attention`,
          action: () => navigate('/admin/orders?status=pending')
        })
      }

      const lowStockProducts = productsSnap.docs.filter(doc => {
        const stock = doc.data().stock || 0
        return stock > 0 && stock < 10
      })

      if (lowStockProducts.length > 0) {
        criticalAlerts.push({
          type: 'info',
          message: `${lowStockProducts.length} products are low on stock`,
          action: () => navigate('/admin/products?filter=low-stock')
        })
      }

      setAlerts(criticalAlerts)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(metrics.todayRevenue),
      change: metrics.revenueGrowth,
      icon: DollarSign,
      color: 'orange',
      trend: metrics.revenueGrowth >= 0 ? 'up' : 'down'
    },
    {
      title: "Today's Orders",
      value: metrics.todayOrders,
      change: metrics.ordersGrowth,
      icon: ShoppingCart,
      color: 'blue',
      trend: metrics.ordersGrowth >= 0 ? 'up' : 'down'
    },
    {
      title: 'Active Customers',
      value: metrics.activeCustomers,
      subtitle: 'Last 30 days',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Total Products',
      value: metrics.totalProducts,
      subtitle: `${metrics.activeSuppliers} suppliers`,
      icon: Package,
      color: 'purple'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral-600">
            {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 border-l-4 ${
                  alert.type === 'warning' ? 'border-amber-500 bg-amber-50' : 'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alert.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                      <p className="text-sm font-medium text-neutral-800">
                        {alert.message}
                      </p>
                    </div>
                    {alert.action && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={alert.action}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
                <h3 className="text-neutral-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-neutral-800 mb-1">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-neutral-500">{stat.subtitle}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <ExecutiveMetrics metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <LiveOrderFeed orders={recentActivity} />
          </div>
          <div>
            <PlatformHealth />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/admin/orders')}
            variant="outline"
            className="w-full"
          >
            Manage Orders
          </Button>
          <Button
            onClick={() => navigate('/admin/products')}
            variant="outline"
            className="w-full"
          >
            Manage Products
          </Button>
          <Button
            onClick={() => navigate('/admin/analytics')}
            variant="outline"
            className="w-full"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}