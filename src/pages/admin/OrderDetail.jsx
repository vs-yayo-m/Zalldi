// src/pages/admin/OrderDetail.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Package, User, MapPin, Phone, Mail, Clock, 
  CheckCircle, XCircle, Truck, Edit, Printer, MessageSquare
} from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import LoadingScreen from '@components/shared/LoadingScreen'
import { getOrderById, updateOrderStatus, cancelOrder } from '@services/order.service'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@utils/constants'
import { formatCurrency, formatDateTime, formatAddress } from '@utils/formatters'
import toast from 'react-hot-toast'

export default function AdminOrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await getOrderById(orderId)
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus]}`)
      await fetchOrder()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    try {
      setUpdating(true)
      await cancelOrder(orderId, 'Cancelled by admin')
      toast.success('Order cancelled')
      await fetchOrder()
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Failed to cancel order')
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: 'orange',
      [ORDER_STATUS.CONFIRMED]: 'blue',
      [ORDER_STATUS.PICKING]: 'purple',
      [ORDER_STATUS.PACKING]: 'indigo',
      [ORDER_STATUS.OUT_FOR_DELIVERY]: 'cyan',
      [ORDER_STATUS.DELIVERED]: 'green',
      [ORDER_STATUS.CANCELLED]: 'red'
    }
    return colors[status] || 'gray'
  }

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
      [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PICKING,
      [ORDER_STATUS.PICKING]: ORDER_STATUS.PACKING,
      [ORDER_STATUS.PACKING]: ORDER_STATUS.OUT_FOR_DELIVERY,
      [ORDER_STATUS.OUT_FOR_DELIVERY]: ORDER_STATUS.DELIVERED
    }
    return statusFlow[currentStatus]
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-heading font-display font-bold text-neutral-800 mb-4">Order Not Found</h1>
          <p className="text-body text-neutral-600 mb-8">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
        <Footer />
      </div>
    )
  }

  const nextStatus = getNextStatus(order.status)
  const canProgress = nextStatus && order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-display font-display font-bold text-neutral-900 mb-2">
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
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Move to {ORDER_STATUS_LABELS[nextStatus]}
                </Button>
              )}
              
              {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
                <Button
                  variant="secondary"
                  onClick={handleCancelOrder}
                  disabled={updating}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancel Order
                </Button>
              )}
              
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-5 h-5 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Print-only header */}
        <div className="print-only hidden">
          <div className="print-header">
            <h1 className="print-title">Zalldi</h1>
            <p className="print-subtitle">Order Receipt</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6 print-section">
              <div className="flex items-center justify-between mb-6 no-print">
                <h2 className="text-title font-display font-bold text-neutral-900">Order Status</h2>
                <Badge variant={getStatusColor(order.status)}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>

              {/* Print-only status */}
              <div className="print-only hidden mb-4">
                <span className={`print-badge ${order.status}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="relative">
                {(order.statusHistory || []).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      {index < (order.statusHistory?.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-neutral-200 my-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <p className="font-semibold text-neutral-900 mb-1">
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
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 print-section">
              <h2 className="text-title font-display font-bold text-neutral-900 mb-4">Order Items</h2>
              
              {/* Screen view */}
              <div className="space-y-4 no-print">
                {(order.items || []).map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-neutral-50 rounded-xl">
                    <img 
                      src={item.image || '/placeholder.png'} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">{item.name}</h3>
                      <p className="text-body-sm text-neutral-600 mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-bold text-neutral-900">
                        {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Print view - table format */}
              <div className="print-only hidden">
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3 print-summary">
                <div className="flex justify-between text-body print-summary-row">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-body print-summary-row">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span className="font-semibold">{formatCurrency(order.deliveryFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-body print-summary-row">
                    <span className="text-neutral-600">Discount</span>
                    <span className="font-semibold text-green-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-title font-bold pt-3 border-t border-neutral-200 print-summary-total">
                  <span>Total</span>
                  <span className="text-orange-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6 print-info-box">
              <h2 className="text-title font-display font-bold text-neutral-900 mb-4 flex items-center print-info-title no-print">
                <User className="w-5 h-5 mr-2 text-orange-500" />
                Customer Details
              </h2>
              <span className="print-info-title print-only hidden">Customer Details</span>
              
              <div className="space-y-3 print-info-content">
                <div>
                  <p className="text-body-sm text-neutral-600 mb-1">Name</p>
                  <p className="font-semibold text-neutral-900">{order.customerName}</p>
                </div>
                
                <div>
                  <p className="text-body-sm text-neutral-600 mb-1 flex items-center no-print">
                    <Phone className="w-4 h-4 mr-1" />
                    Phone
                  </p>
                  <p className="text-body-sm text-neutral-600 mb-1 print-only hidden">Phone</p>
                  <a 
                    href={`tel:${order.customerPhone}`}
                    className="font-semibold text-orange-600 hover:underline no-print"
                  >
                    {order.customerPhone}
                  </a>
                  <p className="font-semibold text-neutral-900 print-only hidden">
                    {order.customerPhone}
                  </p>
                </div>
                
                {order.customerEmail && (
                  <div>
                    <p className="text-body-sm text-neutral-600 mb-1 flex items-center no-print">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </p>
                    <p className="text-body-sm text-neutral-600 mb-1 print-only hidden">Email</p>
                    <a 
                      href={`mailto:${order.customerEmail}`}
                      className="font-semibold text-orange-600 hover:underline break-all no-print"
                    >
                      {order.customerEmail}
                    </a>
                    <p className="font-semibold text-neutral-900 break-all print-only hidden">
                      {order.customerEmail}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 print-info-box">
              <h2 className="text-title font-display font-bold text-neutral-900 mb-4 flex items-center print-info-title no-print">
                <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                Delivery Address
              </h2>
              <span className="print-info-title print-only hidden">Delivery Address</span>
              
              <p className="text-body text-neutral-700 leading-relaxed print-info-content">
                {formatAddress(order.deliveryAddress)}
              </p>
              
              {order.deliveryAddress?.landmark && (
                <p className="text-body-sm text-neutral-600 mt-2 print-info-content">
                  Landmark: {order.deliveryAddress.landmark}
                </p>
              )}
            </div>

            {order.notes && (
              <div className="bg-orange-50 rounded-2xl p-6 print-info-box">
                <h2 className="text-title font-display font-bold text-neutral-900 mb-3 flex items-center print-info-title no-print">
                  <MessageSquare className="w-5 h-5 mr-2 text-orange-500" />
                  Order Notes
                </h2>
                <span className="print-info-title print-only hidden">Order Notes</span>
                <p className="text-body text-neutral-700 print-info-content">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Print footer */}
        <div className="print-only hidden print-footer">
          <p>Thank you for your order!</p>
          <p className="print-contact">
            Zalldi - Fast 1-Hour Delivery in Butwal<br />
            Contact: +977 9821072912 | support.zalldi@gmail.com<br />
            www.zalldi.com.np
          </p>
          <p style={{ fontSize: '8pt', marginTop: '10px' }}>
            Printed on {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}