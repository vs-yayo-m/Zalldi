// src/components/customer/CartItem.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/formatters'
import Badge from '@/components/ui/Badge'

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart()
  
  const price = item.discountPrice || item.price
  const total = price * item.quantity
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 bg-white rounded-lg border border-neutral-200 hover:border-orange-200 transition-colors"
    >
      <Link to={`/product/${item.slug}`} className="flex-shrink-0">
        <img
          src={item.images?.[0] || '/placeholder.png'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.slug}`}
          className="font-semibold text-neutral-800 hover:text-orange-500 transition-colors line-clamp-2"
        >
          {item.name}
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-orange-500">
            {formatCurrency(price)}
          </span>
          {item.discountPrice && (
            <span className="text-sm text-neutral-500 line-through">
              {formatCurrency(item.price)}
            </span>
          )}
        </div>

        {item.quantity >= item.stock && (
          <Badge variant="error" size="sm" className="mt-2">
            Low Stock
          </Badge>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseQuantity(item.id)}
              className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-10 text-center font-semibold text-neutral-800">
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQuantity(item.id)}
              disabled={item.quantity >= item.stock || item.quantity >= item.maxOrder}
              className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="font-bold text-lg text-neutral-800">
          {formatCurrency(total)}
        </p>
      </div>
    </motion.div>
  )
}