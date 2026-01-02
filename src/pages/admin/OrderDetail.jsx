// path: src/pages/admin/OrderDetail.jsx

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  MessageSquare,
  Package,
  Truck,
} from 'lucide-react'

import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import LoadingScreen from '@components/shared/LoadingScreen'

import {
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '@services/order.service'

import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@utils/constants'
import {
  formatCurrency,
  formatDateTime,
  formatAddress,
} from '@utils/formatters'

import toast from 'react-hot-toast'

export default function AdminOrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (orderId) fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await getOrderById(orderId)
      setOrder(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order moved to ${ORDER_STATUS_LABELS[newStatus]}`)
      await fetchOrder()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Cancel this order?')) return
    try {
      setUpdating(true)
      await cancelOrder(orderId, 'Cancelled by admin')
      toast.success('Order cancelled')
      await fetchOrder()
    } catch (error) {
      console.error(error)
      toast.error('Failed to cancel order')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = useCallback((status) => {
    const map = {
      [ORDER_STATUS.PENDING]: 'orange',
      [ORDER_STATUS.CONFIRMED]: 'blue',
      [ORDER_STATUS.PICKING]: 'purple',
      [ORDER_STATUS.PACKING]: 'indigo',
      [ORDER_STATUS.OUT_FOR_DELIVERY]: 'cyan',
      [ORDER_STATUS.DELIVERED]: 'green',
      [ORDER_STATUS.CANCELLED]: 'red',
    }
    return map[status] || 'gray'
  }, [])

  const nextStatus = useMemo(() => {
    const flow = {
      [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
      [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PICKING,
      [ORDER_STATUS.PICKING]: ORDER_STATUS.PACKING,
      [ORDER_STATUS.PACKING]: ORDER_STATUS.OUT_FOR_DELIVERY,
      [ORDER_STATUS.OUT_FOR_DELIVERY]: ORDER_STATUS.DELIVERED,
    }
    return flow[order?.status]
  }, [order])

  const canProgress =
    nextStatus &&
    order?.status !== ORDER_STATUS.DELIVERED &&
    order?.status !== ORDER_STATUS.CANCELLED

  if (loading) return <LoadingScreen />

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-display font-display font-bold mb-3">
            Order Not Found
          </h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-display font-display font-bold">
                Order #{order.orderNumber}
              </h1>
              <p className="text-body text-neutral-600">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {canProgress && (
                <Button
                  onClick={() => handleStatusUpdate(nextStatus)}
                  loading={updating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Move to {ORDER_STATUS_LABELS[nextStatus]}
                </Button>
              )}

              {order.status !== ORDER_STATUS.CANCELLED &&
                order.status !== ORDER_STATUS.DELIVERED && (
                  <Button
                    variant="secondary"
                    onClick={handleCancelOrder}
                    loading={updating}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                )}

              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-title font-display font-bold">
                  Order Status
                </h2>
                <Badge variant={getStatusColor(order.status)}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>

              <AnimatePresence>
                {(order.statusHistory || []).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      {i <
                        (order.statusHistory?.length || 0) - 1 && (
                        <div className="w-px flex-1 bg-neutral-200 my-2" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {ORDER_STATUS_LABELS[item.status]}
                      </p>
                      <p className="text-body-sm text-neutral-600">
                        {formatDateTime(item.timestamp)}
                      </p>
                      {item.note && (
                        <p className="text-body-sm text-neutral-500 mt-1">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-title font-display font-bold mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="flex gap-4 bg-neutral-50 p-4 rounded-xl"
                  >
                    <img
                      src={item.image || '/placeholder.png'}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-body-sm text-neutral-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-bold">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <Row label="Subtotal" value={order.subtotal} />
                <Row label="Delivery Fee" value={order.deliveryFee} />
                {order.discount > 0 && (
                  <Row
                    label="Discount"
                    value={-order.discount}
                    highlight
                  />
                )}
                <div className="flex justify-between text-title font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <InfoCard
              icon={User}
              title="Customer Details"
              items={[
                { label: 'Name', value: order.customerName },
                {
                  label: 'Phone',
                  value: (
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-orange-600"
                    >
                      {order.customerPhone}
                    </a>
                  ),
                },
                order.customerEmail && {
                  label: 'Email',
                  value: (
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-orange-600 break-all"
                    >
                      {order.customerEmail}
                    </a>
                  ),
                },
              ].filter(Boolean)}
            />

            <InfoCard
              icon={MapPin}
              title="Delivery Address"
              items={[
                {
                  label: 'Address',
                  value: formatAddress(order.deliveryAddress),
                },
              ]}
            />

            <InfoCard
              icon={Clock}
              title="Delivery Info"
              items={[
                {
                  label: 'Estimated',
                  value: formatDateTime(order.estimatedDelivery),
                },
                {
                  label: 'Payment',
                  value: order.paymentMethod.toUpperCase(),
                },
              ]}
            />

            {order.notes && (
              <div className="bg-orange-50 p-6 rounded-2xl">
                <h3 className="font-display font-bold mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
                  Order Notes
                </h3>
                <p>{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

/* ---------- helpers ---------- */

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-600">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? 'text-green-600' : ''
        }`}
      >
        {formatCurrency(value)}
      </span>
    </div>
  )
}

function InfoCard({ icon: Icon, title, items }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="text-title font-display font-bold mb-4 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-orange-500" />
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <p className="text-body-sm text-neutral-600">
              {item.label}
            </p>
            <p className="font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}