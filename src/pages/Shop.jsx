// src/pages/Shop.jsx

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import ProductGrid from '@/components/customer/ProductGrid'
import FilterSidebar from '@/components/customer/FilterSidebar'
import SortDropdown from '@/components/customer/SortDropdown'
import Button from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    inStock: true
  })
  const [sortBy, setSortBy] = useState('relevance')
  
  const { products, loading } = useProducts({ active: true })
  
  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam === 'new') {
      setSortBy('newest')
    } else if (filterParam === 'deals') {
      setFilters(prev => ({ ...prev, hasDiscount: true }))
    }
  }, [searchParams])
  
  const filteredProducts = products.filter(product => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }
    
    if (filters.minPrice && product.price < filters.minPrice) {
      return false
    }
    
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false
    }
    
    if (filters.minRating && product.rating < filters.minRating) {
      return false
    }
    
    if (filters.inStock && product.stock === 0) {
      return false
    }
    
    return true
  })
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }
  
  const handleClearFilters = () => {
    setFilters({
      categories: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: true
    })
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[{ label: 'Shop', to: '/shop' }]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              All Products
            </h1>
            <p className="text-neutral-600">
              Showing {sortedProducts.length} products
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<SlidersHorizontal className="w-5 h-5" />}
              className="lg:hidden"
            >
              Filters
            </Button>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          <div className="lg:col-span-3">
            <ProductGrid products={sortedProducts} loading={loading} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                className="border-0 rounded-none"
              />

              <div className="p-4 border-t border-neutral-200">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}