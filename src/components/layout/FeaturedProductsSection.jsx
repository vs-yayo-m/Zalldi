// src/components/layout/FeaturedProductsSection.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, SlidersHorizontal } from 'lucide-react'
import ProductCard from '@components/customer/ProductCard'
import { productService } from '@services/product.service'
import { ShimmerProductCard } from '@components/animations/Shimmer'
import Button from '@components/ui/Button'

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [displayCount, setDisplayCount] = useState(12)
  
  useEffect(() => {
    fetchProducts()
  }, [filter])
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const results = await productService.getProducts({
        limit: 50,
        active: true,
        category: filter !== 'all' ? filter : undefined
      })
      setProducts(results)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filters = [
    { id: 'all', label: 'All Products' },
    { id: 'groceries', label: 'Groceries' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'snacks', label: 'Snacks' }
  ]
  
  const displayedProducts = products.slice(0, displayCount)
  const hasMore = products.length > displayCount
  
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-display font-display font-bold text-neutral-800 mb-2">
            Featured Products
          </h2>
          <p className="text-body-lg text-neutral-600">
            Premium quality products at your doorstep
          </p>
        </motion.div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex items-center gap-2 text-neutral-600 mr-2">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-body-sm font-medium whitespace-nowrap">Filter:</span>
          </div>
          {filters.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => {
                setFilter(filterOption.id)
                setDisplayCount(12)
              }}
              className={`
                px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-all
                ${filter === filterOption.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-orange-500 hover:text-orange-600'
                }
              `}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ShimmerProductCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-title font-semibold text-neutral-800 mb-2">
              No Products Found
            </h3>
            <p className="text-body text-neutral-600">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button
                  size="lg"
                  onClick={() => setDisplayCount(prev => prev + 12)}
                  className="px-8"
                >
                  Load More Products
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}