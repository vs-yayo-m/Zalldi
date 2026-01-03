// src/contexts/SearchContext.jsx

import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import productService from '@/services/product.service'
import { useDebounce } from '@/hooks/useDebounce'

export const SearchContext = createContext()

export function SearchProvider({ children }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  
  const debouncedQuery = useDebounce(query, 300)
  
  useEffect(() => {
    const saved = localStorage.getItem('zalldi_recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])
  
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
    }
  }, [debouncedQuery])
  
  const performSearch = async (searchQuery) => {
    try {
      setLoading(true)
      const data = await productService.search(searchQuery, { active: true })
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }
  
  const search = (searchQuery) => {
    setQuery(searchQuery)
    addToRecentSearches(searchQuery)
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }
  
  const addToRecentSearches = (searchQuery) => {
    if (!searchQuery.trim()) return
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s.toLowerCase() !== searchQuery.toLowerCase())
    ].slice(0, 10)
    
    setRecentSearches(updated)
    localStorage.setItem('zalldi_recent_searches', JSON.stringify(updated))
  }
  
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('zalldi_recent_searches')
  }
  
  const removeRecentSearch = (searchQuery) => {
    const updated = recentSearches.filter(s => s !== searchQuery)
    setRecentSearches(updated)
    localStorage.setItem('zalldi_recent_searches', JSON.stringify(updated))
  }
  
  const clearQuery = () => {
    setQuery('')
    setResults([])
  }
  
  const value = {
    query,
    setQuery,
    results,
    loading,
    search,
    clearQuery,
    recentSearches,
    clearRecentSearches,
    removeRecentSearch
  }
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}