// src/pages/customer/Wishlist.jsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useWishlist } from '@hooks/useWishlist'
import WishlistCard from '@components/customer/WishlistCard'
import WishlistGrid from '@components/customer/WishlistGrid'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function Wishlist() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { items, loading: wishlistLoading } = useWishlist()
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/wishlist', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  if (authLoading || wishlistLoading) {
    return <LoadingScreen />
  }
  
  if (!user) {
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
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-neutral-600">
                {items.length === 0 ? 'No items saved yet' : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
              </p>
            </div>
            {items.length > 0 && (
              <Button
                onClick={() => navigate('/shop')}
                leftIcon={<ShoppingBag className="w-5 h-5" />}
              >
                Continue Shopping
              </Button>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Save your favorite products to buy them later"
              actionLabel="Browse Products"
              onAction={() => navigate('/shop')}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WishlistGrid items={items} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}