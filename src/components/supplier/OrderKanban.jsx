// src/components/supplier/OrderKanban.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Package, MapPin } from 'lucide-react'
import { formatCurrency, formatRelativeTime, formatShortAddress } from '@utils/formatters'
import { ORDER_STATUS_LABELS } from '@utils/constants'
import Button from '@components/ui/Button'

export default function OrderKanban({ orders }) {
  const navigate = useNavigate()
  
  const columns = [
    { id: 'pending', label: 'Pending', color: 'border-amber-300' },
    { id: 'confirmed', label: 'Confirmed', color: 'border-blue-300' },
    { id: 'picking', label: 'Picking', color: 'border-purple-300' },
    { id: 'packing', label: 'Packing', color: 'border-indigo-300' },
    { id: 'out_for_delivery', label: 'Out for Delivery', color: 'border-green-300' }
  ]
  
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status)
  }
  
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {columns.map((column) => {
          const columnOrders = getOrdersByStatus(column.id)

          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className={`px-4 py-3 border-b-2 ${column.color} bg-neutral-50`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-body font-semibold text-neutral-800">
                      {column.label}
                    </h3>
                    <span className="px-2.5 py-1 bg-white rounded-full text-caption font-medium text-neutral-700">
                      {columnOrders.length}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {columnOrders.length === 0 ? (
                    <div className="text-center py-8 text-body-sm text-neutral-500">
                      No orders
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate(`/supplier/orders/${order.id}`)}
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="text-body font-semibold text-neutral-800 mb-1">
                              {order.orderNumber}
                            </p>
                            <div className="flex items-center gap-2 text-body-sm text-neutral-600">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatRelativeTime(order.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-body-sm text-neutral-700">
                              <Package className="w-4 h-4" />
                              <span>{order.items.length} items</span>
                            </div>
                            <p className="text-body font-semibold text-primary-600">
                              {formatCurrency(order.total)}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-neutral-200">
                            <div className="flex items-center gap-2 text-body-sm text-neutral-700">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {formatShortAddress(order.deliveryAddress)}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/supplier/orders/${order.id}`)
                            }}
                          >
                            {column.id === 'pending' && 'Confirm Order'}
                            {column.id === 'confirmed' && 'Start Picking'}
                            {column.id === 'picking' && 'Continue Picking'}
                            {column.id === 'packing' && 'Continue Packing'}
                            {column.id === 'out_for_delivery' && 'View Details'}
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}