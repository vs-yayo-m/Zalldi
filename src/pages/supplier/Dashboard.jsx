// src/pages/supplier/Dashboard.jsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useOrders } from '@hooks/useOrders'
import SupplierDashboard from '@components/supplier/SupplierDashboard'
import LoadingScreen from '@components/shared/LoadingScreen'
import { USER_ROLES } from '@utils/constants'

export default function SupplierDashboardPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { orders, loading: ordersLoading } = useOrders()
  
  useEffect(() => {
    if (!authLoading && (!user || user.role !== USER_ROLES.SUPPLIER)) {
      navigate('/login?redirect=/supplier/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  if (authLoading || ordersLoading) {
    return <LoadingScreen />
  }
  
  if (!user || user.role !== USER_ROLES.SUPPLIER) {
    return null
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
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Supplier Dashboard
          </h1>
          <p className="text-neutral-600">
            Welcome back, {user.displayName || user.businessName || 'Supplier'}!
          </p>
        </motion.div>

        <SupplierDashboard orders={orders} />
      </div>
    </motion.div>
  )
}