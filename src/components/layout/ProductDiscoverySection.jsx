import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Flame, Sparkles, Leaf, Snowflake, ArrowRight } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import ProductCard from '@components/customer/ProductCard'
import { productService } from '@services/product.service'
import { ShimmerProductCard } from '@components/animations/Shimmer'

const sections = [
  { 
    id: 'best-selling', 
    title: '🔥 Best Selling', 
    subtitle: 'Top picks of the week',
    icon: Flame,
    filter: 'bestSelling',
    gradient: 'from-orange-500 to-red-600',
    accent: 'bg-orange-50'
  },
  { 
    id: 'new-arrivals', 
    title: 'New Arrivals', 
    subtitle: 'Just landed in store',
    icon: Sparkles,
    filter: 'new',
    gradient: 'from-purple-500 to-indigo-600',
    accent: 'bg-purple-50'
  },
  { 
    id: 'fresh-today', 
    title: 'Fresh Today', 
    subtitle: 'Farm to table daily',
    icon: Leaf,
    filter: 'fresh',
    gradient: 'from-emerald-500 to-green-600',
    accent: 'bg-emerald-50'
  },
  { 
    id: 'cold-frozen', 
    title: 'Cold & Frozen', 
    subtitle: 'Keep it chilled',
    icon: Snowflake,
    filter: 'frozen',
    gradient: 'from-blue-500 to-cyan-600',
    accent: 'bg-blue-50'
  }
]

function ProductSection({ section }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -scrollRef.current.clientWidth * 0.8 : scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const Icon = section.icon

  return (
    <div className="mb-16 group/section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg shadow-black/10`}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {section.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {section.id === 'fresh-today' && (
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              )}
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                {section.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-12 h-12 rounded-xl border border-neutral-100 flex items-center justify-center transition-all shadow-sm ${
              canScrollLeft 
                ? 'bg-white hover:bg-orange-500 hover:text-white hover:border-orange-500 cursor-pointer' 
                : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-12 h-12 rounded-xl border border-neutral-100 flex items-center justify-center transition-all shadow-sm ${
              canScrollRight 
                ? 'bg-white hover:bg-orange-500 hover:text-white hover:border-orange-500 cursor-pointer' 
                : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] md:w-[240px]">
                <ShimmerProductCard />
              </div>
            ))
          ) : (
            <>
              {products.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="flex-shrink-0 w-[200px] md:w-[240px]"
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
              {/* "View More" End Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 w-[200px] md:w-[240px] aspect-[4/5] rounded-[2rem] border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 transition-all group/more"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover/more:bg-orange-500 group-hover/more:text-white transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="font-black uppercase text-xs tracking-widest">View All</span>
              </motion.button>
            </>
          )}
        </div>
        
        {/* Subtle Side Fade Overlays */}
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  )
}

export default function ProductDiscoverySection() {
  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-[0.2em] mb-4"
          >
            Curated For You
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-black text-neutral-900 mb-4 tracking-tight"
          >
            Discover Amazing <span className="text-orange-500">Products</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl"
          >
            Handpicked collections featuring our best sellers and freshest arrivals delivered instantly.
          </motion.p>
        </div>

        {/* Individual Category Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <ProductSection section={section} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/**
 * UX IMPROVEMENTS:
 * 1. Scroll State: Navigation buttons now dynamically disable when you reach the start or end of a carousel.
 * 2. Visual Feedback: Added a pulsing dot for 'Fresh Today' and spring-based "lifts" on cards.
 * 3. Navigation: Buttons now have a satisfying hover color change and scaling effect.
 * 4. Progressive Loading: Maintained Shimmer cards but added a 'View All' end-cap card for better flow.
 * 5. Modern Layout: Increased spacing and added typography hierarchies (Badge -> Title -> Subtitle).
 */