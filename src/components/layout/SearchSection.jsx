// src/components/layout/SearchSection.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  TrendingUp, 
  Clock, 
  X, 
  ArrowUpRight, 
  Mic, 
  ChevronRight 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '../../hooks/useDebounce'
import { productService } from '../../services/product.service'

// ==========================================
// Constants & Mock Data
// ==========================================

const SEARCH_PLACEHOLDERS = [
  "Search for 'Momos'",
  "Search for 'Chocolates'",
  "Search for 'Birthday Gifts'",
  "Search for 'Fresh Milk'",
  "Search for 'Snacks'", 
  "Search for 'yoga'"
]

const TRENDING_TAGS = [
  'Momo', 'Chocolate', 'Fresh Milk', 'Vegetables', 'Snacks', 'Cakes', 'Drinks'
]

const MAX_HISTORY = 5

// ==========================================
// Sub-Component: Placeholder Animator
// ==========================================

const AnimatedPlaceholder = ({ text, visible }) => (
  <AnimatePresence mode="wait">
    {visible && (
      <motion.span
        key={text}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute left-12 top-0 bottom-0 flex items-center text-neutral-400 pointer-events-none text-body select-none truncate w-[70%]"
      >
        {text}
      </motion.span>
    )}
  </AnimatePresence>
)

// ==========================================
// Sub-Component: Skeleton Loader
// ==========================================

