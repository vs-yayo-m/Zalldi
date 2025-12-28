// src/components/customer/Cart.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import Button from '@components/ui/Button'
import Alert from '@components/ui/Alert'
import Modal from '@components/ui/Modal'
import { calculateOrderTotal } from '@utils/calculations'
import { Trash2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [showClearModal, setShowClearModal] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  
  const orderTotals = calculateOrderTotal(items, 'standard', 0)
  
  const handleRemoveItem = (itemId) => {
    removeItem(itemId)
    toast.success('Item removed from cart')
  }
  
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }
    updateQuantity(itemId, newQuantity)
  }
  
  const handleClearCart = async () => {
    setIsClearing(true)
    try {
      await clearCart()
      toast.success('Cart cleared')
      setShowClearModal(false)
    } catch (error) {
      toast.error('Failed to clear cart')
    } finally {
      setIsClearing(false)
    }
  }
  
  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout')
      return
    }
    navigate('/checkout')
  }
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-neutral-900">
                Cart Items
              </h2>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClearModal(true)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <CartItem
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <Alert variant="info" icon={<AlertCircle className="w-5 h-5" />}>
            <div>
              <p className="font-semibold">1-Hour Delivery Guarantee</p>
              <p className="text-sm mt-1">
                Your order will be delivered within 1 hour or delivery is free
              </p>
            </div>
          </Alert>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CartSummary
              items={items}
              totals={orderTotals}
              onCheckout={handleCheckout}
              showCheckout={true}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Cart"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowClearModal(false)}
              disabled={isClearing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleClearCart}
              disabled={isClearing}
              loading={isClearing}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isClearing ? 'Clearing...' : 'Clear Cart'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}