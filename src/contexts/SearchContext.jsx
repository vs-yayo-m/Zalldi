// src/contexts/SearchContext.jsx

import { createContext, useState, useCallback } from 'react'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '@config/firebase'

export const SearchContext = createContext()

export function SearchProvider({ children }) {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem('recentSearches')
      return stored ? JSON.parse(stored) : []
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
      
      const productsRef = collection(db, 'products')
      let q = query(productsRef, where('active', '==', true))
      
      if (filters.category) {
        q = query(productsRef, where('active', '==', true), where('category', '==', filters.category))
      }
      
      const snapshot = await getDocs(q)
      
      const allProducts = []
      snapshot.forEach(doc => {
        allProducts.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      const filtered = allProducts.filter(product => {
        const name = (product.name || '').toLowerCase()
        const description = (product.description || '').toLowerCase()
        const category = (product.category || '').toLowerCase()
        const tags = Array.isArray(product.tags) ? product.tags : []
        
        return (
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm) ||
          tags.some(tag => String(tag).toLowerCase().includes(searchTerm))
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
    setRecentSearches(prev => {
      const updated = [
        searchQuery,
        ...prev.filter(s => s !== searchQuery)
      ].slice(0, 10)
      
      try {
        localStorage.setItem('recentSearches', JSON.stringify(updated))
      } catch {
        // Ignore
      }
      
      return updated
    })
  }, [])
  
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    try {
      localStorage.removeItem('recentSearches')
    } catch {
      // Ignore
    }
  }, [])
  
  const getSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      return []
    }
    
    try {
      const searchTerm = searchQuery.toLowerCase().trim()
      
      const productsRef = collection(db, 'products')
      const q = query(productsRef, where('active', '==', true), limit(10))
      
      const snapshot = await getDocs(q)
      
      const allProducts = []
      snapshot.forEach(doc => {
        const data = doc.data()
        allProducts.push({
          id: doc.id,
          name: data.name || ''
        })
      })
      
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