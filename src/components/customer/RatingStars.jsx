// src/components/customer/RatingStars.jsx

import React from 'react'
import { Star, StarHalf } from 'lucide-react'

export default function RatingStars({ rating = 0, size = 'md', showValue = false, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const sizeClass = sizes[size] || sizes.md
  
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className={`${sizeClass} fill-orange-500 text-orange-500`}
          />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`${sizeClass} fill-orange-500 text-orange-500`}
          />
        )
      } else {
        stars.push(
          <Star
            key={i}
            className={`${sizeClass} text-neutral-300`}
          />
        )
      }
    }
    
    return stars
  }
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-neutral-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}