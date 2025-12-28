// src/pages/OrderSuccess.jsx

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrderById } from '@services/order.service'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import Confetti from '@components/animations/Confetti'
import { formatCurrency, formatOrderNumber, formatDateTime } from '@utils/formatters'
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from 'lucide-react'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (orderId) {
      fetchOrder()
    }
    
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [orderId])
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Order not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      {showConfetti && <Confetti />}
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-8 sm:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-3"
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600 mb-8"
          >
            Thank you for your order. We'll deliver it within 1 hour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-primary-50 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                <p className="font-bold text-neutral-900 text-lg">
                  {formatOrderNumber(order.orderNumber)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Order Total</p>
                <p className="font-bold text-primary-600 text-lg">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl text-left">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 mb-1">Estimated Delivery</p>
                <p className="text-sm text-neutral-600">
                  {formatDateTime(order.estimatedDelivery)}
                </p>
                <p className="text-sm text-primary-600 font-medium mt-1">
                  Within 1 hour guaranteed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl text-left">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 mb-1">Delivery Address</p>
                <p className="text-sm text-neutral-600">
                  {order.deliveryAddress.street}, {order.deliveryAddress.area}
                </p>
                <p className="text-sm text-neutral-600">
                  Ward {order.deliveryAddress.ward}, Butwal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl text-left">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 mb-1">Order Items</p>
                <p className="text-sm text-neutral-600">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate(`/track/${order.id}`)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="flex-1"
            >
              Track Order
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-neutral-600"
        >
          <p>
            You will receive a confirmation email at{' '}
            <span className="font-semibold">{order.customerEmail}</span>
          </p>
          <p className="mt-2">
            Need help?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Contact Support
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}