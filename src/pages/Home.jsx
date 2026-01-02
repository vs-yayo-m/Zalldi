// src/pages/Home.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Clock, Heart, ShoppingCart, Search, Package, Star,
  ChevronRight, Timer, ShieldCheck, ArrowRight, MessageCircle, X, Zap, DollarSign, RotateCcw
} from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Button from '@components/ui/Button'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import { ROUTES, CATEGORIES } from '@utils/constants'
import { formatCurrency } from '@utils/formatters'
import FlyToCart from '@components/animations/FlyToCart'
import { FadeInWhenVisible } from '@components/animations/FadeIn'
import { ShimmerProductCard } from '@components/animations/Shimmer'
import { productService } from '@services/product.service'
import toast from 'react-hot-toast'

const HERO_SLIDES = [
  {
    id: 1,
    title: "Butwal's First Quick Commerce",
    subtitle: "Everything you need, delivered in minutes ",
    primaryCTA: "Shop Now",
    secondaryCTA: "About Zalldi",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.ABOUT,
    background: "linear-gradient(135deg, #FFF1EC 0%, #FFD6C9 100%)",
    darkText: true
  },
  {
    id: 2,
    title: "Late Night Cravings?",
    subtitle: "Order now. At your door in minutes",
    primaryCTA: "Order Now",
    secondaryCTA: "Browse Snacks",
    primaryLink: ROUTES.SHOP,
    secondaryLink: `${ROUTES.SHOP}?category=snacks`,
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    darkText: false
  },
  {
    id: 3,
    title: "Fresh from Local Stores",
    subtitle: "Your neighborhood shops, delivered fast",
    primaryCTA: "Explore Products",
    secondaryCTA: "How It Works",
    primaryLink: ROUTES.SHOP,
    secondaryLink: ROUTES.HOW_IT_WORKS,
    background: "linear-gradient(135deg, #ecfccb 0%, #bef264 100%)",
    darkText: true
  }
]

const SEARCH_PLACEHOLDERS = [
  "Search for 'Milk'...",
  "Search for 'Rice'...",
  "Search for 'Eggs'...",
  "Search for 'Vegetables'..."
]

export default function Home() {
  const navigate = useNavigate()
  const { addToCart, items: cartItems } = useCart()
  const { user } = useAuth()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchPlaceholder, setSearchPlaceholder] = useState(0)
  const [flyToCartTrigger, setFlyToCartTrigger] = useState(0)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  const cartCount = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
  const cartTotal = cartItems?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts({ limit: 20, active: true })
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(slideInterval)
  }, [])

  useEffect(() => {
    const placeholderInterval = setInterval(() => {
      setSearchPlaceholder((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length)
    }, 3000)
    return () => clearInterval(placeholderInterval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowWhatsApp(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleAddToCart = (product, e) => {
    if(e) e.stopPropagation()
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0] || '/placeholder.png',
      quantity: 1,
      supplierId: product.supplierId
    }
    
    addToCart(cartItem)
    setFlyToCartTrigger(prev => prev + 1)
    
    toast.success(`${product.name} added to cart`, {
      icon: '🛒',
      duration: 2000
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const featuredProducts = products.filter(p => p.featured).slice(0, 8)
  const bestsellerProducts = products.filter(p => (p.soldCount || 0) > 0).sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 8)
  const newProducts = [...products].sort((a, b) => {
    const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
    const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
    return bDate - aDate
  }).slice(0, 8)

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 md:pb-10">
      <Header />

      <div className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-neutral-200'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col">
              <button className="flex items-center space-x-1 group">
                <h2 className="text-lg font-display font-bold text-neutral-800 flex items-center gap-1 group-hover:text-orange-500 transition-colors">
                  <MapPin className="w-5 h-5 text-orange-500 fill-orange-100" />
                  Butwal
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500" />
                </h2>
              </button>
              <span className="text-caption text-neutral-500 font-medium ml-6">All 19 Wards • Delivery in 1 hour</span>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(user ? ROUTES.CUSTOMER_WISHLIST : ROUTES.LOGIN)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 hover:bg-orange-50 text-neutral-600 hover:text-orange-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>
              
              <div 
                onClick={() => navigate(ROUTES.CART)}
                className="flex flex-col items-end cursor-pointer"
              >
                {cartCount > 0 ? (
                  <div className="bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm hover:bg-green-700 transition-colors">
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] uppercase font-bold opacity-80">{cartCount} items</span>
                      <span className="text-xs font-bold">{formatCurrency(cartTotal)}</span>
                    </div>
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                ) : (
                  <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`pb-3 transition-all duration-300 ${isScrolled ? 'hidden md:block' : 'block'}`}>
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl leading-5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-body"
              />
              {!searchQuery && (
                <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={searchPlaceholder}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-neutral-400 text-body-sm"
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
        
        <section className="relative rounded-2xl overflow-hidden shadow-lg h-[200px] md:h-[350px] lg:h-[400px]">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
              <div className="relative h-full flex flex-col justify-center px-6 md:px-12 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h1 className={`text-2xl md:text-4xl lg:text-5xl font-display font-extrabold mb-3 leading-tight ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-900' : 'text-white'}`}>
                    {HERO_SLIDES[currentSlide].title}
                  </h1>
                  <p className={`text-sm md:text-lg mb-6 max-w-lg font-medium ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-700' : 'text-white/90'}`}>
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate(HERO_SLIDES[currentSlide].primaryLink)}
                      className="bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                      {HERO_SLIDES[currentSlide].primaryCTA}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(HERO_SLIDES[currentSlide].secondaryLink)}
                      className={HERO_SLIDES[currentSlide].darkText ? 'bg-white/50 hover:bg-white' : 'bg-white/20 hover:bg-white/30'}
                    >
                      {HERO_SLIDES[currentSlide].secondaryCTA}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {HERO_SLIDES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-400/50'}`}
              />
            ))}
          </div>
        </section>

        <FadeInWhenVisible>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading font-display font-bold text-neutral-800">Shop by Category</h2>
              <button onClick={() => navigate(ROUTES.SHOP)} className="text-orange-500 font-semibold text-body-sm hover:underline flex items-center">
                See All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {CATEGORIES.slice(0, 11).map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`${ROUTES.CATEGORY}/${category.id}`)}
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div 
                    className="w-full aspect-square rounded-2xl mb-2 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Package className="w-8 h-8 md:w-12 md:h-12" style={{ color: category.color }} />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-center text-neutral-700 leading-tight px-1">
                    {category.name}
                  </span>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ y: -5 }}
                onClick={() => navigate(ROUTES.SHOP)}
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-full aspect-square rounded-2xl mb-2 flex items-center justify-center bg-orange-50 border-2 border-dashed border-orange-200">
                  <ArrowRight className="w-8 h-8 text-orange-500" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-center text-orange-600">See All</span>
              </motion.div>
            </div>
          </section>
        </FadeInWhenVisible>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ShimmerProductCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {featuredProducts.length > 0 && (
              <ProductRail 
                title="⭐ Featured Products" 
                products={featuredProducts} 
                onAdd={handleAddToCart}
                onViewAll={() => navigate(ROUTES.SHOP)}
              />
            )}

            {bestsellerProducts.length > 0 && (
              <ProductRail 
                title="🔥 Bestsellers" 
                products={bestsellerProducts} 
                onAdd={handleAddToCart}
                onViewAll={() => navigate(ROUTES.SHOP)}
              />
            )}

            {newProducts.length > 0 && (
              <ProductRail 
                title="✨ New Arrivals" 
                products={newProducts} 
                onAdd={handleAddToCart}
                onViewAll={() => navigate(ROUTES.SHOP)}
              />
            )}
          </>
        )}

        <FadeInWhenVisible>
          <div className="relative overflow-hidden bg-neutral-900 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-64 h-64" />
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-display font-display font-bold mb-4">Why Choose Zalldi?</h2>
                <p className="text-neutral-300 text-body-lg mb-8">We deliver quality, speed, and trust straight to your doorstep in Butwal.</p>
                <Button onClick={() => navigate(ROUTES.ABOUT)} className="bg-orange-500 hover:bg-orange-600">
                  Read Our Story
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TrustItem icon={<Clock className="w-6 h-6 text-orange-400" />} title="1 Hour Delivery" desc="Fastest in Butwal" />
                <TrustItem icon={<ShieldCheck className="w-6 h-6 text-orange-400" />} title="Quality Assured" desc="Fresh products" />
                <TrustItem icon={<DollarSign className="w-6 h-6 text-orange-400" />} title="Best Prices" desc="Competitive rates" />
                <TrustItem icon={<RotateCcw className="w-6 h-6 text-orange-400" />} title="Easy Returns" desc="Hassle-free" />
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>

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
                className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 p-4 shadow-xl md:hidden"
          >
            <button 
              onClick={() => navigate(ROUTES.CART)}
              className="w-full bg-green-600 text-white rounded-xl p-3 flex items-center justify-between shadow-lg active:scale-[0.99] transition-transform"
            >
              <div className="flex flex-col items-start">
                <span className="text-caption uppercase opacity-90 font-bold">{cartCount} Items</span>
                <span className="text-title font-bold">{formatCurrency(cartTotal)}</span>
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