const SuggestionSkeleton = () => (
  <div className="space-y-3 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 bg-neutral-100 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-100 rounded w-3/4" />
          <div className="h-3 bg-neutral-100 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

// ==========================================
// Main Component
// ==========================================

export default function SearchSection() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  
  // State Management
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [searchHistory, setSearchHistory] = useState([])
  
  // Custom Hooks
  const debouncedQuery = useDebounce(query, 300)

  // Load History on Mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('search_history') || '[]')
    setSearchHistory(history)

    // Rotating Placeholder Timer
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  // Search Logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([])
        return
      }

      try {
        setIsLoading(true)
        const results = await productService.searchProducts(debouncedQuery, 5)
        setSuggestions(results || [])
      } catch (error) {
        console.error('Search fetch failed:', error)
        setSuggestions([]) // Fallback to empty
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  // Handlers
  const handleSearchSubmit = (e, overrideQuery = null) => {
    if (e) e.preventDefault()
    
    const finalQuery = overrideQuery || query
    if (!finalQuery.trim()) return

    // Save to History
    const newHistory = [finalQuery, ...searchHistory.filter(h => h !== finalQuery)].slice(0, MAX_HISTORY)
    setSearchHistory(newHistory)
    localStorage.setItem('search_history', JSON.stringify(newHistory))

    // Cleanup and Navigate
    setIsFocused(false)
    inputRef.current?.blur()
    navigate(`/search?q=${encodeURIComponent(finalQuery.trim())}`)
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  const removeHistoryItem = (e, item) => {
    e.stopPropagation()
    const newHistory = searchHistory.filter(h => h !== item)
    setSearchHistory(newHistory)
    localStorage.setItem('search_history', JSON.stringify(newHistory))
  }

  // ==========================================
  // Render
  // ==========================================

  return (
    <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <form onSubmit={handleSearchSubmit} className="relative group">
          
          {/* Search Input Container */}
          <div 
            className={`
              relative flex items-center bg-neutral-50 rounded-2xl border transition-all duration-300 overflow-hidden
              ${isFocused 
                ? 'border-orange-500 shadow-[0_4px_20px_rgba(249,115,22,0.15)] bg-white ring-4 ring-orange-500/10' 
                : 'border-neutral-200 hover:border-neutral-300'
              }
            `}
          >
            {/* Search Icon */}
            <div className="pl-4 pr-2">
              <Search 
                className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-orange-600' : 'text-neutral-400'}`} 
              />
            </div>
            
            {/* Animated Placeholder (Visible when empty) */}
            <AnimatedPlaceholder 
              text={SEARCH_PLACEHOLDERS[placeholderIndex]} 
              visible={!query && !isFocused} 
            />

            {/* Actual Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              // Delay blur to allow clicking suggestions
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full py-3.5 pr-12 bg-transparent text-body font-medium text-neutral-900 placeholder-transparent outline-none z-10"
              placeholder={isFocused ? "Search for products..." : ""} // Simple placeholder on focus
              autoComplete="off"
            />

            {/* Action Buttons (Clear / Mic) */}
            <div className="absolute right-3 flex items-center gap-2 z-20">
              {query ? (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  type="button"
                  onClick={handleClear}
                  className="p-1 bg-neutral-200 rounded-full text-neutral-600 hover:bg-neutral-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              ) : (
                 // Mic icon is purely visual here, acting as a "Enterprise" placeholder feature
                <button type="button" className="p-2 text-neutral-400 hover:text-orange-500 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Dropdown (Suggestions / History) */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 origin-top"
              >
                {/* Scenario 1: Loading */}
                {isLoading && <SuggestionSkeleton />}

                {/* Scenario 2: Show Suggestions */}
                {!isLoading && query && suggestions.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Best Matches
                    </div>
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate(`/product/${item.slug}`)
                          setQuery('')
                        }}
                        className="group/item px-4 py-3 flex items-center gap-4 hover:bg-orange-50 cursor-pointer transition-colors border-b border-neutral-50 last:border-0"
                      >
                        {/* Product Image Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-white border border-neutral-100 p-1 overflow-hidden shrink-0">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <Search className="w-full h-full p-2 text-neutral-300" />
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-neutral-800 truncate group-hover/item:text-orange-700 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-neutral-500">{item.category}</span>
                            {item.stock < 5 && (
                              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 rounded">
                                Only {item.stock} left
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="text-right">
                          <span className="block font-bold text-orange-600">Rs. {item.price}</span>
                          <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={(e) => handleSearchSubmit(e)}
                      className="w-full py-3 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors border-t border-neutral-100"
                    >
                      See all results for "{query}"
                    </button>
                  </div>
                )}

                {/* Scenario 3: No Query - Show History & Trending */}
                {!query && !isLoading && (
                  <div className="pb-2">
                    {/* Recent History */}
                    {searchHistory.length > 0 && (
                      <div className="mb-2">
                         <div className="flex items-center justify-between px-4 py-3 bg-neutral-50/50">
                           <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Recent Searches</h3>
                           <button 
                              onClick={(e) => {
                                e.preventDefault()
                                setSearchHistory([])
                                localStorage.removeItem('search_history')
                              }}
                              className="text-xs text-orange-600 font-medium hover:underline"
                            >
                              Clear
                           </button>
                         </div>
                         {searchHistory.map((term, idx) => (
                           <div 
                              key={idx}
                              onClick={(e) => handleSearchSubmit(e, term)}
                              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 cursor-pointer group/history transition-colors"
                           >
                             <div className="flex items-center gap-3 text-neutral-700">
                               <Clock className="w-4 h-4 text-neutral-400 group-hover/history:text-orange-500" />
                               <span className="font-medium text-sm">{term}</span>
                             </div>
                             <button 
                                onClick={(e) => removeHistoryItem(e, term)}
                                className="p-1 hover:bg-neutral-200 rounded-full text-neutral-400 transition-colors"
                             >
                               <X className="w-3 h-3" />
                             </button>
                           </div>
                         ))}
                      </div>
                    )}

                    {/* Trending Grid */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <h3 className="text-sm font-bold text-neutral-800">Trending Now</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={(e) => handleSearchSubmit(e, tag)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:border-orange-500 hover:text-orange-600 hover:shadow-sm transition-all duration-200"
                          >
                            {tag}
                            <ArrowUpRight className="w-3 h-3 opacity-50" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Horizontal Quick Tags (Visible when not searching) */}
        {!isFocused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mt-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 mask-fade-right"
          >
            <span className="text-xs font-bold text-neutral-400 whitespace-nowrap uppercase tracking-wider">
              Quick Links:
            </span>
            {TRENDING_TAGS.slice(0, 5).map((term) => (
              <button
                key={term}
                onClick={(e) => handleSearchSubmit(e, term)}
                className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium hover:bg-orange-100 hover:text-orange-700 transition-colors whitespace-nowrap active:scale-95"
              >
                {term}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

