// src/components/customer/WishlistCard.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWishlist } from '@hooks/useWishlist'
import { useCart } from '@hooks/useCart'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import RatingStars from './RatingStars'
import PriceDisplay from './PriceDisplay'
import StockIndicator from './StockIndicator'
import { formatDiscount } from '@utils/formatters'
import toast from 'react-hot-toast'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'

export default function WishlistCard({ product }) {
  const navigate = useNavigate()
  const { removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const [isRemoving, setIsRemoving] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const discount = product.comparePrice ? formatDiscount(product.comparePrice, product.price) : null
  
  const handleRemove = async (e) => {
    e.stopPropagation()
    setIsRemoving(true)
    try {
      await removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove from wishlist')
    } finally {
      setIsRemoving(false)
    }
  }
  
  const handleAddToCart = async (e) => {
    e.stopPropagation()
    setIsAddingToCart(true)
    try {
      await addItem(product, 1)
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
      className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {discount && (
          <Badge
            variant="error"
            className="absolute top-3 left-3"
          >
            {discount}% OFF
          </Badge>
        )}

        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isRemoving ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
          )}
        </button>

        <StockIndicator stock={product.stock} className="absolute bottom-3 left-3" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={product.rating || 0} size="sm" />
          <span className="text-sm text-neutral-600">
            ({product.reviewCount || 0})
          </span>
        </div>

        <PriceDisplay
          price={product.price}
          comparePrice={product.comparePrice}
          className="mb-4"
        />

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          loading={isAddingToCart}
          leftIcon={<ShoppingCart className="w-4 h-4" />}
          fullWidth
          size="sm"
        >
          {product.stock === 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  )
}