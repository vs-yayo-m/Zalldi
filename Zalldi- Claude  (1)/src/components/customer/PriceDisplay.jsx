// src/components/customer/PriceDisplay.jsx

import React from 'react'
import { formatCurrency, formatDiscount } from '@/utils/formatters'
import Badge from '@/components/ui/Badge'

export default function PriceDisplay({
  price,
  discountPrice,
  size = 'md',
  showSavings = true,
  className = ''
}) {
  const sizes = {
    sm: {
      current: 'text-lg',
      original: 'text-sm',
      badge: 'text-xs'
    },
    md: {
      current: 'text-2xl',
      original: 'text-base',
      badge: 'text-sm'
    },
    lg: {
      current: 'text-3xl',
      original: 'text-lg',
      badge: 'text-base'
    }
  }
  
  const sizeClasses = sizes[size] || sizes.md
  const hasDiscount = discountPrice && discountPrice < price
  const currentPrice = hasDiscount ? discountPrice : price
  const discount = hasDiscount ? formatDiscount(price, discountPrice) : null
  const savings = hasDiscount ? price - discountPrice : 0
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-orange-500 ${sizeClasses.current}`}>
          {formatCurrency(currentPrice)}
        </span>
        
        {hasDiscount && (
          <span className={`text-neutral-500 line-through ${sizeClasses.original}`}>
            {formatCurrency(price)}
          </span>
        )}
      </div>

      {hasDiscount && discount && (
        <Badge variant="solid" className="bg-red-500 text-white">
          {discount}% OFF
        </Badge>
      )}

      {hasDiscount && showSavings && savings > 0 && (
        <span className={`text-green-600 font-medium ${sizeClasses.badge}`}>
          Save {formatCurrency(savings)}
        </span>
      )}
    </div>
  )
}