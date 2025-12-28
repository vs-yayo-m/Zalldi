// src/components/supplier/OrderQueue.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Package,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatRelativeTime, formatAddress } from '@utils/formatters'
import { ORDER_STATUS_LABELS } from '@utils/constants'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'

export default function OrderQueue({ orders }) {
  const navigate = useNavigate()
  const [expandedOrder, setExpandedOrder] = useState(null)
  
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      picking: 'bg-purple-100 text-purple-800 border-purple-200',
      packing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      out_for_delivery: 'bg-green-100 text-green-800 border-green-200',
      delivered: 'bg-neutral-100 text-neutral-800 border-neutral-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || colors.pending
  }
  
  const getActionButton = (order) => {
    const actions = {
      pending: { label: 'Confirm Order', action: () => navigate(`/supplier/orders/${order.id}`) },
      confirmed: { label: 'Start Picking', action: () => navigate(`/supplier/orders/${order.id}`) },
      picking: { label: 'Continue Picking', action: () => navigate(`/supplier/orders/${order.id}`) },
      packing: { label: 'Continue Packing', action: () => navigate(`/supplier/orders/${order.id}`) },
      out_for_delivery: { label: 'View Details', action: () => navigate(`/supplier/orders/${order.id}`) }
    }
    return actions[order.status]
  }
  
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }
  
  const sortedOrders = [...orders].sort((a, b) => {
    const statusOrder = ['pending', 'confirmed', 'picking', 'packing', 'out_for_delivery']
    const aIndex = statusOrder.indexOf(a.status)
    const bIndex = statusOrder.indexOf(b.status)
    
    if (aIndex !== bIndex) return aIndex - bIndex
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sortedOrders.map((order) => {
          const action = getActionButton(order)
          const isExpanded = expandedOrder === order.id

          return (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-title font-semibold text-neutral-800">
                        {order.orderNumber}
                      </h3>
                      <Badge 
                        variant="custom"
                        className={`${getStatusColor(order.status)} border`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-body-sm text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{formatRelativeTime(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package className="w-4 h-4" />
                        <span>{order.items.length} items</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-primary-600">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 text-body-sm text-neutral-700">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{formatAddress(order.deliveryAddress)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {action && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    )}
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 pt-6 border-t border-neutral-200"
                    >
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-body font-semibold text-neutral-800 mb-3">
                            Order Items
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={item.image || '/placeholder-product.png'}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-body font-medium text-neutral-800">
                                      {item.name}
                                    </p>
                                    <p className="text-body-sm text-neutral-600">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-body font-semibold text-neutral-800">
                                  {formatCurrency(item.total)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-body font-semibold text-neutral-800 mb-3">
                            Customer Information
                          </h4>
                          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                            <p className="text-body text-neutral-800">
                              {order.customerName}
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-neutral-600" />
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="text-body text-primary-600 hover:text-primary-700"
                              >
                                {order.customerPhone}
                              </a>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-neutral-600 mt-0.5" />
                              <p className="text-body text-neutral-700">
                                {formatAddress(order.deliveryAddress)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div>
                            <h4 className="text-body font-semibold text-neutral-800 mb-2">
                              Special Instructions
                            </h4>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-body text-amber-900">{order.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}