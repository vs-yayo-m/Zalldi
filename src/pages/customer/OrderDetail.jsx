// src/pages/customer/OrderDetail.jsx

import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useOrders } from '@hooks/useOrders'
import OrderTracking from '@components/customer/OrderTracking'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'
import Button from '@components/ui/Button'
import { Package, ArrowLeft } from 'lucide-react'

export default function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { order, loading: orderLoading, fetchOrder } = useOrders({ autoFetch: false })
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/orders', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  useEffect(() => {
    if (orderId && user) {
      fetchOrder(orderId)
    }
  }, [orderId, user, fetchOrder])
  
  if (authLoading || orderLoading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return null
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={Package}
            title="Order not found"
            description="We couldn't find the order you're looking for"
            actionLabel="View All Orders"
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
            Order Details
          </h1>
          <p className="text-neutral-600">
            View complete information about your order
          </p>
        </motion.div>

        <OrderTracking order={order} />
      </div>
    </motion.div>
  )
}