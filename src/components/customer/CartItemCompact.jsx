// src/components/customer/CartItemCompact.jsx

import { useState, useEffect } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@hooks/useCart'
import { formatCurrency } from '@utils/formatters'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function CartItemCompact({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const [localQuantity, setLocalQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const price = item.discountPrice || item.price
  const total = price * localQuantity
  const hasDiscount = item.discountPrice && item.discountPrice < item.price
  
  useEffect(() => {
    setLocalQuantity(item.quantity)
  }, [item.quantity])
  
  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) {
      handleRemove()
      return
    }
    
    if (newQty > item.stock) {
      toast.error('Not enough stock')
      return
    }
    
    if (newQty > (item.maxOrder || 99)) {
      toast.error(`Max ${item.maxOrder || 99} items allowed`)
      return
    }
    
    setIsUpdating(true)
    setLocalQuantity(newQty)
    
    setTimeout(() => {
      updateQuantity(item.id, newQty)
      setIsUpdating(false)
    }, 200)
  }
  
  const handleRemove = () => {
    removeItem(item.id)
    toast.success('Removed from cart', {
      icon: '🗑️',
      duration: 2000
    })
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="relative p-3"
    >
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
          <img
            src={item.images?.[0] || '/placeholder.png'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xs font-bold text-neutral-900 leading-tight line-clamp-2">
              {item.name}
            </h3>
            
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-neutral-400 hover:text-red-600" />
            </button>
          </div>

          {item.unit && (
            <div className="text-[10px] font-bold text-neutral-400 uppercase mt-0.5">
              {item.unit}
            </div>
          )}

          {/* Price & Quantity Row */}
          <div className="flex items-center justify-between mt-2 gap-3">
            {/* Price */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-orange-600">
                {formatCurrency(price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-neutral-400 line-through">
                  {formatCurrency(item.price)}
                </span>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-0.5">
              <button
                onClick={() => handleQuantityChange(localQuantity - 1)}
                disabled={isUpdating || localQuantity <= 1}
                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors disabled:opacity-50"
              >
                <Minus className="w-3 h-3 text-neutral-700" />
              </button>

              <motion.div
                key={localQuantity}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-8 text-center"
              >
                <span className="text-sm font-black text-neutral-900">
                  {localQuantity}
                </span>
              </motion.div>

              <button
                onClick={() => handleQuantityChange(localQuantity + 1)}
                disabled={isUpdating || localQuantity >= item.stock}
                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors disabled:opacity-50"
              >
                <Plus className="w-3 h-3 text-neutral-700" />
              </button>
            </div>
          </div>

          {/* Stock Warning */}
          {item.stock < 5 && item.stock > 0 && (
            <div className="mt-1.5 text-[9px] font-bold text-orange-600 uppercase">
              Only {item.stock} left in stock
            </div>
          )}

          {item.stock === 0 && (
            <div className="mt-1.5 text-[9px] font-bold text-red-600 uppercase">
              Out of stock
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}