import React, { createContext, useState, useCallback, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit, 
  getFirestore 
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

export const SearchContext = createContext();

/**
 * ZALLDI - High-Performance Search Engine Context
 * Implements: Memory-first searching, cross-field filtering, and enterprise pathing.
 */

// Firebase initialization using environment globals
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'zalldi-official';

export function SearchProvider({ children }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // In-memory recent searches for the session
  const [recentSearches, setRecentSearches] = useState([]);

  // Utility: Retry with Exponential Backoff
  const fetchWithRetry = async (queryFn, retries = 5) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await queryFn();
      } catch (err) {
        if (i === retries - 1) throw err;
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  /**
   * Performs a client-side filter search on Firestore data.
   * Optimized for: /artifacts/{appId}/public/data/products
   */
  const searchProducts = useCallback(async (searchQuery, filters = {}) => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const searchTerm = searchQuery.toLowerCase().trim();
      
      // RULE 1 & 2: Use simple queries and filter in memory
      // Path: /artifacts/{appId}/public/data/products
      const productsRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
      
      let q = query(productsRef);
      
      // Simple filtering allowed by rule
      if (filters.category) {
        q = query(productsRef, where('category', '==', filters.category));
      }

      const snapshot = await fetchWithRetry(() => getDocs(q));
      
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Advanced text matching in JavaScript memory (Rule 2)
      const filtered = allProducts.filter(product => {
        const isActive = product.active !== false; // Default to true if undefined
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        const tags = Array.isArray(product.tags) ? product.tags.map(t => t.toLowerCase()) : [];
        
        const matchesText = name.includes(searchTerm) ||
                           description.includes(searchTerm) ||
                           category.includes(searchTerm) ||
                           tags.some(tag => tag.includes(searchTerm));
                           
        return isActive && matchesText;
      });
      
      setResults(filtered);
      addRecentSearch(searchQuery);
    } catch (err) {
      // Friendly error for UI (Rule 4: No alerts)
      setError('Connection slow. Please check your internet and try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const addRecentSearch = useCallback((searchQuery) => {
    setRecentSearches(prev => {
      const updated = [
        searchQuery,
        ...prev.filter(s => s !== searchQuery)
      ].slice(0, 8);
      return updated;
    });
  }, []);
  
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);
  
  /**
   * Quick suggestions for search-as-you-type UI
   */
  const getSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    try {
      const searchTerm = searchQuery.toLowerCase().trim();
      const productsRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
      
      // Fetch limited sample to suggest from
      const q = query(productsRef, limit(20));
      const snapshot = await getDocs(q);
      
      return snapshot.docs
        .map(doc => ({ id: doc.id, name: doc.data().name }))
        .filter(p => p.name.toLowerCase().includes(searchTerm))
        .slice(0, 5);
    } catch (err) {
      return [];
    }
  }, []);
  
  const value = {
    results,
    isLoading,
    error,
    recentSearches,
    searchProducts,
    clearRecentSearches,
    getSuggestions
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

