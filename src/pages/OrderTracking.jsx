// src/pages/OrderTracking.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOrders } from '@hooks/useOrders'
import OrderTracking from '@components/customer/OrderTracking'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'
import Button from '@components/ui/Button'
import { Package, ArrowLeft } from 'lucide-react'

export default function OrderTrackingPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { order, loading, error, fetchOrder } = useOrders({ orderId, autoFetch: false })
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId).finally(() => {
        setIsInitialLoad(false)
      })
    }
  }, [orderId, fetchOrder])
  
  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true })
    }
  }, [orderId, navigate])
  
  if (loading && isInitialLoad) {
    return <LoadingScreen />
  }
  
  if (error || (!loading && !order)) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={Package}
            title="Order not found"
            description="We couldn't find the order you're looking for"
            actionLabel="Go to Orders"
            onAction={() => navigate('/customer/orders')}
          />
        </div>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-50 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/orders')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Orders
          </Button>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-neutral-600">
            Real-time updates on your delivery
          </p>
        </motion.div>

        {order && <OrderTracking order={order} />}
      </div>
    </motion.div>
  )
}