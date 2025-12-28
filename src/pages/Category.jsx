// src/pages/Category.jsx

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { CATEGORIES } from '@/utils/constants'
import ProductGrid from '@/components/customer/ProductGrid'
import SortDropdown from '@/components/customer/SortDropdown'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import EmptyState from '@/components/shared/EmptyState'
import { Package } from 'lucide-react'

export default function Category() {
  const { categoryId } = useParams()
  const [sortBy, setSortBy] = useState('relevance')
  
  const category = CATEGORIES.find(cat => cat.id === categoryId)
  const { products, loading } = useProducts({ category: categoryId, active: true })
  
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discountPrice || a.price) - (b.discountPrice || b.price)
      case 'price-high':
        return (b.discountPrice || b.price) - (a.discountPrice || a.price)
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'popular':
        return (b.soldCount || 0) - (a.soldCount || 0)
      default:
        return 0
    }
  })
  
  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="Category Not Found"
          description="The category you're looking for doesn't exist"
        />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: category.name, to: `/category/${categoryId}` }
          ]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              {category.name}
            </h1>
            <p className="text-neutral-600">
              {loading ? 'Loading...' : `${sortedProducts.length} products available`}
            </p>
          </div>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        <ProductGrid products={sortedProducts} loading={loading} />
      </div>
    </div>
  )
}