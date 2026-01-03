// src/pages/Search.jsx

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search as SearchIcon, X, Filter, SlidersHorizontal } from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import ProductCard from '@components/customer/ProductCard'
import EmptyState from '@components/shared/EmptyState'
import LoadingScreen from '@components/shared/LoadingScreen'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { useSearch } from '@hooks/useSearch'
import { CATEGORIES } from '@utils/constants'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  
  const [searchInput, setSearchInput] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  
  const { results, isLoading, error, searchProducts } = useSearch()
  
  useEffect(() => {
    if (query) {
      searchProducts(query, { category: categoryParam })
    }
  }, [query, categoryParam])
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchInput.trim())
      if (selectedCategory) {
        params.set('category', selectedCategory)
      }
      setSearchParams(params)
    }
  }
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    setSearchParams(params)
  }
  
  const clearSearch = () => {
    setSearchInput('')
    setSelectedCategory('')
    setSearchParams({})
  }
  
  const sortedResults = [...(results || [])].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="pt-20 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-card p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="Search for products..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-12 pr-12"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <Button type="submit" className="px-8">
                    Search
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-48"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-48"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </Select>

                  {query && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </form>
            </div>

            {query && (
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-800">
                  Search results for "{query}"
                  {selectedCategory && (
                    <span className="text-neutral-500 font-normal">
                      {' '}in {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </h1>
                <p className="text-neutral-600">
                  {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
            )}

            {isLoading ? (
              <LoadingScreen />
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : !query ? (
              <EmptyState
                icon={SearchIcon}
                title="Start searching"
                description="Enter a product name or keyword to find what you're looking for"
              />
            ) : sortedResults.length === 0 ? (
              <EmptyState
                icon={SearchIcon}
                title="No results found"
                description={`We couldn't find any products matching "${query}". Try different keywords or browse our categories.`}
                action={{
                  label: 'Browse All Products',
                  onClick: () => navigate('/shop')
                }}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {sortedResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}