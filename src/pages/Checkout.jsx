// src/pages/Checkout.jsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Checkout from '@components/customer/Checkout'
import { useCart } from '@hooks/useCart'
import { ROUTES } from '@utils/constants'
import { seoUtils } from '@utils/seo'
import EmptyState from '@components/shared/EmptyState'
import { ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items } = useCart()
  
  useEffect(() => {
    seoUtils.setPageMeta({
      title: 'Checkout',
      description: 'Complete your order and get it delivered in 1 hour',
      url: `${window.location.origin}${ROUTES.CHECKOUT}`
    })
  }, [])
  
  useEffect(() => {
    if (items.length === 0) {
      navigate(ROUTES.SHOP)
    }
  }, [items, navigate])
  
  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              message="Add items to your cart before proceeding to checkout"
              actionLabel="Continue Shopping"
              onAction={() => navigate(ROUTES.SHOP)}
            />
          </div>
        </div>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50/30 to-neutral-50 pt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Checkout />
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  )
}