// /src/components/admin/OrderManagement.jsx

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { collection, query, where, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@/utils/constants'
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/formatters'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/shared/EmptyState'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Package, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight, 
  TrendingUp,
  AlertCircle,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'

/**
 * ZALLDI ADMIN: ORDER COMMAND CENTER
 * Optimized for rapid dispatch and operational oversight in Butwal.
 */

export default function OrderManagement() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // States derived from URL params for shareable admin views
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || 'all')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0,
    revenue: 0
  })
  
  const itemsPerPage = 15

  // Real-time listener for "New Order" notifications
  useEffect(() => {
    const q = query(
      collection(db, 'orders'), 
      where('status', '==', 'pending'),
      limit(1)
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty && !loading) {
        // Only toast if it's a new addition, not the initial load
        const change = snapshot.docChanges()[0];
        if (change?.type === 'added') {
          toast('New Order Received!', { icon: '🔔', position: 'top-right' });
          loadOrders();
        }
      }
    })

    return () => unsubscribe()
  }, [loading])

  // Main data loader
  useEffect(() => {
    loadOrders()
    
    // Update URL params
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (statusFilter !== 'all') params.status = statusFilter
    if (dateFilter !== 'all') params.date = dateFilter
    if (currentPage > 1) params.page = currentPage
    setSearchParams(params)
  }, [statusFilter, dateFilter, searchTerm, currentPage])

  const loadOrders = async () => {
    try {
      setLoading(true)
      let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))

      if (statusFilter !== 'all') {
        q = query(q, where('status', '==', statusFilter))
      }

      // Note: In a production environment with massive data, 
      // we would use a proper backend search index (Algolia/Elastic)
      const snapshot = await getDocs(q)
      let allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Client-side filtering for Search Term (supports Phone/Name/Order#)
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        allOrders = allOrders.filter(o => 
          o.orderNumber?.toLowerCase().includes(term) ||
          o.customerName?.toLowerCase().includes(term) ||
          o.customerPhone?.includes(term)
        )
      }

      // Calculate Stats based on the filtered set or full set? 
      // Usually, managers want stats for the "Current Scope"
      const totals = allOrders.reduce((acc, curr) => {
        acc.total++
        if (curr.status === 'pending') acc.pending++
        if (curr.status === 'confirmed') acc.confirmed++
        if (curr.status === 'delivered') {
          acc.delivered++
          acc.revenue += (curr.total || 0)
        }
        return acc
      }, { total: 0, pending: 0, confirmed: 0, delivered: 0, revenue: 0 })

      setStats(totals)
      
      const startIndex = (currentPage - 1) * itemsPerPage
      setOrders(allOrders.slice(startIndex, startIndex + itemsPerPage))
      setTotalPages(Math.ceil(allOrders.length / itemsPerPage))

    } catch (error) {
      console.error('Admin Fetch Error:', error)
      toast.error('Failed to sync orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const map = {
      pending: { color: 'amber', label: 'Needs Action', pulse: true },
      confirmed: { color: 'blue', label: 'In Preparation', pulse: false },
      picking: { color: 'purple', label: 'Picking', pulse: false },
      packing: { color: 'indigo', label: 'Packing', pulse: false },
      out_for_delivery: { color: 'orange', label: 'On the Road', pulse: true },
      delivered: { color: 'green', label: 'Delivered', pulse: false },
      cancelled: { color: 'red', label: 'Cancelled', pulse: false }
    }
    return map[status] || { color: 'neutral', label: status, pulse: false }
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
      o.createdAt?.toDate().toISOString()
    ])
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", `zalldi_orders_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Report Downloaded')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header Area */}
      <div className="bg-white border-b border-neutral-200 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <Zap className="w-3 h-3 fill-current" />
              Operations Dashboard
            </div>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Order Management</h1>
            <p className="text-neutral-500 font-medium mt-1">Monitoring deliveries across all 19 wards of Butwal.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="rounded-xl font-bold text-xs border-neutral-200"
              icon={<Download className="w-4 h-4" />}
            >
              Export Report
            </Button>
            <Button 
              onClick={loadOrders}
              className="rounded-xl font-bold text-xs bg-neutral-900 hover:bg-black text-white"
              icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            >
              Sync Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-500', trend: 'Needs Dispatch' },
            { label: 'Active', value: stats.confirmed, icon: Package, color: 'bg-blue-500', trend: 'In Store' },
            { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: TrendingUp, color: 'bg-emerald-500', trend: 'Today' },
            { label: 'Avg Delivery', value: '42m', icon: Zap, color: 'bg-orange-500', trend: 'Target: 60m' }
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-[2rem] border border-neutral-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black text-neutral-900 tracking-tight">{item.value}</h4>
                <span className="text-[10px] font-bold text-neutral-400 italic">{item.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters Bar */}
        <Card className="p-4 mb-6 rounded-[2rem] border-none shadow-sm flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search by Order #, Customer Name or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 font-medium text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                ...Object.entries(ORDER_STATUS).map(([k, v]) => ({ value: v, label: ORDER_STATUS_LABELS[v] }))
              ]}
              className="h-12 bg-neutral-50 border-none rounded-2xl font-bold text-xs uppercase tracking-wider min-w-[180px]"
            />
            <div className="w-[1px] h-8 bg-neutral-200 hidden lg:block" />
            <Button variant="ghost" className="text-neutral-400 hover:text-orange-500">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Orders Table/List View */}
        <AnimatePresence mode="wait">
          {orders.length === 0 && !loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState 
                icon={<AlertCircle className="w-16 h-16 text-neutral-200" />}
                title="No matching orders"
                description="We couldn't find any orders matching these filters."
              />
            </motion.div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, idx) => {
                const config = getStatusConfig(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="group bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 hover:border-orange-200 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6"
                  >
                    {/* Status Icon */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-${config.color}-50 flex items-center justify-center text-${config.color}-600`}>
                        <Package className="w-6 h-6" />
                      </div>
                      {config.pulse && (
                        <div className={`absolute -top-1 -right-1 w-3 h-3 bg-${config.color}-500 rounded-full border-2 border-white animate-pulse`} />
                      )}
                    </div>

                    {/* Order Meta */}
                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                        <span className="font-black text-neutral-900 tracking-tight">{order.orderNumber}</span>
                        <Badge variant={config.color} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-xs font-bold text-neutral-400">
                        <div className="flex items-center gap-1.5 uppercase tracking-wider">
                          <User className="w-3 h-3" />
                          <span className="text-neutral-600">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 uppercase tracking-wider">
                          <MapPin className="w-3 h-3" />
                          <span>Ward {order.deliveryAddress?.ward}</span>
                        </div>
                        <div className="flex items-center gap-1.5 uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(order.createdAt?.toDate())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financials & Actions */}
                    <div className="flex items-center gap-6 pr-4">
                      <div className="text-right">
                        <p className="text-xl font-black text-neutral-900 tracking-tighter leading-none mb-1">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                          {order.items?.length || 0} Items • {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

