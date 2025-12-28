// src/components/admin/LiveOrderFeed.jsx

import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatRelativeTime } from '@utils/formatters'
import { ORDER_STATUS_LABELS } from '@utils/constants'
import Card from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { Package, Clock, MapPin, User, ExternalLink, RefreshCw } from 'lucide-react'

export default function LiveOrderFeed({ orders }) {
  const navigate = useNavigate()
  
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
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="w-4 h-4" />
      case 'picking':
      case 'packing':
        return <Package className="w-4 h-4" />
      case 'out_for_delivery':
        return <MapPin className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }
  
  if (!orders || orders.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">
            Live Order Feed
          </h2>
        </div>
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">No recent orders</p>
        </div>
      </Card>
    )
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <RefreshCw className="w-5 h-5 text-orange-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-lg font-semibold text-neutral-800">
            Live Order Feed
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/orders')}
        >
          View All
        </Button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <div
                className="group p-4 border border-neutral-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all cursor-pointer bg-white"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-800 group-hover:text-orange-600 transition-colors">
                        {order.orderNumber}
                      </h3>
                      <Badge
                        variant={getStatusColor(order.status)}
                        size="sm"
                        icon={getStatusIcon(order.status)}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatRelativeTime(order.createdAt?.toDate())}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {order.items?.length || 0} items
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-1 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">
                      Ward {order.deliveryAddress?.ward}, {order.deliveryAddress?.area}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </div>

                {order.status === 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-neutral-100"
                  >
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admin/orders/${order.id}`)
                        }}
                        className="flex-1"
                      >
                        Process Order
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">
            Showing {orders.length} recent orders
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/orders')}
            icon={ExternalLink}
          >
            View All Orders
          </Button>
        </div>
      </div>
    </Card>
  )
}