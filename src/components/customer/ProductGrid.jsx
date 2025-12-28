// src/components/customer/ProductGrid.jsx

import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import EmptyState from '@/components/shared/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { ShoppingBag } from 'lucide-react'

export default function ProductGrid({ products, loading, error, columns = 4 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  }

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-card">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-16 h-16" />}
        title="Error Loading Products"
        description={error}
      />
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-16 h-16" />}
        title="No Products Found"
        description="Try adjusting your filters or search terms"
      />
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
      className={`grid ${gridCols[columns]} gap-6`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  )
}