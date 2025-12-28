// src/components/customer/OrderCard.jsx

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { formatCurrency, formatOrderNumber, formatDateTime, formatTimeRemaining } from '@utils/formatters'
import { ORDER_STATUS_LABELS } from '@utils/constants'
import { Package, Clock, MapPin, ChevronRight } from 'lucide-react'

export default function OrderCard({ order }) {
  const navigate = useNavigate()
  
  const getStatusVariant = () => {
    switch (order.status) {
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'error'
      case 'out_for_delivery':
        return 'warning'
      default:
        return 'info'
    }
  }
  
  const isActive = ['pending', 'confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
  
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
      className="bg-white rounded-2xl shadow-card p-6 cursor-pointer"
      onClick={() => navigate(`/customer/orders/${order.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-bold text-lg text-neutral-900 mb-1">
            {formatOrderNumber(order.orderNumber)}
          </p>
          <p className="text-sm text-neutral-600">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge variant={getStatusVariant()} size="lg">
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <Package className="w-4 h-4 text-neutral-500 flex-shrink-0" />
          <span className="text-neutral-600">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </span>
          <span className="text-neutral-400">•</span>
          <span className="font-semibold text-primary-600">
            {formatCurrency(order.total)}
          </span>
        </div>

        {isActive && order.estimatedDelivery && (
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-neutral-600">
              Delivery in {formatTimeRemaining(order.estimatedDelivery)}
            </span>
          </div>
        )}

        <div className="flex items-start gap-3 text-sm">
          <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
          <span className="text-neutral-600 line-clamp-1">
            {order.deliveryAddress.area}, Ward {order.deliveryAddress.ward}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item, index) => (
            item.image && (
              <div
                key={index}
                className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-neutral-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          ))}
          {order.items.length > 3 && (
            <div className="w-10 h-10 rounded-lg border-2 border-white bg-neutral-200 flex items-center justify-center">
              <span className="text-xs font-semibold text-neutral-600">
                +{order.items.length - 3}
              </span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation()
            if (isActive) {
              navigate(`/track/${order.id}`)
            } else {
              navigate(`/customer/orders/${order.id}`)
            }
          }}
        >
          {isActive ? 'Track Order' : 'View Details'}
        </Button>
      </div>
    </motion.div>
  )
}