function ProductRail({ title, products, onAdd, onViewAll }) {
  return (
    <FadeInWhenVisible>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading font-display font-bold text-neutral-800">{title}</h2>
          <button onClick={onViewAll} className="text-orange-500 font-semibold text-body-sm hover:underline flex items-center">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </section>
    </FadeInWhenVisible>
  )
}

function ProductCard({ product, onAdd }) {
  const navigate = useNavigate()
  const discountedPrice = product.discountPrice || product.price
  const hasDiscount = product.discountPrice && product.discountPrice < product.price

  return (
    <div 
      onClick={() => navigate(`/product/${product.slug || product.id}`)}
      className="bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-card-hover transition-all duration-300 min-w-[160px] md:min-w-[200px] flex flex-col snap-start cursor-pointer group"
    >
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-caption font-bold px-2 py-0.5 rounded-lg shadow-sm">
          {Math.round(((product.price - discountedPrice) / product.price) * 100)}% OFF
        </div>
      )}

      <div className="relative p-4 h-40 flex items-center justify-center">
        <img 
          src={product.images?.[0] || '/placeholder.png'} 
          alt={product.name} 
          className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute bottom-2 left-2 bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 rounded text-caption font-bold text-white">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="p-3 pt-0 flex flex-col flex-grow">
        <p className="text-caption text-neutral-500 font-medium mb-1">{product.unit || 'pc'}</p>
        <h3 className="text-body-sm font-semibold text-neutral-800 leading-snug line-clamp-2 mb-3 h-10">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-caption text-neutral-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-body-sm font-bold text-neutral-900">{formatCurrency(discountedPrice)}</span>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => onAdd(product, e)}
            className="border-green-600 text-green-700 hover:bg-green-50 px-4 py-1 h-auto text-caption uppercase font-bold rounded-lg"
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
    <div className="bg-neutral-800/50 rounded-xl p-4 flex flex-col items-center text-center backdrop-blur-sm hover:bg-neutral-800 transition-colors">
      <div className="mb-2 bg-neutral-700 p-2 rounded-full">
        {icon}
      </div>
      <h3 className="font-bold text-body-sm mb-1">{title}</h3>
      <p className="text-caption text-neutral-400 leading-tight">{desc}</p>
    </div>
  )
}