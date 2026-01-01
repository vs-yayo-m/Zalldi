import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Zap, Sparkles, Filter, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import ProductGrid from '@/components/customer/ProductGrid'
import FilterSidebar from '@/components/customer/FilterSidebar'
import SortDropdown from '@/components/customer/SortDropdown'
import Button from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import EmptyState from '@/components/shared/EmptyState'

/**
 * ZALLDI PREMIUM SHOP ENGINE
 * A high-performance product listing page with real-time filtering and URL state sync.
 */

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  // Initialize state from URL params for better SEO and shareability
  const [filters, setFilters] = useState({
    categories: searchParams.getAll('category') || [],
    minPrice: searchParams.get('minPrice') || null,
    maxPrice: searchParams.get('maxPrice') || null,
    minRating: searchParams.get('rating') || null,
    inStock: searchParams.get('stock') !== 'false',
    hasDiscount: searchParams.get('deals') === 'true'
  })
  
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')
  const { products, loading } = useProducts({ active: true })

  // Sync state to URL whenever filters or sort change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.categories.length > 0) filters.categories.forEach(c => params.append('category', c))
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.minRating) params.set('rating', filters.minRating)
    if (!filters.inStock) params.set('stock', 'false')
    if (filters.hasDiscount) params.set('deals', 'true')
    if (sortBy !== 'relevance') params.set('sort', sortBy)
    
    setSearchParams(params, { replace: true })
  }, [filters, sortBy])

  // Compute filtered products with useMemo for performance
  const filteredProducts = useMemo(() => {
    if (!products) return []
    
    return products.filter(product => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false
      const currentPrice = product.discountPrice || product.price
      if (filters.minPrice && currentPrice < filters.minPrice) return false
      if (filters.maxPrice && currentPrice > filters.maxPrice) return false
      if (filters.minRating && (product.rating || 0) < filters.minRating) return false
      if (filters.inStock && product.stock === 0) return false
      if (filters.hasDiscount && !product.discountPrice) return false
      return true
    })
  }, [products, filters])

  // Compute sorted products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = a.discountPrice || a.price
      const priceB = b.discountPrice || b.price
      
      switch (sortBy) {
        case 'price-low': return priceA - priceB
        case 'price-high': return priceB - priceA
        case 'name-asc': return a.name.localeCompare(b.name)
        case 'rating': return (b.rating || 0) - (a.rating || 0)
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
        case 'popular': return (b.soldCount || 0) - (a.soldCount || 0)
        default: return 0
      }
    })
  }, [filteredProducts, sortBy])

  const activeFilterCount = useMemo(() => {
    let count = filters.categories.length
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.minRating) count++
    if (filters.hasDiscount) count++
    if (!filters.inStock) count++
    return count
  }, [filters])

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: true,
      hasDiscount: false
    })
    setSortBy('relevance')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* 1. Header & Breadcrumbs */}
      <div className="bg-white border-b border-neutral-100 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }]} className="mb-6" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <Sparkles className="w-3 h-3 fill-current" />
                Explore the Collection
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter">
                {filters.categories.length === 1 ? filters.categories[0] : 'The Marketplace'}
              </h1>
              <p className="text-neutral-500 font-medium mt-1">
                Discover {sortedProducts.length} curated products available for 60-min delivery.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="lg:hidden rounded-xl border-neutral-200 font-bold text-xs px-5"
                icon={<SlidersHorizontal className="w-4 h-4" />}
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter By
                </h3>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={handleClearFilters}
                    className="text-[10px] font-black text-orange-500 hover:text-orange-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onClear={handleClearFilters}
                className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100"
              />
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {sortedProducts.length === 0 && !loading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-20"
                >
                  <EmptyState
                    icon={<Zap className="w-16 h-16 text-neutral-200" />}
                    title="No items found"
                    description="We couldn't find any products matching your current filters. Try clearing some options to see more results."
                    action={{
                      label: "Clear All Filters",
                      onClick: handleClearFilters
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <ProductGrid 
                    products={sortedProducts} 
                    loading={loading} 
                    columns={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* 3. Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[340px] bg-white z-[70] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="font-black text-neutral-900 uppercase tracking-widest text-sm">Filters</h3>
                  <p className="text-[10px] font-bold text-neutral-400">{activeFilterCount} active selections</p>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onClear={handleClearFilters}
                  className="border-0 rounded-none p-0"
                />
              </div>

              <div className="p-6 border-t border-neutral-100 bg-neutral-50">
                <Button
                  variant="primary"
                  className="w-full h-14 bg-orange-500 hover:bg-orange-600 font-black rounded-2xl shadow-lg shadow-orange-500/20"
                  onClick={() => setShowFilters(false)}
                >
                  APPLY SELECTION
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

