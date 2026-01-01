// 1. src/pages/Home.jsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  MapPin, Clock, Heart, ShoppingCart, User, Gift, Search,
  TrendingUp, Sparkles, Snowflake, Package, Star, Zap,
  CheckCircle, Home as HomeIcon, RotateCcw, DollarSign, MessageCircle, X,
  ChevronRight, Timer, ShieldCheck, ArrowRight, Plus
} from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Button from '@components/ui/Button'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import { ROUTES, CATEGORIES } from '@utils/constants'
import FlyToCart from '@components/animations/FlyToCart'
import { FadeInWhenVisible } from '@components/animations/FadeIn'
import toast from 'react-hot-toast'

// --- CONSTANTS & DATA (Preserved & Enhanced) ---

const HERO_SLIDES = [
  {
    id: 1,
    title: "Butwal's First Quick Commerce",
    subtitle: "Everything you need, delivered in minutes.",
    primaryCTA: "Shop Now",
    secondaryCTA: "About Zalldi",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.ABOUT,
    background: "linear-gradient(135deg, #FFF1EC 0%, #FFD6C9 100%)", // Lighter orange theme background
    accent: "#ff6b35",
    image: "/images/hero-1.webp",
    darkText: true
  },
  {
    id: 2,
    title: "Late Night Cravings?",
    subtitle: "Ordered now. At your door before you sleep 😴",
    primaryCTA: "Order Now",
    secondaryCTA: "Late-Night Picks",
    primaryLink: ROUTES.SHOP,
    secondaryLink: `${ROUTES.SHOP}?category=snacks`,
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    accent: "#818cf8",
    image: "/images/hero-2.webp",
    darkText: false
  },
  {
    id: 3,
    title: "Powered by Local Stores.",
    subtitle: "Your neighborhood shops, supercharged with speed.",
    primaryCTA: "Explore Stores",
    secondaryCTA: "How It Works",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.HOW_IT_WORKS,
    background: "linear-gradient(135deg, #ecfccb 0%, #bef264 100%)",
    accent: "#65a30d",
    image: "/images/hero-3.webp",
    darkText: true
  },
  {
    id: 4,
    title: "Fast Isn't Enough. Zalldi Is Faster.",
    subtitle: "When speed matters, Zalldi delivers.",
    primaryCTA: "Order Fast",
    secondaryCTA: "See How Fast",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.HOW_IT_WORKS,
    background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    accent: "#f97316",
    image: "/images/hero-4.webp",
    darkText: true
  },
  {
    id: 5,
    title: "Wait Less. Eat Fresh.",
    subtitle: "Fresh food delivered while it's still fresh.",
    primaryCTA: "Get Fresh",
    secondaryCTA: "Browse Food",
    primaryLink: ROUTES.SHOP,
    secondaryLink: `${ROUTES.SHOP}?category=vegetables`,
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    accent: "#22c55e",
    image: "/images/hero-5.webp",
    darkText: true
  }
]

const PARTNER_LOGOS = [
  { name: "Fresh Mart", logo: "/logos/partner-1.png" },
  { name: "Daily Needs", logo: "/logos/partner-2.png" },
  { name: "Quick Store", logo: "/logos/partner-3.png" },
  { name: "Super Bazaar", logo: "/logos/partner-4.png" },
  { name: "Fresh Valley", logo: "/logos/partner-5.png" }
]

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Fresh Milk Full Cream", price: 85, weight: "500 ml", image: "/products/milk.webp", badge: "🔥 Bestseller", discount: 10, time: "12 mins" },
  { id: 2, name: "Farm Fresh Brown Eggs", price: 280, weight: "12 pcs", image: "/products/eggs.webp", badge: "⭐ Popular", discount: 0, time: "15 mins" },
  { id: 3, name: "Hybrid Red Tomatoes", price: 60, weight: "1 kg", image: "/products/tomato.webp", badge: "🌱 Fresh", discount: 15, time: "10 mins" },
  { id: 4, name: "Classic White Bread", price: 65, weight: "400 g", image: "/products/bread.webp", badge: "🔥 Hot", discount: 0, time: "8 mins" },
  { id: 5, name: "Premium Basmati Rice", price: 180, weight: "1 kg", image: "/products/rice.webp", badge: "⭐ Top Rated", discount: 5, time: "25 mins" },
  { id: 6, name: "Fresh Local Potatoes", price: 45, weight: "1 kg", image: "/products/potato.webp", badge: "🌱 Fresh", discount: 0, time: "14 mins" },
  { id: 7, name: "Red Onions", price: 55, weight: "1 kg", image: "/products/onion.webp", badge: "🌱 Essential", discount: 10, time: "14 mins" },
  { id: 8, name: "Robusta Banana", price: 120, weight: "1 dozen", image: "/products/banana.webp", badge: "🍌 Fresh", discount: 0, time: "11 mins" }
]

