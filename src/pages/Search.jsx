// src/pages/Search.jsx

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, SlidersHorizontal, ArrowLeft, TrendingUp, Clock } from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import ProductCard from '@components/customer/ProductCard'
import EmptyState from '@components/shared/EmptyState'
import Button from '@components/ui/Button'
import { useSearch } from '@hooks/useSearch'
import { CATEGORIES } from '@utils/constants'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  
  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const sortParam = searchParams.get('sort') || 'relevance'
  
  const [searchInput, setSearchInput] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState(sortParam)
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const { results, isLoading, recentSearches, searchProducts, getSuggestions } = useSearch()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (query) {
      searchProducts(query, { category: categoryParam })
    }
  }, [query, categoryParam])

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.length >= 2) {
        const sugg = await getSuggestions(searchInput)
        setSuggestions(sugg)
      } else {
        setSuggestions([])
      }
    }
    
    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleSearch = (searchTerm = searchInput) => {
    if (searchTerm.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchTerm.trim())
      if (selectedCategory) params.set('category', selectedCategory)
      if (sortBy !== 'relevance') params.set('sort', sortBy)
      setSearchParams(params)
      setShowSuggestions(false)
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

  const handleSortChange = (sort) => {
    setSortBy(sort)
    const params = new URLSearchParams(searchParams)
    if (sort !== 'relevance') {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }
    setSearchParams(params)
  }

  const clearSearch = () => {
    setSearchInput('')
    setSelectedCategory('')
    setSortBy('relevance')
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

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (sortBy !== 'relevance' ? 1 : 0)

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="sticky top-16 z-40 bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>

            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-12 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('')
                    setShowSuggestions(false)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <AnimatePresence>
                {showSuggestions && (searchInput.length >= 2 || recentSearches.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50"
                  >
                    {suggestions.length > 0 && (
                      <div className="p-2 border-b border-neutral-100">
                        <p className="text-xs font-medium text-neutral-500 px-3 py-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Suggestions
                        </p>
                        {suggestions.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSearchInput(item.name)
                              handleSearch(item.name)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                          >
                            <p className="text-sm text-neutral-900">{item.name}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {recentSearches.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-medium text-neutral-500 px-3 py-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Searches
                        </p>
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchInput(search)
                              handleSearch(search)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                          >
                            <p className="text-sm text-neutral-700">{search}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-neutral-700" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        !selectedCategory
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { value: 'relevance', label: 'Most Relevant' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'rating', label: 'Top Rated' },
                      { value: 'newest', label: 'Newest' }
                    ].map((sort) => (
                      <button
                        key={sort.value}
                        onClick={() => handleSortChange(sort.value)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          sortBy === sort.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearSearch}
                      className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <main className="pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {query && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
                  Results for "{query}"
                </h1>
                {selectedCategory && (
                  <p className="text-sm text-neutral-500 mt-1">
                    in {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </p>
                )}
              </div>
              <p className="text-sm text-neutral-600">
                {sortedResults.length} {sortedResults.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !query ? (
            <EmptyState
              icon={SearchIcon}
              title="Start searching"
              description="Enter a product name to find what you need"
            />
          ) : sortedResults.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No results found"
              description={`Try different keywords or browse all products`}
              action={{
                label: 'Browse All Products',
                onClick: () => navigate('/shop')
              }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
            >
              {sortedResults.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}