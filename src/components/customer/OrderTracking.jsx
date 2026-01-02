// src/components/customer/OrderTracking.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import OrderTimeline from './OrderTimeline'
import TrackingMap from './TrackingMap'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Alert from '@components/ui/Alert'
import { formatCurrency, formatOrderNumber, formatDateTime, formatTimeRemaining } from '@utils/formatters'
import { ORDER_STATUS, ORDER_STATUS_LABELS, CONTACT } from '@utils/constants'
import { 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Truck
} from 'lucide-react'

export default function OrderTracking({ order }) {
  const [timeRemaining, setTimeRemaining] = useState('')
  const [isDelayed, setIsDelayed] = useState(false)

  useEffect(() => {
    if (!order.estimatedDelivery) return

    const updateTimer = () => {
      const now = new Date()
      const estimated = new Date(order.estimatedDelivery)
      const remaining = estimated - now

      if (remaining <= 0 && order.status !== 'delivered') {
        setIsDelayed(true)
        setTimeRemaining('Delayed')
      } else if (order.status === 'delivered') {
        setTimeRemaining('Delivered')
      } else {
        setTimeRemaining(formatTimeRemaining(estimated))
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000)

    return () => clearInterval(interval)
  }, [order.estimatedDelivery, order.status])

  const getStatusColor = () => {
    if (order.status === 'delivered') return 'success'
    if (order.status === 'cancelled') return 'error'
    if (isDelayed) return 'warning'
    return 'info'
  }

  const handleContactSupport = () => {
    window.open(`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}?text=Hi, I need help with order ${order.orderNumber}`, '_blank')
  }

  const handleCallSupport = () => {
    window.location.href = `tel:${CONTACT.phone}`
  }

  return (
    <div className="space-y-6">
      {isDelayed && order.status !== 'delivered' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="warning" icon={<AlertCircle className="w-5 h-5" />}>
            <div>
              <p className="font-semibold">Delivery Delayed</p>
              <p className="text-sm mt-1">
                Your order is taking longer than expected. Our team is working to deliver it as soon as possible.
              </p>
            </div>
          </Alert>
        </motion.div>
      )}

      {order.status === 'delivered' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="success" icon={<CheckCircle className="w-5 h-5" />}>
            <div>
              <p className="font-semibold">Order Delivered Successfully</p>
              <p className="text-sm mt-1">
                Your order was delivered on {formatDateTime(order.actualDelivery)}
              </p>
            </div>
          </Alert>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                <p className="font-bold text-xl text-neutral-900">
                  {formatOrderNumber(order.orderNumber)}
                </p>
              </div>
              <Badge variant={getStatusColor()} size="lg">
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Est. Delivery</p>
                  <p className="font-semibold text-neutral-900">{timeRemaining}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Items</p>
                  <p className="font-semibold text-neutral-900">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total</p>
                  <p className="font-semibold text-primary-600">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">
              Order Status
            </h2>
            <OrderTimeline order={order} />
          </motion.div>

          {order.deliveryAddress?.coordinates && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">
                Delivery Location
              </h2>
              <TrackingMap
                destination={order.deliveryAddress.coordinates}
                orderStatus={order.status}
              />
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-card p-6 sticky top-24"
          >
            <h3 className="font-display text-lg font-bold text-neutral-900 mb-4">
              Delivery Address
            </h3>
            <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl mb-6">
              <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-neutral-900 font-medium">{order.deliveryAddress.street}</p>
                <p className="text-neutral-600 text-sm">{order.deliveryAddress.area}</p>
                <p className="text-neutral-600 text-sm">Ward {order.deliveryAddress.ward}, Butwal</p>
                {order.deliveryAddress.landmark && (
                  <p className="text-neutral-500 text-sm mt-1">
                    Near {order.deliveryAddress.landmark}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-neutral-900">
                Need Help?
              </h3>
              
              <Button
                variant="outline"
                fullWidth
                leftIcon={<MessageCircle className="w-5 h-5" />}
                onClick={handleContactSupport}
              >
                WhatsApp Support
              </Button>

              <Button
                variant="outline"
                fullWidth
                leftIcon={<Phone className="w-5 h-5" />}
                onClick={handleCallSupport}
              >
                Call Support
              </Button>
            </div>

            {order.notes && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm font-semibold text-blue-900 mb-1">Delivery Notes</p>
                <p className="text-sm text-blue-700">{order.notes}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card p-6"
      >
        <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">
          Order Items
        </h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-neutral-900">{item.name}</p>
                <p className="text-sm text-neutral-600">
                  Qty: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-bold text-neutral-900">
                {formatCurrency(item.total)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="space-y-2">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}