// src/pages/Checkout.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useCart } from '@hooks/useCart'
import Checkout from '@components/customer/Checkout'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'
import { ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { items, loading: cartLoading } = useCart()
  const [isInitializing, setIsInitializing] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/checkout', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !isInitializing) {
      navigate('/shop', { replace: true })
    }
  }, [items, cartLoading, navigate, isInitializing])
  
  if (authLoading || cartLoading || isInitializing) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return null
  }
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add items to your cart before checking out"
            actionLabel="Continue Shopping"
            onAction={() => navigate('/shop')}
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
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Checkout
          </h1>
          <p className="text-neutral-600 mb-8">
            Complete your order and get it delivered in 1 hour
          </p>
        </motion.div>

        <Checkout />
      </div>
    </motion.div>
  )
}