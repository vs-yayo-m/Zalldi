// src/pages/Home.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Clock, Heart, ShoppingCart, User, Gift, Search,
  TrendingUp, Sparkles, Snowflake, Package, Star, Zap,
  CheckCircle, Home as HomeIcon, RotateCcw, DollarSign, MessageCircle, X
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

const HERO_SLIDES = [
  {
    id: 1,
    title: "Butwal's First Quick Commerce",
    subtitle: "Everything you need, delivered in minutes.",
    primaryCTA: "Shop Now",
    secondaryCTA: "About Zalldi",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.ABOUT,
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    image: "/images/hero-1.webp"
  },
  {
    id: 2,
    title: "Dinner, Snacks & Essentials — Instantly",
    subtitle: "Ordered now. At your door before you sleep 😴",
    primaryCTA: "Order Now",
    secondaryCTA: "Late-Night Picks",
    primaryLink: ROUTES.SHOP,
    secondaryLink: `${ROUTES.SHOP}?category=snacks`,
    background: "linear-gradient(135deg, #2d1b69 0%, #1a0b3e 50%, #0f051d 100%)",
    image: "/images/hero-2.webp"
  },
  {
    id: 3,
    title: "Powered by Local Stores. Delivered by Zalldi.",
    subtitle: "Your neighborhood shops, supercharged with speed.",
    primaryCTA: "Explore Stores",
    secondaryCTA: "How It Works",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.HOW_IT_WORKS,
    background: "linear-gradient(135deg, #c94b4b 0%, #4b134f 50%, #1e3a8a 100%)",
    image: "/images/hero-3.webp"
  },
  {
    id: 4,
    title: "Fast Isn't Enough. Zalldi Is Faster.",
    subtitle: "When speed matters, Zalldi delivers.",
    primaryCTA: "Order Fast",
    secondaryCTA: "See How Fast",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.HOW_IT_WORKS,
    background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #e67e00 100%)",
    image: "/images/hero-4.webp"
  },
  {
    id: 5,
    title: "Wait Less. Eat Fresh.",
    subtitle: "Fresh food delivered while it's still fresh.",
    primaryCTA: "Get Fresh",
    secondaryCTA: "Browse Food",
    primaryLink: ROUTES.SHOP,
    secondaryLink: `${ROUTES.SHOP}?category=vegetables`,
    background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
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
  { id: 1, name: "Fresh Milk", price: 85, image: "/products/milk.webp", badge: "🔥 Bestseller", discount: 10 },
  { id: 2, name: "Brown Eggs", price: 280, image: "/products/eggs.webp", badge: "⭐ Popular", discount: 0 },
  { id: 3, name: "Fresh Tomatoes", price: 60, image: "/products/tomato.webp", badge: "🌱 Fresh", discount: 15 },
  { id: 4, name: "White Bread", price: 65, image: "/products/bread.webp", badge: "🔥 Hot", discount: 0 },
  { id: 5, name: "Basmati Rice", price: 180, image: "/products/rice.webp", badge: "⭐ Top Rated", discount: 5 },
  { id: 6, name: "Potato 1kg", price: 45, image: "/products/potato.webp", badge: "🌱 Fresh", discount: 0 },
  { id: 7, name: "Onion 1kg", price: 55, image: "/products/onion.webp", badge: "🌱 Essential", discount: 10 },
  { id: 8, name: "Banana", price: 120, image: "/products/banana.webp", badge: "🍌 Fresh", discount: 0 }
]

const SEARCH_PLACEHOLDERS = [
  "Search for Milk...",
  "Search for Earbuds...",
  "Search for Chocolates...",
  "Search for Fresh Vegetables...",
  "Search for Bread...",
  "Search for Snacks..."
]

export default function Home() {
  const navigate = useNavigate()
  const { addToCart, cartCount } = useCart()
  const { user } = useAuth()
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchPlaceholder, setSearchPlaceholder] = useState(0)
  const [flyToCartTrigger, setFlyToCartTrigger] = useState(0)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 3000)
    return () => clearInterval(slideInterval)
  }, [])

  useEffect(() => {
    const placeholderInterval = setInterval(() => {
      setSearchPlaceholder((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length)
    }, 2000)
    return () => clearInterval(placeholderInterval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowWhatsApp(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
    setFlyToCartTrigger(prev => prev + 1)
    toast.success(`${product.name} added to cart!`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Sticky Premium Header */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-left">
              <MapPin className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-caption text-neutral-500">Delivering to</p>
                <p className="text-body-sm font-semibold text-neutral-800">Home - Butwal Ward 9</p>
              </div>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-body-sm font-semibold text-orange-600">30 mins</span>
              </div>
              
              <button onClick={() => navigate(ROUTES.CUSTOMER_WISHLIST)} className="relative">
                <Heart className="w-6 h-6 text-neutral-600" />
              </button>
              
              <button className="relative">
                <Gift className="w-6 h-6 text-neutral-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-white text-[10px] flex items-center justify-center">2</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Search Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={SEARCH_PLACEHOLDERS[searchPlaceholder]}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-body"
            />
          </form>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{ background: HERO_SLIDES[currentSlide].background }}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-hero font-display mb-4 ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-900' : 'text-white'}`}
                >
                  {HERO_SLIDES[currentSlide].title}
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-body-lg mb-6 ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-700' : 'text-white/90'}`}
                >
                  {HERO_SLIDES[currentSlide].subtitle}
                </motion.p>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button
                    size="lg"
                    onClick={() => navigate(HERO_SLIDES[currentSlide].primaryLink)}
                    className="bg-white text-orange-600 hover:bg-neutral-100"
                  >
                    {HERO_SLIDES[currentSlide].primaryCTA}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate(HERO_SLIDES[currentSlide].secondaryLink)}
                    className={HERO_SLIDES[currentSlide].darkText ? 'border-neutral-900 text-neutral-900' : 'border-white text-white'}
                  >
                    {HERO_SLIDES[currentSlide].secondaryCTA}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Micro Promotional Strip */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-y border-orange-200 py-3 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex space-x-8 items-center"
        >
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, idx) => (
            <div key={idx} className="flex items-center space-x-2 px-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-body-sm font-medium text-neutral-700 whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Categories Section */}
        <FadeInWhenVisible>
          <div>
            <h2 className="text-heading font-display text-neutral-800 mb-6">Shop by Category</h2>
            <div className="grid grid-cols-4 gap-4">
              {CATEGORIES.slice(0, 7).map((category, idx) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`${ROUTES.CATEGORY}/${category.id}`)}
                  className="flex flex-col items-center space-y-2 p-4 rounded-2xl hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: `${category.color}30` }}>
                    {category.icon === 'ShoppingBasket' && '🛒'}
                    {category.icon === 'Carrot' && '🥕'}
                    {category.icon === 'Apple' && '🍎'}
                    {category.icon === 'Milk' && '🥛'}
                    {category.icon === 'Fish' && '🐟'}
                    {category.icon === 'Croissant' && '🥐'}
                    {category.icon === 'Coffee' && '☕'}
                  </div>
                  <span className="text-body-sm font-medium text-neutral-800 text-center">{category.name}</span>
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => navigate(ROUTES.SHOP)}
                className="flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <span className="text-body-sm font-semibold text-orange-600">See All</span>
              </motion.button>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Best Selling */}
        <FadeInWhenVisible>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-display text-neutral-800">🔥 Best Selling</h2>
              <button onClick={() => navigate(ROUTES.SHOP)} className="text-orange-600 font-medium text-body-sm">View All →</button>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {SAMPLE_PRODUCTS.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </FadeInWhenVisible>

        {/* New Arrivals */}
        <FadeInWhenVisible>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-display text-neutral-800">✨ New Arrivals</h2>
              <button onClick={() => navigate(ROUTES.SHOP)} className="text-orange-600 font-medium text-body-sm">View All →</button>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {SAMPLE_PRODUCTS.slice(2, 6).map((product) => (
                <ProductCard key={product.id} product={{...product, badge: "✨ New"}} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Fresh Today */}
        <FadeInWhenVisible>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-display text-neutral-800">🌱 Fresh Today</h2>
              <button onClick={() => navigate(ROUTES.SHOP)} className="text-orange-600 font-medium text-body-sm">View All →</button>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {SAMPLE_PRODUCTS.slice(1, 5).map((product) => (
                <ProductCard key={product.id} product={{...product, badge: "🌱 Fresh"}} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Featured Products Grid */}
        <FadeInWhenVisible>
          <div>
            <h2 className="text-heading font-display text-neutral-800 mb-6">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SAMPLE_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Trust Section */}
        <FadeInWhenVisible>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-display font-display mb-8 text-center">Why Choose Zalldi?</h2>
            <div className="grid md:grid-cols-5 gap-6">
              <TrustCard icon={<Zap />} title="Delivery in Minutes" desc="Get your order in 30-60 mins" />
              <TrustCard icon={<HomeIcon />} title="100% Local Vendors" desc="Support your community" />
              <TrustCard icon={<CheckCircle />} title="Quality Checked" desc="Every product verified" />
              <TrustCard icon={<DollarSign />} title="Free Delivery" desc="On first order" />
              <TrustCard icon={<RotateCcw />} title="Easy Refunds" desc="Hassle-free returns" />
            </div>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* WhatsApp Float Button */}
      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <button
              onClick={() => window.open('https://wa.me/9779821072912', '_blank')}
              className="relative"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <MessageCircle className="w-7 h-7 text-white" />
              </motion.div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowWhatsApp(false) }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <FlyToCart trigger={flyToCartTrigger} />
      <Footer />
    </div>
  )
}

function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden min-w-[180px] flex-shrink-0"
    >
      <div className="relative">
        <div className="aspect-square bg-neutral-100 flex items-center justify-center text-6xl">
          {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : '📦'}
        </div>
        {product.badge && (
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-caption font-medium">
            {product.badge}
          </div>
        )}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-caption font-bold">
            {product.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-title font-bold text-orange-600">Rs. {product.price}</p>
            {product.discount > 0 && (
              <p className="text-caption text-neutral-400 line-through">Rs. {Math.round(product.price / (1 - product.discount / 100))}</p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => onAddToCart(product)}
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </motion.div>
  )
}

function TrustCard({ icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-body-sm text-white/80">{desc}</p>
    </div>
  )
}