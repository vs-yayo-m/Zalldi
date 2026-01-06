// src/components/customer/ProductCard.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency, formatDiscount } from '@/utils/formatters'
import RatingStars from './RatingStars'

export default function ProductCard({ product }) {
  const { addItem, removeItem, getItemQuantity } = useCart()
  const quantity = getItemQuantity(product.id) || 0
  
  const discount = product.discountPrice ?
    formatDiscount(product.price, product.discountPrice) :
    null
  
  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product, 1)
  }
  
  const handleRemove = (e) => {
    e.preventDefault()
    removeItem(product.id, 1)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* IMAGE */}
        <div className="relative aspect-[4/3] bg-neutral-100 rounded-t-xl overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* DISCOUNT */}
          {discount && (
            <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-medium">
              {discount}% OFF
            </span>
          )}

          {/* DELIVERY BADGE */}
          <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-orange-500/90 text-white font-medium">
            ⚡ 10–15 mins
          </span>

          {/* ADD / COUNTER */}
          <div className="absolute top-2 right-2">
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center bg-white rounded-full border shadow-sm overflow-hidden">
                <button
                  onClick={handleRemove}
                  className="p-1.5 hover:bg-neutral-100"
                >
                  <Minus className="w-3 h-3 text-orange-500" />
                </button>
                <span className="px-2 text-xs font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={handleAdd}
                  className="p-1.5 hover:bg-neutral-100"
                >
                  <Plus className="w-3 h-3 text-orange-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3 space-y-1.5">
          {/* PRODUCT NAME */}
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-2">
            {product.name}
          </h3>

          {/* WEIGHT / VARIANT */}
          {product.variant && (
            <p className="text-xs text-neutral-500">
              {product.variant}
            </p>
          )}

          {/* RATING */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-neutral-600">
              <RatingStars rating={product.rating} size="xs" />
              <span>({product.reviewCount || 0})</span>
            </div>
          )}

          {/* PRICE */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* STOCK */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-[11px] text-orange-600 font-medium">
              Only {product.stock} left
            </p>
          )}

          {product.stock === 0 && (
            <p className="text-[11px] text-red-500 font-medium">
              Out of stock
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}