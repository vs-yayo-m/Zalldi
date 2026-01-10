// src/pages/admin/Orders.jsx

import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '@config/firebase'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@utils/constants'
import { formatCurrency, formatRelativeTime } from '@utils/formatters'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import EmptyState from '@components/shared/EmptyState'
import LoadingScreen from '@components/shared/LoadingScreen'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import { 
  Search, Filter, Download, RefreshCw, Package, Clock, 
  MapPin, User, ChevronRight, TrendingUp, AlertCircle, 
  Zap, CheckCircle, XCircle, Truck, ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    delivered: 0,
    revenue: 0
  })
  
  const itemsPerPage = 15

  useEffect(() => {
    const unsubscribe = setupRealtimeListener()
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterAndPaginateOrders()
  }, [allOrders, statusFilter, searchTerm, currentPage])

  useEffect(() => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (statusFilter !== 'all') params.status = statusFilter
    if (currentPage > 1) params.page = currentPage
    setSearchParams(params)
  }, [statusFilter, searchTerm, currentPage])

  const setupRealtimeListener = () => {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(500)
    )

    return onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))

      setAllOrders(ordersData)
      calculateStats(ordersData)
      setLoading(false)

      const changes = snapshot.docChanges()
      changes.forEach(change => {
        if (change.type === 'added' && !loading) {
          toast.success('New order received!', {
            icon: '🔔',
            position: 'top-right'
          })
        }
      })
    }, (error) => {
      console.error('Error listening to orders:', error)
      toast.error('Failed to sync orders')
      setLoading(false)
    })
  }

  const calculateStats = (ordersData) => {
    const totals = ordersData.reduce((acc, order) => {
      acc.total++
      if (order.status === 'pending') acc.pending++
      if (['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)) {
        acc.active++
      }
      if (order.status === 'delivered') {
        acc.delivered++
        acc.revenue += (order.total || 0)
      }
      return acc
    }, { total: 0, pending: 0, active: 0, delivered: 0, revenue: 0 })

    setStats(totals)
  }

  const filterAndPaginateOrders = () => {
    let filtered = [...allOrders]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(o =>
        o.orderNumber?.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term) ||
        o.customerPhone?.includes(term)
      )
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedOrders = filtered.slice(startIndex, startIndex + itemsPerPage)
    
    setOrders(paginatedOrders)
  }

  const totalPages = useMemo(() => {
    let filtered = [...allOrders]
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter)
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(o =>
        o.orderNumber?.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term) ||
        o.customerPhone?.includes(term)
      )
    }
    return Math.ceil(filtered.length / itemsPerPage)
  }, [allOrders, statusFilter, searchTerm])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
    toast.success('Orders synced')
  }

  const handleExport = () => {
    const headers = ['Order #', 'Customer', 'Phone', 'Ward', 'Total', 'Status', 'Date']
    const rows = orders.map(o => [
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      o.deliveryAddress?.ward || 'N/A',
      o.total,
      o.status,
      o.createdAt?.toISOString()
    ])
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", `zalldi_orders_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Report downloaded')
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'amber', icon: Clock, pulse: true },
      confirmed: { color: 'blue', icon: CheckCircle, pulse: false },
      picking: { color: 'purple', icon: Package, pulse: false },
      packing: { color: 'indigo', icon: Package, pulse: false },
      out_for_delivery: { color: 'orange', icon: Truck, pulse: true },
      delivered: { color: 'green', icon: CheckCircle, pulse: false },
      cancelled: { color: 'red', icon: XCircle, pulse: false }
    }
    return configs[status] || { color: 'neutral', icon: Package, pulse: false }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-orange-100 font-black text-xs uppercase tracking-wider mb-3">
                <Zap className="w-4 h-4" />
                Order Management System
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                All Orders
              </h1>
              <p className="text-orange-100 font-medium">
                Real-time order monitoring across Butwal
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Sync
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
              { label: 'Active', value: stats.active, icon: Package, color: 'bg-blue-500' },
              { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'bg-green-500' },
              { label: 'Revenue', value: formatCurrency(stats.revenue), icon: TrendingUp, color: 'bg-emerald-500' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-orange-100 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by order #, name, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 h-12 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none font-medium text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-12 px-4 bg-neutral-50 border-none rounded-xl font-bold text-xs uppercase tracking-wider outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">All Statuses</option>
              {Object.entries(ORDER_STATUS).map(([key, value]) => (
                <option key={value} value={value}>
                  {ORDER_STATUS_LABELS[value]}
                </option>
              ))}
            </select>

            <Button variant="ghost" className="lg:w-12 h-12 p-0 flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-12"
            >
              <EmptyState
                icon={AlertCircle}
                title="No orders found"
                description="No orders match your current filters"
              />
            </motion.div>
          ) : (
            <div className="space-y-3 mb-8">
              {orders.map((order, idx) => {
                const config = getStatusConfig(order.status)
                const StatusIcon = config.icon

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="group bg-white p-4 rounded-2xl border border-neutral-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-xl bg-${config.color}-50 flex items-center justify-center`}>
                          <StatusIcon className={`w-6 h-6 text-${config.color}-600`} />
                        </div>
                        {config.pulse && (
                          <div className={`absolute -top-1 -right-1 w-3 h-3 bg-${config.color}-500 rounded-full animate-pulse`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-black text-neutral-900">{order.orderNumber}</span>
                          <Badge variant={config.color} className="text-xs">
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="text-neutral-700">{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>Ward {order.deliveryAddress?.ward}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatRelativeTime(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xl font-black text-neutral-900">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-xs font-bold text-neutral-400 uppercase">
                            {order.items?.length || 0} items
                          </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      currentPage === pageNum
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-orange-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}