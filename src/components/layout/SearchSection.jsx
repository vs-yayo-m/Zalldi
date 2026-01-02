// src/components/layout/SearchSection.jsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@hooks/useDebounce'
import { productService } from '@services/product.service'

const searchPlaceholders = [
  "Search for Momo…",
  "Search for Gifts for Girlfriend…",
  "Search for Chocolates…",
  "Search for Birthday Gift…",
  "Search for Fresh Vegetables…",
  "Search for Dairy Products…",
  "Search for Snacks…"
]

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholder, setPlaceholder] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholder((prev) => (prev + 1) % searchPlaceholders.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 1) {
      fetchSuggestions(debouncedSearch)
    } else {
      setSuggestions([])
    }
  }, [debouncedSearch])
  
  const fetchSuggestions = async (query) => {
    try {
      setLoading(true)
      const results = await productService.searchProducts(query, 5)
      setSuggestions(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }
  
  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion.slug}`)
    setSearchQuery('')
    setIsFocused(false)
  }
  
  return (
    <section className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <form onSubmit={handleSearch} className="relative">
          <div className={`
            relative flex items-center bg-neutral-50 rounded-full border-2 transition-all duration-300
            ${isFocused ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-neutral-200'}
          `}>
            <Search className={`
              absolute left-4 w-5 h-5 transition-colors
              ${isFocused ? 'text-orange-500' : 'text-neutral-400'}
            `} />
            
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full pl-12 pr-4 py-4 bg-transparent text-body font-medium text-neutral-800 placeholder:text-neutral-400 outline-none"
              placeholder={searchPlaceholders[placeholder]}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
          </div>

          <AnimatePresence>
            {isFocused && (suggestions.length > 0 || loading) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50"
              >
                {loading ? (
                  <div className="p-4 text-center text-neutral-500">
                    <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : (
                  <div className="py-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors"
                      >
                        {suggestion.images?.[0] ? (
                          <img
                            src={suggestion.images[0]}
                            alt={suggestion.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <Search className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <p className="font-medium text-neutral-800">{suggestion.name}</p>
                          <p className="text-body-sm text-neutral-500">{suggestion.category}</p>
                        </div>
                        <p className="font-semibold text-orange-600">Rs. {suggestion.price}</p>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="flex items-center gap-4 mt-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 text-body-sm text-neutral-600 whitespace-nowrap">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">Trending:</span>
          </div>
          {['Momo', 'Chocolate', 'Fresh Milk', 'Vegetables', 'Snacks'].map((term) => (
            <button
              key={term}
              onClick={() => navigate(`/search?q=${term}`)}
              className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-body-sm font-medium hover:bg-orange-100 transition-colors whitespace-nowrap"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}