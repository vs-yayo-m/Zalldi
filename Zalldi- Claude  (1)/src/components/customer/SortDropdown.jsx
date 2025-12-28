// src/components/customer/SortDropdown.jsx

import React from 'react'
import { ArrowUpDown } from 'lucide-react'
import Dropdown from '@/components/ui/Dropdown'

export default function SortDropdown({ value, onChange, className = '' }) {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ]
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-5 h-5 text-neutral-600" />
      <span className="text-sm font-medium text-neutral-700">Sort by:</span>
      <Dropdown
        options={sortOptions}
        value={value}
        onChange={onChange}
        className="min-w-48"
      />
    </div>
  )
}