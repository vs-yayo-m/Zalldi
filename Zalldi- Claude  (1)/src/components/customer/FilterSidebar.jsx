// src/components/customer/FilterSidebar.jsx

import React, { useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES } from '@/utils/constants'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import RatingStars from './RatingStars'

export default function FilterSidebar({
  filters = {},
  onChange,
  onClear,
  className = ''
}) {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  })
  
  const handleCategoryChange = (categoryId) => {
    const categories = filters.categories || []
    const updated = categories.includes(categoryId) ?
      categories.filter(id => id !== categoryId) :
      [...categories, categoryId]
    
    onChange({ ...filters, categories: updated })
  }
  
  const handleRatingChange = (rating) => {
    onChange({
      ...filters,
      minRating: filters.minRating === rating ? null : rating
    })
  }
  
  const handlePriceChange = () => {
    onChange({
      ...filters,
      minPrice: priceRange.min ? Number(priceRange.min) : null,
      maxPrice: priceRange.max ? Number(priceRange.max) : null
    })
  }
  
  const handleAvailabilityChange = (value) => {
    onChange({
      ...filters,
      inStock: filters.inStock === value ? null : value
    })
  }
  
  const hasActiveFilters =
    (filters.categories && filters.categories.length > 0) ||
    filters.minRating ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock !== undefined
  
  return (
    <div className={`bg-white rounded-lg border border-neutral-200 ${className}`}>
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-neutral-700" />
          <h3 className="font-semibold text-neutral-800">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="divide-y divide-neutral-200">
        <div className="p-4">
          <h4 className="font-semibold text-neutral-800 mb-3">Categories</h4>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <Checkbox
                key={category.id}
                label={category.name}
                checked={filters.categories?.includes(category.id) || false}
                onChange={() => handleCategoryChange(category.id)}
              />
            ))}
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-neutral-800 mb-3">Price Range</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handlePriceChange}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-neutral-800 mb-3">Rating</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  filters.minRating === rating
                    ? 'bg-orange-50 border border-orange-200'
                    : 'hover:bg-neutral-50'
                }`}
              >
                <RatingStars rating={rating} size="sm" />
                <span className="text-sm text-neutral-600">& up</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-neutral-800 mb-3">Availability</h4>
          <div className="space-y-2">
            <Checkbox
              label="In Stock"
              checked={filters.inStock === true}
              onChange={() => handleAvailabilityChange(true)}
            />
            <Checkbox
              label="Include Out of Stock"
              checked={filters.inStock === false}
              onChange={() => handleAvailabilityChange(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}