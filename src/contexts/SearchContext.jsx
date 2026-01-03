// src/contexts/SearchContext.jsx

import { createContext, useState, useCallback } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '@config/firebase'

export const SearchContext = createContext()

export function SearchProvider({ children }) {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]')
    } catch {
      return []
    }
  })
  
  const searchProducts = useCallback(async (searchQuery, filters = {}) => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([])
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const searchTerm = searchQuery.toLowerCase().trim()
      
      let q = query(
        collection(db, 'products'),
        where('active', '==', true)
      )
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category))
      }
      
      const snapshot = await getDocs(q)
      
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      const filtered = allProducts.filter(product => {
        const name = (product.name || '').toLowerCase()
        const description = (product.description || '').toLowerCase()
        const category = (product.category || '').toLowerCase()
        const tags = (product.tags || []).map(t => t.toLowerCase())
        
        return (
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm) ||
          tags.some(tag => tag.includes(searchTerm))
        )
      })
      
      setResults(filtered)
      addRecentSearch(searchQuery)
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search products. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  const addRecentSearch = useCallback((searchQuery) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 10)
    
    setRecentSearches(updated)
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    } catch {
      // Ignore storage errors
    }
  }, [recentSearches])
  
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    try {
      localStorage.removeItem('recentSearches')
    } catch {
      // Ignore storage errors
    }
  }, [])
  
  const getSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      return []
    }
    
    try {
      const searchTerm = searchQuery.toLowerCase().trim()
      
      const q = query(
        collection(db, 'products'),
        where('active', '==', true),
        limit(5)
      )
      
      const snapshot = await getDocs(q)
      
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }))
      
      return allProducts
        .filter(product =>
          product.name.toLowerCase().includes(searchTerm)
        )
        .slice(0, 5)
    } catch (err) {
      console.error('Suggestions error:', err)
      return []
    }
  }, [])
  
  const value = {
    results,
    isLoading,
    error,
    recentSearches,
    searchProducts,
    clearRecentSearches,
    getSuggestions
  }
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}