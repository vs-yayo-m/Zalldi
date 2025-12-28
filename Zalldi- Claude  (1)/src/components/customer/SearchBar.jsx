// src/components/customer/SearchBar.jsx

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'

export default function SearchBar({ autoFocus = false, onSearch, className = '' }) {
  const navigate = useNavigate()
  const { query, setQuery, results, loading, search, recentSearches, removeRecentSearch } = useSearch()
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      search(query)
      setIsFocused(false)
      if (onSearch) onSearch(query)
    }
  }
  
  const handleResultClick = (product) => {
    navigate(`/product/${product.slug}`)
    setIsFocused(false)
    setQuery('')
  }
  
  const handleRecentSearchClick = (searchQuery) => {
    setQuery(searchQuery)
    search(searchQuery)
    setIsFocused(false)
  }
  
  const showResults = isFocused && query.trim().length >= 2
  const showRecentSearches = isFocused && !query.trim() && recentSearches.length > 0
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products..."
          className="w-full pl-12 pr-12 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {(showResults || showRecentSearches) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          >
            {showRecentSearches && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((searchQuery, index) => (
                    <div key={index} className="flex items-center justify-between group">
                      <button
                        onClick={() => handleRecentSearchClick(searchQuery)}
                        className="flex-1 text-left px-3 py-2 text-sm text-neutral-700 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        {searchQuery}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(searchQuery)}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 rounded transition-all"
                        aria-label="Remove"
                      >
                        <X className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResults && (
              <div className="p-4">
                {loading ? (
                  <div className="text-center py-8 text-neutral-600">
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.slice(0, 5).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <img
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-neutral-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-orange-500 font-semibold">
                            Rs. {product.discountPrice || product.price}
                          </p>
                        </div>
                      </button>
                    ))}
                    {results.length > 5 && (
                      <button
                        onClick={() => {
                          search(query)
                          setIsFocused(false)
                        }}
                        className="w-full py-2 text-center text-sm text-orange-500 hover:text-orange-600 font-medium"
                      >
                        View all {results.length} results
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-600">
                    No products found
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}