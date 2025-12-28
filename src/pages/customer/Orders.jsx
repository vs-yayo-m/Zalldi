// src/pages/customer/Orders.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useOrders } from '@hooks/useOrders'
import OrderCard from '@components/customer/OrderCard'
import Tabs from '@components/ui/Tabs'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'
import { Package, ArrowLeft } from 'lucide-react'
import Button from '@components/ui/Button'

export default function Orders() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { orders, loading: ordersLoading, getActiveOrders, getCompletedOrders, getCancelledOrders } = useOrders()
  const [activeTab, setActiveTab] = useState('all')
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/orders', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  if (authLoading || ordersLoading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return null
  }
  
  const allOrders = orders
  const activeOrders = getActiveOrders()
  const completedOrders = getCompletedOrders()
  const cancelledOrders = getCancelledOrders()
  
  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'active':
        return activeOrders
      case 'completed':
        return completedOrders
      case 'cancelled':
        return cancelledOrders
      default:
        return allOrders
    }
  }
  
  const filteredOrders = getFilteredOrders()
  
  const tabs = [
    { id: 'all', label: 'All Orders', count: allOrders.length },
    { id: 'active', label: 'Active', count: activeOrders.length },
    { id: 'completed', label: 'Completed', count: completedOrders.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelledOrders.length }
  ]
  
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
            onClick={() => navigate('/customer/dashboard')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Dashboard
          </Button>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            My Orders
          </h1>
          <p className="text-neutral-600">
            Track and manage all your orders
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </motion.div>

        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EmptyState
              icon={Package}
              title={`No ${activeTab === 'all' ? '' : activeTab} orders`}
              description={
                activeTab === 'all'
                  ? 'Start shopping to see your orders here'
                  : `You don't have any ${activeTab} orders`
              }
              actionLabel="Browse Products"
              onAction={() => navigate('/shop')}
            />
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}