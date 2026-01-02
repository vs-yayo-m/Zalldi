import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Zap, ChevronRight, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

const slides = [
  {
    id: 1,
    title: "Butwal's First Quick Commerce",
    subtitle: "Everything you need, Free delivered in minutes",
    cta1: { text: "🛒 Shop Now", action: "/shop" },
    cta2: { text: "About Zalldi", action: "/about" },
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    accent: "rgba(249, 115, 22, 0.2)",
    theme: "dark"
  },
  {
    id: 2,
    title: "Dinner, Snacks & Essentials — Instantly",
    subtitle: "Ordered now. At your door before you sleep 😴",
    cta1: { text: "🌙 Order Now", action: "/shop" },
    cta2: { text: "Contact Us", action: "/contact" },
    background: "linear-gradient(135deg, #2d1b4e 0%, #1a1242 50%, #0a0520 100%)",
    accent: "rgba(168, 85, 247, 0.2)",
    theme: "dark"
  },
  {
    id: 3,
    title: "Powered by Local Stores. Delivered by Zalldi",
    subtitle: "Your neighborhood shops, supercharged with speed",
    cta1: { text: "🏪 Explore Stores", action: "/shop" },
    cta2: { text: "How It Works", action: "/how-it-works" },
    background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #E67E00 100%)",
    accent: "rgba(255, 255, 255, 0.2)",
    theme: "light"
  },
  {
    id: 4,
    title: "Fast Isn't Enough. Zalldi Is Faster",
    subtitle: "When speed matters, Zalldi delivers",
    cta1: { text: "⚡ Order Fast", action: "/shop" },
    cta2: { text: "FAQs", action: "/faq" },
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)",
    accent: "rgba(59, 130, 246, 0.2)",
    theme: "dark"
  },
  {
    id: 5,
    title: "Wait Less. Eat Fresh",
    subtitle: "Fresh food delivered while it's still fresh",
    cta1: { text: "Get Fresh", action: "/category/vegetables" },
    cta2: { text: "Meet Founder", action: "/about" },
    background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
    accent: "rgba(52, 211, 153, 0.2)",
    theme: "dark"
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  // Optimized Auto-play Logic (3 seconds as requested)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleCTAClick = (action) => {
    navigate(action)
  }

  // Text Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  }

  return (
    <section className="relative w-full px-4 py-2 md:px-8 md:py-4">
      <div className="relative w-full h-[25vh] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl md:rounded-[2rem] shadow-2xl shadow-orange-500/10">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full"
            style={{ background: slides[currentSlide].background }}
          >
            {/* Ambient Background Aura - Enterprise UX enhancement */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/4 w-full h-full rounded-full blur-[120px]"
              style={{ background: slides[currentSlide].accent }}
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
              <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key={`content-${currentSlide}`}
                  className="max-w-3xl"
                >
                  {/* Badge Label */}
                  <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-md mb-2 md:mb-6">
                    <Zap className="w-3 h-3 md:w-4 md:h-4 text-orange-500 fill-orange-500" />
                    <span className="text-[10px] md:text-xs font-black text-orange-500 uppercase tracking-[0.2em]">Flash Delivery</span>
                  </motion.div>

                  <motion.h1 
                    variants={itemVariants}
                    className="text-xl md:text-5xl lg:text-7xl font-black mb-2 md:mb-6 leading-[1.1] text-white tracking-tight"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                  
                  <motion.p 
                    variants={itemVariants}
                    className="hidden md:block text-lg md:text-2xl mb-10 text-neutral-200/90 max-w-xl font-medium"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                  {/* Mobile Subtitle (condensed) */}
                  <motion.p variants={itemVariants} className="md:hidden text-[10px] text-white/80 mb-4 line-clamp-1">
                    {slides[currentSlide].subtitle}
                  </motion.p>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3 md:gap-4"
                  >
                    <Button
                      size="lg"
                      onClick={() => handleCTAClick(slides[currentSlide].cta1.action)}
                      className="h-10 md:h-14 px-4 md:px-8 bg-orange-500 hover:bg-orange-600 text-white border-none text-xs md:text-base font-bold shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 active:scale-95"
                    >
                      {slides[currentSlide].cta1.text}
                    </Button>
                    <button
                      onClick={() => handleCTAClick(slides[currentSlide].cta2.action)}
                      className="h-10 md:h-14 px-4 md:px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs md:text-base font-bold transition-all flex items-center gap-2 group"
                    >
                      {slides[currentSlide].cta2.text}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Progress Bar - Modern Auto-slide Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
              <motion.div 
                key={`progress-${currentSlide}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Navigation Dots */}
        <div className="absolute bottom-4 md:bottom-8 right-6 md:right-12 flex items-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="relative group p-2"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`transition-all duration-500 rounded-full ${
                index === currentSlide 
                  ? 'w-8 md:w-12 h-1.5 md:h-2 bg-orange-500' 
                  : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-white/40 group-hover:bg-white/60'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * ARCHITECTURAL UPGRADES:
 * 1. Mobile-First: h-[25vh] ensures the slider is perfectly proportioned on phones without cutting content.
 * 2. Performance: Used AnimatePresence with 'wait' mode to prevent layout thrashing during slide transitions.
 * 3. Accessibility: Added aria-labels to the navigation pagination.
 * 4. Visual Depth: Added a moving "Accent Aura" div that changes color based on the slide's theme for a premium feel.
 * 5. CTA Focus: Primary buttons use a shadow that matches the orange theme, increasing click-through probability.
 */

