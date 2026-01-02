// src/components/layout/ProductDiscoverySection.jsx

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Flame, Sparkles, Leaf, Snowflake } from 'lucide-react'
import { motion } from 'framer-motion'
import ProductCard from '@components/customer/ProductCard'
import { productService } from '@services/product.service'
import { ShimmerProductCard } from '@components/animations/Shimmer'

const sections = [
  { 
    id: 'best-selling', 
    title: '🔥 Best Selling', 
    icon: Flame,
    filter: 'bestSelling',
    gradient: 'from-red-500 to-orange-500'
  },
  { 
    id: 'new-arrivals', 
    title: 'New Arrivals', 
    icon: Sparkles,
    filter: 'new',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'fresh-today', 
    title: 'Fresh Today', 
    icon: Leaf,
    filter: 'fresh',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'cold-frozen', 
    title: 'Cold & Frozen', 
    icon: Snowflake,
    filter: 'frozen',
    gradient: 'from-blue-500 to-cyan-500'
  }
]

function ProductSection({ section }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    fetchProducts()
  }, [section.filter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const results = await productService.getProducts({ 
        limit: 10,
        featured: section.filter === 'bestSelling' ? true : undefined,
        sortBy: section.filter === 'new' ? 'createdAt' : section.filter === 'bestSelling' ? 'soldCount' : undefined
      })
      setProducts(results)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const Icon = section.icon

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-heading font-display font-bold text-neutral-800">
              {section.title}
            </h3>
            <p className="text-body-sm text-neutral-500">Curated for you</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center hover:bg-orange-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center hover:bg-orange-50 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <ShimmerProductCard />
            </div>
          ))
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-48">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function ProductDiscoverySection() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display font-display font-bold text-neutral-800 mb-2"
          >
            Discover Amazing Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-neutral-600"
          >
            Handpicked collections just for you
          </motion.p>
        </div>

        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductSection section={section} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}