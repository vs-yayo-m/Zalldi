// src/components/customer/SearchResults.jsx

import React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import ProductGrid from './ProductGrid'
import EmptyState from '@/components/shared/EmptyState'

export default function SearchResults({ query, results, loading }) {
  if (loading) {
    return <ProductGrid loading={loading} />
  }
  
  if (!query) {
    return (
      <EmptyState
        icon={<Search className="w-16 h-16" />}
        title="Start Searching"
        description="Enter a product name or category to find what you're looking for"
      />
    )
  }
  
  if (results.length === 0) {
    return (
      <EmptyState
        icon={<Search className="w-16 h-16" />}
        title="No Results Found"
        description={`We couldn't find any products matching "${query}"`}
      />
    )
  }
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-neutral-800">
          Search Results for "{query}"
        </h2>
        <p className="text-neutral-600 mt-1">
          Found {results.length} {results.length === 1 ? 'product' : 'products'}
        </p>
      </motion.div>

      <ProductGrid products={results} />
    </div>
  )
}