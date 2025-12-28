// src/components/customer/QuantitySelector.jsx

import React from 'react'
import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 100,
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: {
      button: 'w-8 h-8',
      input: 'w-12 h-8 text-sm',
      icon: 'w-3 h-3'
    },
    md: {
      button: 'w-10 h-10',
      input: 'w-16 h-10',
      icon: 'w-4 h-4'
    },
    lg: {
      button: 'w-12 h-12',
      input: 'w-20 h-12 text-lg',
      icon: 'w-5 h-5'
    }
  }
  
  const sizeClasses = sizes[size] || sizes.md
  
  const handleDecrease = () => {
    if (quantity > min) {
      onChange(quantity - 1)
    }
  }
  
  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1)
    }
  }
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value) || min
    const clampedValue = Math.max(min, Math.min(max, value))
    onChange(clampedValue)
  }
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={`${sizeClasses.button} flex items-center justify-center bg-neutral-100 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:text-current`}
        aria-label="Decrease quantity"
      >
        <Minus className={sizeClasses.icon} />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
        className={`${sizeClasses.input} text-center font-semibold text-neutral-800 border border-neutral-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20`}
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`${sizeClasses.button} flex items-center justify-center bg-neutral-100 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:text-current`}
        aria-label="Increase quantity"
      >
        <Plus className={sizeClasses.icon} />
      </button>
    </div>
  )
}