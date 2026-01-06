// src/components/customer/ProductCard.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency, formatDiscount } from '@/utils/formatters'
import Badge from '@/components/ui/Badge'
import RatingStars from './RatingStars'
import StockIndicator from './StockIndicator'

export default function ProductCard({ product }) {
  const { addItem, removeItem, getItemQuantity } = useCart()
  const quantity = getItemQuantity?.(product.id) || 0
  
  const discount = product.discountPrice ?
    formatDiscount(product.price, product.discountPrice) :
    null
  
  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }
  
  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    removeItem(product.id, 1)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="group relative"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* DISCOUNT BADGE */}
          {discount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-md">
              {discount}% OFF
            </Badge>
          )}

          {/* DELIVERY BADGE */}
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">
            ⚡ In mins
          </div>

          {/* ADD / COUNTER */}
          <div className="absolute top-2 right-2 z-10">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={handleAdd}
                  className="bg-white text-orange-500 text-xs font-semibold px-3 py-1 rounded-lg border border-orange-500 shadow-sm hover:bg-orange-50"
                >
                  ADD
                </motion.button>
              ) : (
                <motion.div
                  key="counter"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex items-center bg-white rounded-lg shadow-sm border border-orange-500 overflow-hidden"
                >
                  <button
                    onClick={handleRemove}
                    className="px-2 py-1 text-orange-500 hover:bg-orange-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 text-xs font-semibold text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="px-2 py-1 text-orange-500 hover:bg-orange-50"
                  >
                    <Plus size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3 space-y-1">
          {/* PRODUCT NAME */}
          <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">
            {product.name}
          </h3>

          {/* WEIGHT / VARIANT */}
          {product.weight && (
            <div className="text-[11px] text-neutral-500">
              {product.weight}
            </div>
          )}

          {/* RATING */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-neutral-600">
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
              <span className="text-[11px] text-neutral-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* STOCK */}
          <div className="text-[11px]">
            <StockIndicator stock={product.stock} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}