const SEARCH_PLACEHOLDERS = [
  "Search for 'Milk'...",
  "Search for 'Kurkure'...",
  "Search for 'Chocolate'...",
  "Search for 'Paneer'...",
  "Search for 'Bread'...",
  "Search for 'Coke'..."
]

// --- MAIN COMPONENT ---

export default function Home() {
  const navigate = useNavigate()
  const { addToCart, cartCount, cartTotal } = useCart()
  const { user } = useAuth()
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchPlaceholder, setSearchPlaceholder] = useState(0)
  const [flyToCartTrigger, setFlyToCartTrigger] = useState(0)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll detection for sticky header enhanced effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-slide logic
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000) // Slower for better readability
    return () => clearInterval(slideInterval)
  }, [])

  // Search placeholder animation logic
  useEffect(() => {
    const placeholderInterval = setInterval(() => {
      setSearchPlaceholder((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length)
    }, 3000)
    return () => clearInterval(placeholderInterval)
  }, [])

  // WhatsApp popup delay
  useEffect(() => {
    const timer = setTimeout(() => setShowWhatsApp(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleAddToCart = (product, e) => {
    // Prevent navigation if clicking the add button
    if(e) e.stopPropagation();
    
    addToCart(product)
    setFlyToCartTrigger(prev => prev + 1)
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">Added to cart</p>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-24 md:pb-10">
      <Header />

      {/* --- ENTERPRISE STICKY HEADER --- */}
      <div className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="container mx-auto px-4">
          {/* Top Bar: Location & Actions */}
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col">
              <button className="flex items-center space-x-1 group">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-1 group-hover:text-orange-600 transition-colors">
                  <MapPin className="w-5 h-5 text-orange-600 fill-orange-100" />
                  Home - Butwal
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                </h2>
              </button>
              <span className="text-xs text-gray-500 font-medium ml-6">Ward 9 • Delivery in 12 mins</span>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(ROUTES.CUSTOMER_WISHLIST)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>
              <div 
                 onClick={() => navigate(ROUTES.CART)}
                 className="flex flex-col items-end cursor-pointer"
              >
                 {cartCount > 0 ? (
                   <div className="bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm hover:bg-green-800 transition-colors">
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] uppercase font-bold opacity-80">{cartCount} items</span>
                        <span className="text-xs font-bold">Rs {cartTotal || 0}</span>
                      </div>
                      <ShoppingCart className="w-4 h-4" />
                   </div>
                 ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                        <User className="w-5 h-5" />
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Search Bar - Integrated & Slick */}
          <div className={`pb-3 transition-all duration-300 ${isScrolled ? 'hidden md:block' : 'block'}`}>
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 sm:text-sm shadow-sm"
              />
              {/* Animated Placeholder Overlay */}
              {!searchQuery && (
                <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={searchPlaceholder}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400 text-sm"
                    >
                      {SEARCH_PLACEHOLDERS[searchPlaceholder]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 space-y-10">
        
        {/* --- HERO SECTION: MODERN CAROUSEL --- */}
        <section className="relative rounded-3xl overflow-hidden shadow-lg h-[200px] md:h-[350px] lg:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
              style={{ background: HERO_SLIDES[currentSlide].background }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="relative h-full flex flex-col justify-center px-6 md:px-12 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider"
                    style={{ 
                      backgroundColor: HERO_SLIDES[currentSlide].darkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                      color: HERO_SLIDES[currentSlide].darkText ? '#333' : '#fff'
                    }}
                  >
                    #{currentSlide + 1} Trending
                  </span>
                  <h1 className={`text-2xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight ${HERO_SLIDES[currentSlide].darkText ? 'text-gray-900' : 'text-white'}`}>
                    {HERO_SLIDES[currentSlide].title}
                  </h1>
                  <p className={`text-sm md:text-lg mb-6 max-w-lg font-medium ${HERO_SLIDES[currentSlide].darkText ? 'text-gray-700' : 'text-white/90'}`}>
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate(HERO_SLIDES[currentSlide].primaryLink)}
                      className="bg-gray-900 text-white hover:bg-gray-800 border-none shadow-xl"
                    >
                      {HERO_SLIDES[currentSlide].primaryCTA}
                    </Button>
                    <button
                      onClick={() => navigate(HERO_SLIDES[currentSlide].secondaryLink)}
                      className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                        HERO_SLIDES[currentSlide].darkText 
                          ? 'text-gray-900 bg-white/50 hover:bg-white' 
                          : 'text-white bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {HERO_SLIDES[currentSlide].secondaryCTA}
                    </button>
                  </div>
                </motion.div>
              </div>
              
              {/* Decorative Background Image (Optional) */}
              {/* <div className="absolute right-0 bottom-0 h-full w-1/2 bg-contain bg-no-repeat bg-right-bottom opacity-20 pointer-events-none" style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide].image})` }} /> */}
            </motion.div>
          </AnimatePresence>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {HERO_SLIDES.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-gray-900' : 'w-2 bg-gray-400/50'}`}
              />
            ))}
          </div>
        </section>

        {/* --- PARTNER MARQUEE --- */}
        <section className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 py-4">
           <div className="flex items-center gap-2 mb-2 px-4">
             <Sparkles className="w-4 h-4 text-orange-500" />
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Trusted Partners</span>
           </div>
           <div className="relative flex overflow-x-hidden group">
            <motion.div 
              className="flex space-x-12 whitespace-nowrap py-2"
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, index) => (
                <div key={index} className="flex items-center space-x-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                     <Package className="w-4 h-4 text-gray-600" />
                   </div>
                   <span className="font-semibold text-gray-700">{partner.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- CATEGORY GRID (BLINKIT STYLE) --- */}
        <FadeInWhenVisible>
          <section>
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
              {CATEGORIES.slice(0, 15).map((category, idx) => (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`${ROUTES.CATEGORY}/${category.id}`)}
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div 
                    className="w-full aspect-[4/5] rounded-2xl mb-2 relative overflow-hidden flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <div className="text-4xl md:text-5xl transform hover:scale-110 transition-transform duration-300">
                      {category.icon === 'ShoppingBasket' && '🛒'}
                      {category.icon === 'Carrot' && '🥕'}
                      {category.icon === 'Apple' && '🍎'}
                      {category.icon === 'Milk' && '🥛'}
                      {category.icon === 'Fish' && '🐟'}
                      {category.icon === 'Croissant' && '🥐'}
                      {category.icon === 'Coffee' && '☕'}
                      {/* Add more generic fallbacks if needed */}
                      {!['ShoppingBasket', 'Carrot', 'Apple', 'Milk', 'Fish', 'Croissant', 'Coffee'].includes(category.icon) && '📦'}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-center text-gray-700 leading-tight px-1">
                    {category.name}
                  </span>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ y: -5 }}
                onClick={() => navigate(ROUTES.SHOP)}
                className="cursor-pointer flex flex-col items-center"
              >
                 <div className="w-full aspect-[4/5] rounded-2xl mb-2 relative overflow-hidden flex items-center justify-center bg-orange-50 border-2 border-dashed border-orange-200">
                    <ArrowRight className="w-8 h-8 text-orange-500" />
                 </div>
                 <span className="text-xs md:text-sm font-semibold text-center text-orange-600">See All</span>
              </motion.div>
            </div>
          </section>
        </FadeInWhenVisible>

        {/* --- HORIZONTAL PRODUCT RAILS --- */}
        
        {/* Rail 1: Bestsellers */}
        <ProductRail 
          title="🔥 Bestsellers in your area" 
          products={SAMPLE_PRODUCTS.slice(0, 5)} 
          onAdd={handleAddToCart}
          onViewAll={() => navigate(ROUTES.SHOP)}
          bg="bg-gradient-to-r from-orange-50 to-transparent"
        />

        {/* Rail 2: Fresh */}
        <ProductRail 
          title="🥦 Farm Fresh Vegetables" 
          products={SAMPLE_PRODUCTS.slice(2, 7)} 
          onAdd={handleAddToCart}
          onViewAll={() => navigate(`${ROUTES.SHOP}?category=vegetables`)}
        />

        {/* Rail 3: Daily Essentials */}
        <ProductRail 
          title="🥛 Daily Essentials" 
          products={SAMPLE_PRODUCTS} 
          onAdd={handleAddToCart}
          onViewAll={() => navigate(`${ROUTES.SHOP}?category=essentials`)}
        />

        {/* --- TRUST BANNER --- */}
        <FadeInWhenVisible>
          <div className="relative overflow-hidden bg-gray-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-64 h-64" />
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
               <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Why Zalldi?</h2>
                  <p className="text-gray-300 text-lg mb-8">We don't just deliver groceries; we deliver time, freshness, and trust straight to your doorstep in Butwal.</p>
                  <Button onClick={() => navigate(ROUTES.ABOUT)} className="bg-orange-500 hover:bg-orange-600 border-none text-white">
                    Read Our Story
                  </Button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <TrustItem icon={<Clock className="w-6 h-6 text-orange-400" />} title="12 Min Delivery" desc="Fastest in town" />
                  <TrustItem icon={<ShieldCheck className="w-6 h-6 text-orange-400" />} title="Quality Check" desc="No bad produce" />
                  <TrustItem icon={<DollarSign className="w-6 h-6 text-orange-400" />} title="Best Prices" desc="Direct from mandi" />
                  <TrustItem icon={<RotateCcw className="w-6 h-6 text-orange-400" />} title="Easy Returns" desc="No questions asked" />
               </div>
            </div>
          </div>
        </FadeInWhenVisible>

      </div>

      {/* --- FLOATING ELEMENTS --- */}

      {/* WhatsApp Button */}
      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 md:bottom-10 right-4 z-50"
          >
            <div className="relative group">
              <button
                onClick={() => window.open('https://wa.me/9779821072912', '_blank')}
                className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <MessageCircle className="w-7 h-7 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowWhatsApp(false) }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="w-3 h-3 text-gray-600 hover:text-white" />
              </button>
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1 bg-white shadow-md rounded-lg text-xs font-bold text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Cart Summary (Mobile Only) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:hidden"
          >
            <button 
              onClick={() => navigate(ROUTES.CART)}
              className="w-full bg-green-700 text-white rounded-xl p-3 flex items-center justify-between shadow-lg active:scale-[0.99] transition-transform"
            >
               <div className="flex flex-col items-start">
                 <span className="text-xs uppercase opacity-90 font-bold">{cartCount} Items</span>
                 <span className="text-lg font-bold">Rs {cartTotal}</span>
               </div>
               <div className="flex items-center font-bold">
                 View Cart <ChevronRight className="w-5 h-5 ml-1" />
               </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <FlyToCart trigger={flyToCartTrigger} />
      <Footer />
    </div>
  )
}

// --- SUB COMPONENTS ---

function ProductRail({ title, products, onAdd, onViewAll, bg = "" }) {
  return (
    <FadeInWhenVisible>
      <section className={`rounded-2xl py-6 ${bg}`}>
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onViewAll} className="text-orange-600 font-bold text-sm hover:underline flex items-center">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-6 px-2 scrollbar-hide snap-x">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
          {/* "See More" Card at end of rail */}
          <div className="min-w-[140px] md:min-w-[180px] flex flex-col justify-center items-center">
             <button 
                onClick={onViewAll}
                className="w-12 h-12 rounded-full border-2 border-orange-500 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
             >
               <ArrowRight className="w-6 h-6" />
             </button>
             <span className="mt-2 text-sm font-semibold text-gray-600">View all</span>
          </div>
        </div>
      </section>
    </FadeInWhenVisible>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 min-w-[160px] md:min-w-[200px] flex flex-col snap-start relative group">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-[#566cd6] text-white text-[10px] font-bold px-2 py-0.5 rounded-r-lg shadow-sm uppercase tracking-wide">
            {product.discount}% OFF
          </span>
        )}
        {product.badge && (
           <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-lg shadow-sm flex items-center gap-1">
             {product.badge}
           </span>
        )}
      </div>

      {/* Image Area */}
      <div className="relative p-4 h-40 flex items-center justify-center">
         <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {e.target.src = 'https://placehold.co/200x200/f3f4f6/a3a3a3?text=Product';}}
         />
         <div className="absolute bottom-2 left-2 bg-gray-100/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1">
           <Timer className="w-3 h-3" /> {product.time}
         </div>
      </div>

      {/* Content Area */}
      <div className="p-3 pt-0 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 font-medium mb-1">{product.weight}</p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-3 h-10">
          {product.name}
        </h3>
        
        {/* Footer: Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              {product.discount > 0 ? `Rs ${Math.round(product.price / (1 - product.discount / 100))}` : ''}
            </span>
            <span className="text-sm font-bold text-gray-900">Rs {product.price}</span>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => onAdd(product, e)}
            className="border-green-600 text-green-700 hover:bg-green-50 px-4 py-1 h-auto text-xs uppercase font-extrabold rounded-lg tracking-wide bg-green-50/50"
          >
            ADD
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 flex flex-col items-center text-center backdrop-blur-sm hover:bg-gray-800 transition-colors">
      <div className="mb-2 bg-gray-700 p-2 rounded-full">
        {icon}
      </div>
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-400 leading-tight">{desc}</p>
    </div>
  )
}

