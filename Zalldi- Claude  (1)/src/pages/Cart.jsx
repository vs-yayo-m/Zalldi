// src/pages/Cart.jsx

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import Cart from '@components/customer/Cart'
import EmptyState from '@components/shared/EmptyState'
import Button from '@components/ui/Button'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const navigate = useNavigate()
  const { items } = useCart()
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add some products to get started with your order"
            actionLabel="Start Shopping"
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
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Continue Shopping
          </Button>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-neutral-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <Cart />
      </div>
    </motion.div>
  )
}