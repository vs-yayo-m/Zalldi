// src/components/customer/SearchBar.jsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock } from 'lucide-react'
import { useSearch } from '@hooks/useSearch'

export default function SearchBar({ className = '', placeholder = 'Search products...', autoFocus = false }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [searchInput, setSearchInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  
  const { recentSearches, getSuggestions } = useSearch()
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])
  
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
  }, [searchInput, getSuggestions])
  
  const handleSearch = (query = searchInput) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
      setSearchInput('')
    }
  }
  
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowSuggestions(false)
    }
  }
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-12 pr-12 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
      </div>

      <AnimatePresence>
        {showSuggestions && (searchInput.length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
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
                    onClick={() => handleSearch(item.name)}
                    className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <p className="text-sm text-neutral-900 font-medium">{item.name}</p>
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
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors"
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
  )
}