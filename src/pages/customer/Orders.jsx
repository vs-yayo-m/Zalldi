// src/pages/customer/Orders.jsx

import React, { useState, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  Search,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import Input from '@/components/ui/Input'
import { formatCurrency, formatRelativeTime } from '@/utils/formatters'
import { ORDER_STATUS_LABELS } from '@/utils/constants'

export default function CustomerOrders() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status')
  
  const { user, loading: authLoading } = useAuth()
  const { orders, loading } = useOrders()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || 'all')

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/orders', { replace: true })
    }
  }, [user, authLoading, navigate])

  const statusOptions = useMemo(() => {
    if (!orders) return [
      { value: 'all', label: 'All Orders', count: 0 },
      { value: 'active', label: 'Active', count: 0 },
      { value: 'delivered', label: 'Delivered', count: 0 },
      { value: 'cancelled', label: 'Cancelled', count: 0 }
    ]

    return [
      { value: 'all', label: 'All Orders', count: orders.length },
      { 
        value: 'active', 
        label: 'Active', 
        count: orders.filter(o => ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(o.status)).length 
      },
      { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
      { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
    ]
  }, [orders])

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    
    let filtered = orders

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(order => 
          ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
        )
      } else {
        filtered = filtered.filter(order => order.status === selectedStatus)
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    return filtered
  }, [orders, selectedStatus, searchQuery])

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

  if (authLoading || loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 pb-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
              My Orders
            </h1>
            <p className="text-neutral-600 font-medium">
              Track and manage all your orders
            </p>
          </motion.div>

          <div className="mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by order number or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-50 rounded-xl border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    selectedStatus === option.value
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className={`ml-2 ${
                      selectedStatus === option.value
                        ? 'text-orange-200'
                        : 'text-neutral-400'
                    }`}>
                      ({option.count})
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
                description={
                  searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'Start shopping to see your orders here'
                }
                action={
                  !searchQuery && {
                    label: 'Start Shopping',
                    onClick: () => navigate('/shop')
                  }
                }
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

                    <div className="flex items-center justify-between mb-4">
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

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {order.deliveryAddress?.area}, Ward {order.deliveryAddress?.ward}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
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