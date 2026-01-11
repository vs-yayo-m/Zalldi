// src/pages/customer/Orders.jsx (REFACTORED - ENTERPRISE)

import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Clock, Search, ArrowLeft, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import { formatCurrency, formatRelativeTime } from '@/utils/formatters'
import { ORDER_STATUS_LABELS } from '@/utils/constants'

export default function CustomerOrders() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status')
  
  const { user, loading: authLoading } = useAuth()
  const { orders, activeOrders, completedOrders, loading } = useOrders()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || 'all')
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/orders', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  const filteredOrders = useMemo(() => {
    let filtered = orders
    
    if (selectedStatus === 'active') {
      filtered = activeOrders
    } else if (selectedStatus === 'completed') {
      filtered = completedOrders
    } else if (selectedStatus !== 'all') {
      filtered = orders.filter(o => o.status === selectedStatus)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(o =>
        o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    return filtered
  }, [orders, activeOrders, completedOrders, selectedStatus, searchQuery])
  
  const statusTabs = [
    { value: 'all', label: 'All', count: orders.length },
    { value: 'active', label: 'Active', count: activeOrders.length },
    { value: 'completed', label: 'Completed', count: completedOrders.length }
  ]
  
  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    if (status === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ status })
    }
  }
  
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
  
  if (authLoading || loading) return <LoadingScreen />
  if (!user) return null
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 pb-24 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-8">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-neutral-600 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-neutral-900">My Orders</h1>
            <p className="text-neutral-600 mt-1">Track and manage all your orders</p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:outline-none font-medium"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {statusTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => handleStatusChange(tab.value)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    selectedStatus === tab.value
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 ${
                      selectedStatus === tab.value ? 'text-orange-200' : 'text-neutral-400'
                    }`}>
                      ({tab.count})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12">
              <EmptyState
                icon={Package}
                title={searchQuery ? 'No orders found' : 'No orders yet'}
                description={searchQuery ? 'Try adjusting your search' : 'Start shopping to see orders here'}
                action={!searchQuery && { label: 'Browse Products', onClick: () => navigate('/shop') }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="block bg-white rounded-2xl p-6 hover:shadow-md transition-all border border-neutral-100 hover:border-orange-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold text-neutral-500 mb-1">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(order.createdAt)}
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
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                      <p className="text-sm text-neutral-600">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-lg font-black text-neutral-900">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}