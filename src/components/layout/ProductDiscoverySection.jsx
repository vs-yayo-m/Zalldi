// /src/components/layout/ProductDiscoverySection.jsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  Leaf, 
  Snowflake, 
  ArrowRight,
  TrendingUp,
  Zap,
  Clock
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import ProductCard from '../customer/ProductCard'
import { productService } from '../../services/product.service'
import { ShimmerProductCard } from '../animations/Shimmer'

// ==========================================
// Section Configurations
// ==========================================

const DISCOVERY_SECTIONS = [
  { 
    id: 'best-selling', 
    title: 'Bestsellers', 
    subtitle: 'Loved by everyone',
    icon: Flame,
    filter: 'bestSelling',
    gradient: 'from-[#FF4D00] to-[#FF8C00]',
    accentColor: 'orange',
    badge: 'Trending'
  },
  { 
    id: 'fresh-today', 
    title: 'Fresh Arrivals', 
    subtitle: 'Farm to table in mins',
    icon: Leaf,
    filter: 'fresh',
    gradient: 'from-[#00B894] to-[#55EFC4]',
    accentColor: 'emerald',
    badge: 'New'
  },
  { 
    id: 'cold-frozen', 
    title: 'Chilled Items', 
    subtitle: 'Stay cool, stay fresh',
    icon: Snowflake,
    filter: 'frozen',
    gradient: 'from-[#0984E3] to-[#74B9FF]',
    accentColor: 'blue',
    badge: 'Chilled'
  }
]

// ==========================================
// Sub-Component: ProductSection
// ==========================================

const ProductSection = ({ section, index }) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)
  
  // States for scroll controls
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Intersection Observer for scroll animations
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  /**
   * Data Fetching Logic
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      // Simulating enterprise-grade params: limit, sorting, and availability filtering
      const params = {
        limit: 12,
        featured: section.filter === 'bestSelling',
        sortBy: section.filter === 'fresh' ? 'createdAt' : 'soldCount',
        status: 'active'
      }
      const results = await productService.getProducts(params)
      setProducts(results || [])
    } catch (error) {
      console.error(`[DiscoverySection] Failed to load ${section.id}:`, error)
    } finally {
      setLoading(false)
    }
  }, [section])

  useEffect(() => {
    loadData()
  }, [loadData])

  /**
   * Scroll Progress & Controls
   */
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 20)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20)
    }
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.75
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -amount : amount, 
        behavior: 'smooth' 
      })
      // Haptic feedback for interaction
      if (navigator.vibrate) navigator.vibrate(5)
    }
  }

  const Icon = section.icon

  return (
    <div 
      ref={sectionRef}
      className="relative mb-12 md:mb-20 last:mb-0"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3 md:gap-5">
          {/* Icon Badge */}
          <motion.div 
            initial={{ rotate: -15, scale: 0.8 }}
            animate={isInView ? { rotate: 0, scale: 1 } : {}}
            transition={{ type: 'spring', damping: 12 }}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-xl shadow-orange-500/10 shrink-0`}
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-white stroke-[2.5]" />
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-3xl font-black text-neutral-900 tracking-tight truncate">
                {section.title}
              </h3>
              {section.badge && (
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider">
                  {section.badge}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-neutral-400 mt-0.5 flex items-center gap-1.5">
              {section.id === 'fresh-today' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
              {section.subtitle}
            </p>
          </div>
        </div>

        {/* Desktop Controls & View All */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/shop?filter=${section.filter}`)}
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group/btn transition-all"
          >
            View all 
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              className={`p-2.5 rounded-full border transition-all ${
                showLeftArrow 
                  ? 'bg-white border-neutral-200 text-neutral-800 hover:border-orange-500 hover:text-orange-600 shadow-md active:scale-90' 
                  : 'bg-neutral-50 border-neutral-100 text-neutral-300 opacity-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              className={`p-2.5 rounded-full border transition-all ${
                showRightArrow 
                  ? 'bg-white border-neutral-200 text-neutral-800 hover:border-orange-500 hover:text-orange-600 shadow-md active:scale-90' 
                  : 'bg-neutral-50 border-neutral-100 text-neutral-300 opacity-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal List Wrapper */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <motion.div
          ref={scrollRef}
          onScroll={handleScroll}
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6 pt-2 snap-x snap-mandatory"
        >
          {loading ? (
            // Enterprise Skeleton State
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[180px] md:w-[260px]">
                <ShimmerProductCard />
              </div>
            ))
          ) : (
            <>
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="shrink-0 w-[180px] md:w-[260px] snap-start"
                >
                  {/* The ProductCard itself handles its own hover/active states */}
                  <ProductCard product={product} />
                </div>
              ))}

              {/* Enhanced End-Cap Card */}
              <motion.button
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop')}
                className="shrink-0 w-[160px] md:w-[220px] aspect-[3/4] rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 flex flex-col items-center justify-center gap-4 text-neutral-400 group/end hover:border-orange-400 hover:bg-orange-50 transition-all snap-start"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover/end:bg-orange-500 group-hover/end:text-white transition-all duration-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <div className="text-center px-4">
                  <span className="block font-black text-neutral-800 text-sm uppercase tracking-wider mb-1">
                    See All
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    {products.length}+ More Items
                  </span>
                </div>
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Subtle Fade for better scroll visualization on desktop */}
        <div className="hidden md:block absolute top-0 right-0 bottom-6 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  )
}

// ==========================================
// Main Discovery Section Component
// ==========================================

export default function ProductDiscoverySection() {
  return (
    <section className="relative py-12 md:py-24 bg-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Branding Header */}
        <header className="mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
             <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
               Exclusive
             </span>
             <div className="h-px flex-1 bg-neutral-100" />
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-7xl font-black text-neutral-900 leading-[0.95] tracking-tighter"
              >
                Groceries & Essentials <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  Delivered in Mins.
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-neutral-500 font-medium mt-6 max-w-lg leading-relaxed"
              >
                Skip the queue. We bring the store to your doorstep with our curated premium selections.
              </motion.p>
            </div>

            {/* Quick Stats / Trust Badges for Enterprise look */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Zap, text: 'Fast Delivery', sub: 'Under 15 mins' },
                { icon: Clock, text: '24/7 Support', sub: 'Always here' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 p-4 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <stat.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900 leading-none">{stat.text}</div>
                    <div className="text-[10px] font-semibold text-neutral-400 uppercase mt-1">{stat.sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </header>

        {/* Discovery Sections Grid */}
        <div className="space-y-4">
          {DISCOVERY_SECTIONS.map((section, index) => (
            <ProductSection 
              key={section.id} 
              section={section} 
              index={index}
            />
          ))}
        </div>

        {/* Bottom Banner Hook (Enterprise Pattern) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 md:p-12 rounded-[2.5rem] bg-neutral-900 relative overflow-hidden group"
        >
          {/* Animated Background Gradient */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-3xl md:text-5xl font-black text-white mb-2">Can't find what you need?</h4>
              <p className="text-neutral-400 font-medium text-lg">Browse our full catalog with 5000+ items across all categories.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
              className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-900/40 hover:bg-orange-500 transition-colors"
            >
              Explore Full Shop
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

