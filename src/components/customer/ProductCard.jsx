// src/components/customer/ProductCard.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Minus, Zap, Star } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency, formatDiscount } from '@/utils/formatters'
import Badge from '@/components/ui/Badge'
import StockIndicator from './StockIndicator'

export default function ProductCard({ product }) {
  const { addItem, removeItem, getItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  
  const cartItem = getItem(product.id)
  const itemCount = cartItem?.quantity || 0
  const isInCart = itemCount > 0
  
  const discount = product.discountPrice ?
    formatDiscount(product.price, product.discountPrice) : null
  
  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }
  
  const handleIncrement = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }
  
  const handleDecrement = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (itemCount === 1) {
      removeItem(product.id)
    } else {
      addItem(product, -1)
    }
  }
  
  const deliveryTime = product.deliveryTime || '16'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
      >
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-[1.02] transition-transform duration-200"
          />
          
          {/* Delivery Time Badge - Top Left */}
          {deliveryTime && (
            <Badge
              variant="solid"
              size="xs"
              className="absolute top-2 left-2 bg-green-500 text-white flex items-center gap-1 px-2 py-0.5"
            >
              <Zap className="w-2.5 h-2.5" />
              <span className="text-[10px] font-medium">{deliveryTime} MINS</span>
            </Badge>
          )}
          
          {/* Discount Badge - Top Right */}
          {discount && (
            <Badge
              variant="solid"
              size="xs"
              className="absolute top-2 right-2 bg-orange-500 text-white px-1.5 py-0.5"
            >
              <span className="text-[10px] font-medium">{discount}% OFF</span>
            </Badge>
          )}
          
          {/* Weight/Variant Badge - Bottom Left */}
          {product.variant && (
            <Badge
              variant="outline"
              size="xs"
              className="absolute bottom-2 left-2 bg-white/90 text-gray-700 border-gray-200 px-2 py-0.5"
            >
              <span className="text-[10px]">{product.variant}</span>
            </Badge>
          )}
          
          {/* Add/Quantity Counter - Bottom Right */}
          <div className="absolute bottom-2 right-2">
            {isInCart ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center bg-white rounded-full shadow-sm border border-green-500 overflow-hidden"
              >
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 h-7 flex items-center justify-center text-sm font-medium text-green-700">
                  {itemCount}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full shadow-sm hover:bg-green-600 transition-colors"
                aria-label="Add to cart"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-3">
          {/* Product Name */}
          <h3 className="font-medium text-gray-800 text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-1.5">
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-700 ml-1">
                  {product.rating}
                </span>
              </div>
              {product.reviewCount && (
                <span className="text-xs text-gray-500">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
          
          {/* Pricing */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            
            {product.discountPrice && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
                {product.mrp && (
                  <span className="text-xs text-gray-400">
                    MRP {formatCurrency(product.mrp)}
                  </span>
                )}
              </>
            )}
          </div>
          
          {/* Stock Indicator */}
          {product.stock && product.stock < 10 && (
            <div className="mt-1">
              <StockIndicator 
                stock={product.stock} 
                variant="text" 
                className="text-xs"
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}