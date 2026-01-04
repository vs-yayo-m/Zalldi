// src/components/customer/ProductGrid.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import EmptyState from '@/components/shared/EmptyState';
import { ShoppingBag, Zap } from 'lucide-react';

/**
 * ZALLDI KINETIC GRID
 * Features staggered "Waterfall" entry animations and premium skeleton states.
 */
export default function ProductGrid({ products, loading, error, columns = 4 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  };

  // Premium Loading State: Zalldi Shimmer
  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-8`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-[2rem] overflow-hidden border border-neutral-100 p-4 space-y-4">
            <div className="aspect-square w-full bg-neutral-100 rounded-[1.5rem] relative overflow-hidden">
              {/* Shimmer Effect */}
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
            <div className="space-y-3 px-2">
              <div className="h-4 w-2/3 bg-neutral-100 rounded-full" />
              <div className="h-3 w-1/2 bg-neutral-50 rounded-full" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-1/4 bg-neutral-100 rounded-md" />
                <div className="h-8 w-8 bg-neutral-100 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-neutral-50 rounded-[3rem] border-2 border-dashed border-neutral-100">
        <EmptyState
          icon={<Zap className="w-12 h-12 text-rose-500 mb-4" />}
          title="Connection Lost"
          description="We couldn't reach the warehouse. Let's try again."
          action={{ label: "Retry", onClick: () => window.location.reload() }}
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08, // The "Waterfall" delay
            delayChildren: 0.1
          }
        }
      }}
      className={`grid ${gridCols[columns]} gap-x-6 gap-y-10`}
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            variants={{
              hidden: { y: 20, opacity: 0, scale: 0.95 },
              visible: { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                transition: { type: "spring", damping: 20, stiffness: 100 }
              },
              exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

