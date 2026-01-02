import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Clock, Heart, ShoppingCart, User, Search,
  TrendingUp, Sparkles, Package, Zap,
  ChevronRight, Timer, ShieldCheck, ArrowRight, MessageCircle, X,
  ShoppingBag
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { ROUTES, CATEGORIES } from '@/utils/constants'
import { FadeInWhenVisible } from '@/components/animations/FadeIn'
import toast from 'react-hot-toast'

// --- CONSTANTS & REAL ASSETS ---

const HERO_SLIDES = [
  {
    id: 1,
    title: "Butwal's Quickest Grocery Delivery",
    subtitle: "Freshness delivered to your doorstep in 60 minutes.",
    background: "linear-gradient(135deg, #FFF1EC 0%, #FFD6C9 100%)",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
    darkText: true
  },
  {
    id: 2,
    title: "Late Night Cravings?",
    subtitle: "Snacks, drinks, and essentials delivered until midnight.",
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    image: "https://images.unsplash.com/photo-1594910413528-9430d8bbec9d?auto=format&fit=crop&q=80&w=1000",
    darkText: false
  }
]

// Real Category Images (CDN paths)
const CATEGORY_DATA = [
  { id: 'vegetables', name: 'Vegetables', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735371138-2' },
  { id: 'fruits', name: 'Fresh Fruits', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-2' },
  { id: 'dairy', name: 'Dairy & Bread', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-12' },
  { id: 'snacks', name: 'Munchies', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1702463212874-5' },
  { id: 'drinks', name: 'Cold Drinks', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-7' },
  { id: 'meat', name: 'Meat & Fish', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-10' },
  { id: 'household', name: 'Cleaning', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-15' },
  { id: 'beauty', name: 'Personal Care', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-16' },
  { id: 'bakery', name: 'Bakery', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-13' },
  { id: 'baby', name: 'Baby Care', image: 'https://cdn.grofers.com/app/images/category/cms_images/rc-upload-1700735330292-17' }
]

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: "Amul Gold Full Cream Milk", price: 85, weight: "500 ml", image: "https://cdn.grofers.com/app/images/products/sliding_image/404535a.jpg", badge: "Bestseller", discount: 10, time: "12 mins", category: 'dairy' },
  { id: 'p2', name: "Farm Fresh Brown Eggs", price: 280, weight: "12 units", image: "https://cdn.grofers.com/app/images/products/sliding_image/103a.jpg", badge: "High Protein", discount: 5, time: "15 mins", category: 'meat' },
  { id: 'p3', name: "Hybrid Red Tomatoes", price: 60, weight: "1 kg", image: "https://cdn.grofers.com/app/images/products/sliding_image/391461a.jpg", badge: "Freshly Picked", discount: 15, time: "10 mins", category: 'vegetables' },
  { id: 'p4', name: "Britannia Classic Bread", price: 65, weight: "400 g", image: "https://cdn.grofers.com/app/images/products/sliding_image/104a.jpg", badge: "Fresh", discount: 0, time: "8 mins", category: 'dairy' },
  { id: 'p5', name: "Daawat Basmati Rice", price: 180, weight: "1 kg", image: "https://cdn.grofers.com/app/images/products/sliding_image/161a.jpg", badge: "Premium", discount: 8, time: "25 mins", category: 'staples' }
]

const SEARCH_SUGGESTIONS = ["'Milk'", "'Cheese'", "'Banana'", "'Chips'", "'Soap'"]

export default function Home() {
  const navigate = useNavigate()
  const { addToCart, cartCount, cartTotal } = useCart()
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    const slideInt = setInterval(() => setCurrentSlide(p => (p + 1) % HERO_SLIDES.length), 6000)
    const searchInt = setInterval(() => setPlaceholderIdx(p => (p + 1) % SEARCH_SUGGESTIONS.length), 3000)
    const waTimer = setTimeout(() => setShowWhatsApp(true), 5000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(slideInt)
      clearInterval(searchInt)
      clearTimeout(waTimer)
    }
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SHOP}?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleProductAction = (product, e) => {
    e.stopPropagation() // Prevent card click
    addToCart({
      ...product,
      quantity: 1
    })
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#333', color: '#fff', fontWeight: '800' }
    })
  }

  const navigateToProduct = (id) => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-32 md:pb-16 selection:bg-orange-100">
      <Header />

      {/* --- BLINKIT-STYLE STICKY NAVIGATION --- */}
      <div className={`sticky top-0 z-[100] bg-white transition-all duration-300 border-b border-neutral-100 ${isScrolled ? 'py-2 shadow-xl shadow-neutral-900/5' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 lg:gap-12">
          
          {/* Location Branding */}
          <div className="hidden lg:flex flex-col min-w-[220px] cursor-pointer group">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Delivery in 60 Mins
            </span>
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-black text-neutral-900 truncate">Butwal City, Ward 9</h2>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Functional Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for ${SEARCH_SUGGESTIONS[placeholderIdx]}`}
              className="w-full bg-neutral-50 border border-neutral-100 h-12 lg:h-14 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all placeholder:text-neutral-300"
            />
          </form>

          {/* Desktop Cart & Profile */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate(ROUTES.LOGIN)} className="font-black text-sm uppercase tracking-widest text-neutral-600 hover:text-orange-500 transition-colors">Login</button>
            <button 
              onClick={() => navigate(ROUTES.CART)}
              className="bg-green-700 hover:bg-green-800 text-white h-14 px-6 rounded-2xl flex items-center gap-4 shadow-lg shadow-green-900/10 transition-all active:scale-95"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[9px] font-black uppercase opacity-70 tracking-tighter">{cartCount} Items</span>
                <span className="text-sm font-black tracking-tighter">Rs {cartTotal || 0}</span>
              </div>
              <div className="h-6 w-[1px] bg-white/20" />
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-12">
        
        {/* --- DYNAMIC HERO SLIDER --- */}
        <section className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden h-[220px] md:h-[380px] group shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center"
              style={{ background: HERO_SLIDES[currentSlide].background }}
            >
              <div className="absolute right-0 top-0 h-full w-2/3 hidden md:block">
                <img src={HERO_SLIDES[currentSlide].image} alt="Hero" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
              </div>
              <div className="relative z-10 px-8 md:px-16 max-w-2xl">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Limited Offer</span>
                  </div>
                  <h1 className={`text-3xl md:text-6xl font-black leading-[0.9] tracking-tighter mb-4 ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-900' : 'text-white'}`}>
                    {HERO_SLIDES[currentSlide].title}
                  </h1>
                  <p className={`text-sm md:text-xl font-bold opacity-70 mb-8 max-w-md ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-700' : 'text-white/80'}`}>
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>
                  <Button 
                    onClick={() => navigate(ROUTES.SHOP)}
                    className="bg-neutral-900 text-white h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 border-none shadow-xl shadow-black/20"
                  >
                    Explore Now
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Slider Dots */}
          <div className="absolute bottom-6 left-8 md:left-16 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-10 bg-black/80' : 'w-2 bg-black/20'}`} />
            ))}
          </div>
        </section>

        {/* --- CATEGORY GRID WITH REAL IMAGES --- */}
        <section>
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-neutral-900 tracking-tighter">Shop by Category</h2>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Quality checked & daily fresh</p>
            </div>
            <button 
              onClick={() => navigate(ROUTES.SHOP)}
              className="h-10 px-6 rounded-full border border-neutral-200 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {CATEGORY_DATA.map((cat) => (
              <motion.div 
                key={cat.id} 
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`${ROUTES.SHOP}?category=${cat.id}`)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-full aspect-square rounded-[2rem] bg-white p-2 shadow-sm border border-neutral-100 group-hover:border-orange-500/20 group-hover:shadow-2xl group-hover:shadow-orange-500/10 transition-all overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <span className="text-[11px] font-black text-neutral-800 mt-4 text-center leading-tight uppercase tracking-tight group-hover:text-orange-600">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- DYNAMIC PRODUCT RAIL --- */}
        <section className="bg-white rounded-[3rem] p-8 border border-neutral-100 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
          
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tighter">Instant Bestsellers</h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Available for delivery in ward 9</p>
              </div>
            </div>
            <button onClick={() => navigate(ROUTES.SHOP)} className="text-orange-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              See All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x">
            {SAMPLE_PRODUCTS.map((prod) => (
              <div 
                key={prod.id} 
                onClick={() => navigateToProduct(prod.id)}
                className="min-w-[180px] md:min-w-[240px] bg-neutral-50 rounded-[2.5rem] p-6 flex flex-col snap-start group border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10 transition-all cursor-pointer"
              >
                <div className="relative aspect-square mb-6">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-0 left-0 bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-blue-600/20">{prod.discount}% OFF</div>
                  <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black flex items-center gap-2 border border-neutral-100 shadow-sm">
                    <Timer className="w-3.5 h-3.5 text-orange-500" /> {prod.time}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-black text-neutral-800 line-clamp-2 h-10 mb-2 leading-tight uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] font-bold text-neutral-400 mb-6 flex items-center gap-1">
                    <Package className="w-3 h-3" /> {prod.weight}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-300 line-through font-bold">Rs {Math.round(prod.price * 1.2)}</span>
                    <span className="text-lg font-black text-neutral-900 tracking-tighter">Rs {prod.price}</span>
                  </div>
                  <button 
                    onClick={(e) => handleProductAction(prod, e)}
                    className="bg-white border-2 border-green-600 text-green-700 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-lg active:scale-90"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* "More" Card */}
            <div 
              onClick={() => navigate(ROUTES.SHOP)}
              className="min-w-[180px] md:min-w-[240px] rounded-[2.5rem] border-4 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-4 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer text-neutral-400 hover:text-orange-500 group"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                <ArrowRight className="w-8 h-8" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest">Browse More</span>
            </div>
          </div>
        </section>

        {/* --- TRUST BANNER --- */}
        <section className="grid lg:grid-cols-3 gap-6">
          {[
            { icon: <Timer />, title: "60 Mins Delivery", desc: "Zalldi means fast. We live up to it.", color: "bg-orange-500" },
            { icon: <ShieldCheck />, title: "Quality Promise", desc: "Handpicked fresh from local stores.", color: "bg-blue-600" },
            { icon: <Zap />, title: "Best Value", desc: "Exclusive deals you won't find anywhere.", color: "bg-green-700" }
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900 p-8 rounded-[2.5rem] text-white flex flex-col gap-6 group hover:bg-black transition-colors">
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-2xl`}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-black text-lg uppercase tracking-widest mb-2">{item.title}</h4>
                <p className="text-xs text-neutral-400 font-bold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* --- FLOATING COMPONENTS --- */}
      
      {/* WhatsApp Button */}
      <AnimatePresence>
        {showWhatsApp && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-28 md:bottom-10 right-6 z-[120]">
            <button onClick={() => window.open('https://wa.me/9779821072912', '_blank')} className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-white group">
              <MessageCircle className="w-8 h-8 text-white fill-current" />
              <div className="absolute right-full mr-4 bg-white text-neutral-800 font-black text-[10px] uppercase tracking-widest py-2 px-4 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Need Help? Chat now
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Cart Island */}
      {cartCount > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-[130] p-6 md:hidden">
          <div className="bg-green-700 text-white rounded-[2rem] p-5 flex items-center justify-between shadow-2xl shadow-green-900/40 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-60">{cartCount} Items</span>
                <span className="text-xl font-black tracking-tighter">Rs {cartTotal}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(ROUTES.CART)} 
              className="bg-white text-green-700 font-black text-xs uppercase tracking-widest h-12 px-6 rounded-2xl active:scale-95 transition-transform"
            >
              Checkout
            </button>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}

function Plus({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )
}

