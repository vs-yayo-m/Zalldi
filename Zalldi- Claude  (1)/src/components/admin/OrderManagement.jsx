// src/components/admin/OrderManagement.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { collection, query, where, orderBy, limit, getDocs, onSnapshot, startAfter } from 'firebase/firestore'
import { db } from '@config/firebase'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@utils/constants'
import { formatCurrency, formatDate, formatRelativeTime } from '@utils/formatters'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Pagination from '@components/ui/Pagination'
import EmptyState from '@components/shared/EmptyState'
import { Search, Filter, Download, RefreshCw, Package, Clock, MapPin, User, ChevronRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function OrderManagement() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || 'all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0
  })
  
  const itemsPerPage = 20

  useEffect(() => {
    loadOrders()
    
    const unsubscribe = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50)),
      (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          loadOrders()
        }
      }
    )

    return () => unsubscribe()
  }, [statusFilter, dateFilter, currentPage])

  useEffect(() => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (statusFilter !== 'all') params.status = statusFilter
    if (dateFilter !== 'all') params.date = dateFilter
    setSearchParams(params)
  }, [searchTerm, statusFilter, dateFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      
      let q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      )

      if (statusFilter !== 'all') {
        q = query(
          collection(db, 'orders'),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc')
        )
      }

      if (dateFilter !== 'all') {
        const now = new Date()
        let startDate = new Date()
        
        switch (dateFilter) {
          case 'today':
            startDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(now.getMonth() - 1)
            break
        }
        
        q = query(q, where('createdAt', '>=', startDate))
      }

      const snapshot = await getDocs(q)
      let allOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        allOrders = allOrders.filter(order =>
          order.orderNumber?.toLowerCase().includes(term) ||
          order.customerName?.toLowerCase().includes(term) ||
          order.customerPhone?.includes(term) ||
          order.customerEmail?.toLowerCase().includes(term)
        )
      }

      const total = allOrders.length
      const pages = Math.ceil(total / itemsPerPage)
      const startIndex = (currentPage - 1) * itemsPerPage
      const paginatedOrders = allOrders.slice(startIndex, startIndex + itemsPerPage)

      setOrders(paginatedOrders)
      setTotalPages(pages)

      const statusCounts = allOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {})

      setStats({
        total,
        pending: statusCounts.pending || 0,
        confirmed: statusCounts.confirmed || 0,
        delivered: statusCounts.delivered || 0
      })
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadOrders()
    setRefreshing(false)
    toast.success('Orders refreshed')
  }

  const handleExport = () => {
    const csv = [
      ['Order Number', 'Customer', 'Date', 'Status', 'Total', 'Items'].join(','),
      ...orders.map(order => [
        order.orderNumber,
        order.customerName,
        formatDate(order.createdAt?.toDate()),
        ORDER_STATUS_LABELS[order.status],
        order.total,
        order.items?.length || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Orders exported')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'amber',
      confirmed: 'blue',
      picking: 'purple',
      packing: 'indigo',
      out_for_delivery: 'orange',
      delivered: 'green',
      cancelled: 'red'
    }
    return colors[status] || 'neutral'
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    ...Object.entries(ORDER_STATUS).map(([key, value]) => ({
      value,
      label: ORDER_STATUS_LABELS[value]
    }))
  ]

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last Month' }
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
            Order Management
          </h1>
          <p className="text-neutral-600">
            Manage and monitor all platform orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Orders', value: stats.total, color: 'blue', icon: Package },
            { label: 'Pending', value: stats.pending, color: 'amber', icon: Clock },
            { label: 'Confirmed', value: stats.confirmed, color: 'purple', icon: Package },
            { label: 'Delivered', value: stats.delivered, color: 'green', icon: Package }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by order number, customer name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                icon={Filter}
                className="min-w-[150px]"
              />
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                options={dateOptions}
                icon={Clock}
                className="min-w-[150px]"
              />
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                icon={RefreshCw}
                className={refreshing ? 'animate-spin' : ''}
              />
              <Button
                variant="outline"
                onClick={handleExport}
                icon={Download}
              >
                Export
              </Button>
            </div>
          </div>
        </Card>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders found"
            description="Try adjusting your filters or search criteria"
          />
        ) : (
          <>
            <div className="space-y-3">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="p-4 hover:shadow-card-hover transition-shadow cursor-pointer group"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-neutral-800 group-hover:text-orange-600 transition-colors">
                            {order.orderNumber}
                          </h3>
                          <Badge
                            variant={getStatusColor(order.status)}
                            size="sm"
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Ward {order.deliveryAddress?.ward}, {order.deliveryAddress?.area}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatRelativeTime(order.createdAt?.toDate())}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}