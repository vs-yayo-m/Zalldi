// src/components/customer/ProductGrid.jsx

import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import EmptyState from '@/components/shared/EmptyState';
import { ShoppingBag, Zap } from 'lucide-react';

/**
 * ZALLDI KINETIC GRID - MOBILE-FIRST
 * Features:
 * 1. 2-column grid on mobile, scales up for tablets/desktops.
 * 2. Staggered waterfall animations.
 * 3. Premium skeleton shimmer for loading.
 * 4. Smooth spring physics for entrance/exit.
 */
export default function ProductGrid({ products = [], loading = false, error = false, columns = 4 }) {
  const gridCols = {
    2: 'grid-cols-2 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  };

  // -------------------------
  // Loading State
  // -------------------------
  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-x-4 gap-y-8`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-neutral-100 p-3 space-y-3 relative"
          >
            <div className="aspect-square w-full bg-neutral-100 rounded-xl relative overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
            <div className="space-y-2 px-2">
              <div className="h-3 w-2/3 bg-neutral-100 rounded-full" />
              <div className="h-2 w-1/2 bg-neutral-100 rounded-full" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-1/4 bg-neutral-100 rounded-md" />
                <div className="h-7 w-7 bg-neutral-100 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // -------------------------
  // Error State
  // -------------------------
  if (error) {
    return (
      <div className="py-20 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-100">
        <EmptyState
          icon={<Zap className="w-12 h-12 text-rose-500 mb-4" />}
          title="Connection Lost"
          description="We couldn't reach the warehouse. Let's try again."
          action={{ label: 'Retry', onClick: () => window.location.reload() }}
        />
      </div>
    );
  }

  // -------------------------
  // No Products
  // -------------------------
  if (!products.length) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<ShoppingBag className="w-16 h-16 text-neutral-100" />}
          title="Empty Shelves"
          description="Looks like these items have already been delivered. Try a different category."
        />
      </div>
    );
  }

  // -------------------------
  // Product Grid
  // -------------------------
  return (
    <motion.div
      className={`grid ${gridCols[columns]} gap-x-4 gap-y-8`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          layout
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 120 } }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}