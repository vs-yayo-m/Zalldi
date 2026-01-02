import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Zap, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * ZALLDI ENTERPRISE HERO SECTION
 * Enhanced for high conversion and premium "Quick Commerce" feel.
 * * Mobile Optimization: 
 * - Height is strictly 1/4 of viewport (h-[25vh]).
 * - No manual navigation buttons (Auto-slide only).
 * - Compact typography.
 */

const slides = [
  {
    id: 1,
    title: "Butwal's Quickest Delivery",
    subtitle: "Everything delivered in minutes",
    cta: "🛒 Shop Now",
    action: "/shop",
    bg: "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-orange-950",
    accent: "orange",
    tag: "Express"
  },
  {
    id: 2,
    title: "Dinner & Essentials — Instantly",
    subtitle: "Doorstep delivery before you sleep 😴",
    cta: "🌙 Order Now",
    action: "/shop",
    bg: "bg-gradient-to-br from-[#2d1b4e] via-[#1a1242] to-orange-900",
    accent: "purple",
    tag: "Late Night"
  },
  {
    id: 3,
    title: "Freshness Handpicked for You",
    subtitle: "Directly from local stores to your kitchen",
    cta: "🏪 Explore Stores",
    action: "/shop",
    bg: "bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500",
    accent: "white",
    tag: "Local"
  },
  {
    id: 4,
    title: "Fast Isn't Enough. Zalldi Is Faster",
    subtitle: "When speed matters, we deliver excellence",
    cta: "⚡ Order Fast",
    action: "/shop",
    bg: "bg-gradient-to-br from-blue-900 via-blue-800 to-orange-800",
    accent: "blue",
    tag: "Turbo"
  },
  {
    id: 5,
    title: "Wait Less. Eat Fresh",
    subtitle: "Quality groceries delivered with care",
    cta: "Get Fresh",
    action: "/category/vegetables",
    bg: "bg-gradient-to-br from-emerald-900 via-emerald-800 to-orange-900",
    accent: "green",
    tag: "Quality"
  }
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  // Auto-slide logic: 3 seconds per slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleAction = useCallback((path) => {
    navigate(path)
  }, [navigate])

  return (
    <section className="relative w-full px-4 lg:px-8 py-2 lg:py-4">
      <div className="relative w-full h-[25vh] md:h-[400px] lg:h-[480px] overflow-hidden rounded-2xl lg:rounded-[2.5rem] shadow-2xl shadow-orange-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className={`absolute inset-0 ${slides[current].bg}`}
          >
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 opacity-20 overflow-hidden">
               <motion.div 
                 animate={{ 
                   scale: [1, 1.2, 1],
                   rotate: [0, 5, 0] 
                 }}
                 transition={{ duration: 10, repeat: Infinity }}
                 className="absolute -top-20 -right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" 
               />
               <motion.div 
                 animate={{ 
                   x: [0, 30, 0],
                   y: [0, -20, 0] 
                 }}
                 transition={{ duration: 8, repeat: Infinity }}
                 className="absolute bottom-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" 
               />
            </div>

            {/* Content Container */}
            <div className="relative h-full container mx-auto flex items-center px-6 lg:px-16">
              <div className="max-w-3xl">
                {/* Badge Tag */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-2 lg:mb-4"
                >
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] lg:text-xs font-black text-white uppercase tracking-widest border border-white/10">
                    {slides[current].tag}
                  </span>
                  <div className="flex items-center gap-1 text-orange-400 text-[10px] lg:text-xs font-bold">
                    <Clock className="w-3 h-3" /> 15 MIN DELIVERY
                  </div>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="text-xl md:text-5xl lg:text-7xl font-black text-white mb-2 lg:mb-6 leading-[1.1] tracking-tighter"
                >
                  {slides[current].title.split(' ').map((word, i) => (
                    <span key={i} className={word.toLowerCase() === 'zalldi' ? 'text-orange-500' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </motion.h1>

                {/* Subheading (Hidden on ultra-small mobile to preserve 1/4 height) */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="hidden sm:block text-sm md:text-xl text-white/80 mb-4 lg:mb-8 max-w-xl leading-relaxed font-medium"
                >
                  {slides[current].subtitle}
                </motion.p>

                {/* CTA Action */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    size="lg"
                    onClick={() => handleAction(slides[current].action)}
                    className="group bg-orange-500 hover:bg-white text-white hover:text-orange-600 border-none px-4 py-2 lg:px-10 lg:py-7 rounded-xl lg:rounded-2xl transition-all duration-500 shadow-xl shadow-orange-950/20"
                  >
                    <span className="flex items-center gap-2 lg:gap-3 text-xs lg:text-lg font-black uppercase tracking-tight">
                      {slides[current].cta}
                      <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </div>

              {/* Floating App Illustration (Desktop Only) */}
              <div className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 w-[400px] h-[400px] items-center justify-center">
                 <motion.div
                   animate={{ 
                     y: [0, -20, 0],
                     rotate: [0, 2, 0]
                   }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                   className="relative w-full h-full bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 p-8 shadow-2xl overflow-hidden"
                 >
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center text-white gap-4">
                        <ShoppingBag className="w-24 h-24 opacity-20 absolute" />
                        <Zap className="w-16 h-16 fill-white" />
                        <div className="text-center">
                          <p className="font-black text-2xl tracking-tighter uppercase">Super Fast</p>
                          <p className="text-sm font-medium opacity-80">Order to Door in Minutes</p>
                        </div>
                    </div>
                 </motion.div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 lg:h-2 bg-black/10">
              <motion.div
                key={current}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-4 right-6 lg:bottom-10 lg:right-16 flex items-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`transition-all duration-500 rounded-full ${
                i === current ? 'w-8 lg:w-12 h-1 lg:h-2 bg-orange-500' : 'w-1 lg:w-2 h-1 lg:h-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-2 lg:gap-4 mt-4 px-2">
        {[
          { icon: Clock, label: "15 Min Delivery", color: "text-orange-500" },
          { icon: ShieldCheck, label: "100% Quality", color: "text-emerald-500" },
          { icon: Zap, label: "Instant Returns", color: "text-blue-500" }
        ].map((badge, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 p-2 lg:p-4 bg-white rounded-xl lg:rounded-2xl border border-neutral-100 shadow-sm"
          >
            <badge.icon className={`w-4 h-4 lg:w-6 lg:h-6 ${badge.color}`} />
            <span className="text-[9px] lg:text-sm font-black text-neutral-800 uppercase tracking-tighter whitespace-nowrap">
              {badge.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/**
 * PRODUCTION NOTES:
 * 1. Performance: Used CSS gradients instead of heavy images for instant LCP (Largest Contentful Paint).
 * 2. UX: The progress bar at the bottom gives users a visual cue of when the slide will change.
 * 3. Mobile: The 1/4th height (h-[25vh]) ensures the Hero doesn't push the actual product categories too far down the screen.
 * 4. Branding: Strong use of Zalldi Orange 🧡 throughout for brand recall.
 */

