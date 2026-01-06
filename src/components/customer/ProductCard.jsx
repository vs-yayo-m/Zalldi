// src/components/customer/ProductCard.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency, formatDiscount } from '@/utils/formatters'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import RatingStars from './RatingStars'
import StockIndicator from './StockIndicator'

export default function ProductCard({ product }) {
  const { addItem, hasItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  
  const discount = product.discountPrice ?
    formatDiscount(product.price, product.discountPrice) :
    null
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product, 1)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {discount && (
            <Badge
              variant="solid"
              className="absolute top-3 left-3 bg-red-500 text-white"
            >
              {discount}% OFF
            </Badge>
          )}

          {product.featured && (
            <Badge
              variant="solid"
              className="absolute top-3 right-3 bg-orange-500 text-white"
            >
              Featured
            </Badge>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
          >
            <button
              onClick={handleAddToCart}
              className="p-3 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              className="p-3 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-neutral-800 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <RatingStars rating={product.rating || 0} size="sm" />
            <span className="text-sm text-neutral-600">
              ({product.reviewCount || 0})
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-orange-500">
                {formatCurrency(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          <StockIndicator stock={product.stock} />

          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-3"
          >
            {hasItem(product.id) ? 'Add More' : 'Add to Cart'}
          </Button>
        </div>
      </Link>
    </motion.div>
  )
}