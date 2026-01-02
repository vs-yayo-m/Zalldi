// src/components/layout/HeroSection.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, Phone, Info, Zap, MessageCircle, Users } from 'lucide-react'
import Button from '@components/ui/Button'

const slides = [
  {
    id: 1,
    title: "Butwal's First Quick Commerce",
    subtitle: "Everything you need, Free delivered in minutes",
    cta1: { text: "🛒 Shop Now", action: "/shop" },
    cta2: { text: "About Zalldi", action: "/about" },
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    theme: "dark"
  },
  {
    id: 2,
    title: "Dinner, Snacks & Essentials — Instantly",
    subtitle: "Ordered now. At your door before you sleep 😴",
    cta1: { text: "🌙 Order Now", action: "/shop" },
    cta2: { text: "Contact Us", action: "/contact" },
    background: "linear-gradient(135deg, #2d1b4e 0%, #1a1242 50%, #0a0520 100%)",
    theme: "dark"
  },
  {
    id: 3,
    title: "Powered by Local Stores. Delivered by Zalldi",
    subtitle: "Your neighborhood shops, supercharged with speed",
    cta1: { text: "🏪 Explore Stores", action: "/shop" },
    cta2: { text: "How It Works", action: "/how-it-works" },
    background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #E67E00 100%)",
    theme: "light"
  },
  {
    id: 4,
    title: "Fast Isn't Enough. Zalldi Is Faster",
    subtitle: "When speed matters, Zalldi delivers",
    cta1: { text: "⚡ Order Fast", action: "/shop" },
    cta2: { text: "FAQs", action: "/faq" },
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)",
    theme: "dark"
  },
  {
    id: 5,
    title: "Wait Less. Eat Fresh",
    subtitle: "Fresh food delivered while it's still fresh",
    cta1: { text: "Get Fresh", action: "/category/vegetables" },
    cta2: { text: "Meet Founder", action: "/about" },
    background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
    theme: "dark"
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 2250)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const handleCTAClick = (action) => {
    navigate(action)
  }

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 rounded-2xl md:rounded-3xl mx-4 md:mx-8 overflow-hidden"
          style={{ background: slides[currentSlide].background }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-2xl"
            >
              <motion.h1 
                className={`text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight ${
                  slides[currentSlide].theme === 'dark' ? 'text-white' : 'text-white'
                }`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p 
                className={`text-lg md:text-xl mb-8 ${
                  slides[currentSlide].theme === 'dark' ? 'text-white/90' : 'text-white/95'
                }`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={() => handleCTAClick(slides[currentSlide].cta1.action)}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-xl hover:shadow-2xl"
                >
                  {slides[currentSlide].cta1.text}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => handleCTAClick(slides[currentSlide].cta2.action)}
                  className={`${
                    slides[currentSlide].theme === 'dark' 
                      ? 'bg-white/10 text-white border-white/30 hover:bg-white/20' 
                      : 'bg-white/20 text-white border-white/40 hover:bg-white/30'
                  } backdrop-blur-sm`}
                >
                  {slides[currentSlide].cta2.text}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}