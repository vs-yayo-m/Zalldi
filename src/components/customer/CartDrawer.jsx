// src/components/customer/CartDrawer.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import Button from '@/components/ui/Button'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import EmptyState from '@/components/shared/EmptyState'

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, isEmpty } = useCart()
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-neutral-800">
                  Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {isEmpty ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <EmptyState
                  icon={<ShoppingCart className="w-16 h-16" />}
                  title="Your cart is empty"
                  description="Add some products to get started"
                  action={
                    <Link to="/shop" onClick={closeDrawer}>
                      <Button variant="primary">
                        Start Shopping
                      </Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="border-t border-neutral-200 p-4 space-y-4">
                  <CartSummary />

                  <Link to="/checkout" onClick={closeDrawer}>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="w-5 h-5" />}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link to="/cart" onClick={closeDrawer}>
                    <Button variant="outline" size="lg" fullWidth>
                      View Full Cart
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}