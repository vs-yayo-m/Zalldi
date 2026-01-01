import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Clock, Heart, ShoppingCart, User, Search,
  TrendingUp, Sparkles, Package, Zap,
  ChevronRight, Timer, ShieldCheck, ArrowRight, MessageCircle, X
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { ROUTES, CATEGORIES } from '@/utils/constants'
import { FadeInWhenVisible } from '@/components/animations/FadeIn'
import toast from 'react-hot-toast'

// --- CONSTANTS & MOCK DATA ---

const HERO_SLIDES = [
  {
    id: 1,
    title: "Butwal's First Quick Commerce",
    subtitle: "Everything you need, delivered in 60 minutes.",
    background: "linear-gradient(135deg, #FFF1EC 0%, #FFD6C9 100%)",
    accent: "#ff6b35",
    darkText: true
  },
  {
    id: 2,
    title: "Late Night Cravings?",
    subtitle: "Ordered now. At your door before you sleep 😴",
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    accent: "#818cf8",
    darkText: false
  }
]

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Fresh Milk Full Cream", price: 85, weight: "500 ml", image: "https://cdn.grofers.com/app/images/products/full_screen/pro_404535.jpg", badge: "Bestseller", discount: 10, time: "12 mins" },
  { id: 2, name: "Farm Fresh Brown Eggs", price: 280, weight: "12 pcs", image: "https://cdn.grofers.com/app/images/products/full_screen/pro_103.jpg", badge: "Popular", discount: 0, time: "15 mins" },
  { id: 3, name: "Hybrid Red Tomatoes", price: 60, weight: "1 kg", image: "https://cdn.grofers.com/app/images/products/full_screen/pro_391461.jpg", badge: "Fresh", discount: 15, time: "10 mins" },
  { id: 4, name: "Classic White Bread", price: 65, weight: "400 g", image: "https://cdn.grofers.com/app/images/products/full_screen/pro_104.jpg", badge: "Hot", discount: 0, time: "8 mins" },
  { id: 5, name: "Premium Basmati Rice", price: 180, weight: "1 kg", image: "https://cdn.grofers.com/app/images/products/full_screen/pro_161.jpg", badge: "Top Rated", discount: 5, time: "25 mins" }
]

const SEARCH_PLACEHOLDERS = ["'Milk'", "'Kurkure'", "'Chocolate'", "'Paneer'", "'Coke'"]

export default function Home() {
  const navigate = useNavigate()
  const { addToCart, cartCount, cartTotal } = useCart()
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    const slideInt = setInterval(() => setCurrentSlide(p => (p + 1) % HERO_SLIDES.length), 5000)
    const searchInt = setInterval(() => setPlaceholderIdx(p => (p + 1) % SEARCH_PLACEHOLDERS.length), 3000)
    const waTimer = setTimeout(() => setShowWhatsApp(true), 4000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(slideInt)
      clearInterval(searchInt)
      clearTimeout(waTimer)
    }
  }, [])

  const handleAddToCart = (product, e) => {
    if(e) e.stopPropagation();
    addToCart(product)
    toast.success(`${product.name} added!`, {
      position: 'bottom-center',
      style: { borderRadius: '12px', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-24 md:pb-10 font-sans">
      <Header />

      {/* --- STICKY NAV (BLINKIT STYLE) --- */}
      <div className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Location */}
            <div className="hidden md:flex flex-col min-w-[180px]">
              <div className="flex items-center gap-1">
                <span className="font-black text-xs uppercase tracking-tighter">Delivery in 12 mins</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="font-bold text-sm truncate">Home - Butwal, Ward 9</span>
                <ChevronRight className="w-3 h-3 text-orange-500" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-orange-500" />
              <input 
                type="text" 
                placeholder={`Search for ${SEARCH_PLACEHOLDERS[placeholderIdx]}`}
                className="w-full bg-neutral-50 border border-neutral-100 h-12 rounded-xl pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Auth/Cart (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <button className="font-bold text-sm hover:text-orange-500 transition-colors">Login</button>
              <button 
                onClick={() => navigate(ROUTES.CART)}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-green-900/10 transition-all"
              >
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black uppercase opacity-80">{cartCount} items</span>
                  <span className="text-sm font-bold">Rs {cartTotal || 0}</span>
                </div>
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-12">
        
        {/* --- HERO --- */}
        <section className="relative rounded-[2.5rem] overflow-hidden h-[180px] md:h-[300px] shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-center px-8 md:px-16"
              style={{ background: HERO_SLIDES[currentSlide].background }}
            >
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
                <h1 className={`text-2xl md:text-5xl font-black tracking-tighter mb-2 ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-900' : 'text-white'}`}>
                  {HERO_SLIDES[currentSlide].title}
                </h1>
                <p className={`text-sm md:text-xl font-bold opacity-80 mb-6 ${HERO_SLIDES[currentSlide].darkText ? 'text-neutral-700' : 'text-white'}`}>
                  {HERO_SLIDES[currentSlide].subtitle}
                </p>
                <Button className="bg-neutral-900 text-white rounded-xl px-8 font-black text-xs uppercase tracking-widest border-none">
                  Shop Now
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* --- CATEGORY GRID --- */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Browse Categories
            </h2>
            <button className="text-xs font-bold text-orange-500">See All</button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3 md:gap-4">
            {CATEGORIES.slice(0, 10).map((cat) => (
              <motion.div 
                key={cat.id} 
                whileHover={{ y: -4 }}
                onClick={() => navigate(`${ROUTES.CATEGORY}/${cat.id}`)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-full aspect-square rounded-[1.5rem] bg-white border border-neutral-100 shadow-sm flex items-center justify-center p-4 group-hover:border-orange-200 group-hover:shadow-md transition-all">
                  <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                    {cat.icon === 'Milk' ? '🥛' : cat.icon === 'Carrot' ? '🥕' : '📦'}
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-black text-neutral-700 mt-2 text-center leading-tight uppercase tracking-tight">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- PRODUCT RAIL --- */}
        <section className="bg-white rounded-[2rem] p-6 border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">Bestsellers</h2>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Most ordered in Butwal today</p>
            </div>
            <button className="text-orange-600 font-black text-xs uppercase tracking-widest">View All</button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
            {SAMPLE_PRODUCTS.map((prod) => (
              <div key={prod.id} className="min-w-[160px] md:min-w-[200px] bg-neutral-50 rounded-2xl p-4 flex flex-col snap-start group border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                <div className="relative aspect-square mb-4">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                  <div className="absolute top-0 left-0 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-lg">{prod.discount}% OFF</div>
                  <div className="absolute bottom-0 right-0 bg-white/80 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 border border-neutral-100 shadow-sm">
                    <Timer className="w-3 h-3 text-orange-500" /> {prod.time}
                  </div>
                </div>
                <h3 className="text-xs font-bold text-neutral-800 line-clamp-2 h-8 mb-2 leading-tight uppercase tracking-tight">{prod.name}</h3>
                <p className="text-[10px] font-bold text-neutral-400 mb-3">{prod.weight}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-black text-neutral-900 tracking-tighter">Rs {prod.price}</span>
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(prod, e)}
                    className="bg-white border border-green-600 text-green-700 text-[10px] font-black uppercase px-4 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- TRUST FOOTER --- */}
        <section className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <Timer />, title: "60 Mins Delivery", desc: "Speed is our priority" },
            { icon: <ShieldCheck />, title: "Safe & Secure", desc: "Trusted by 10k+ locals" },
            { icon: <Sparkles />, title: "Best Prices", desc: "Direct from the Mandi" }
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900 p-6 rounded-[2rem] text-white flex items-center gap-4 border border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                {item.icon}
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">{item.title}</h4>
                <p className="text-[10px] text-neutral-400 font-bold">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* --- FLOATING ELEMENTS --- */}
      {showWhatsApp && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-24 md:bottom-10 right-4 z-[100]">
          <button onClick={() => window.open('https://wa.me/9779821072912', '_blank')} className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-white">
            <MessageCircle className="w-7 h-7 text-white fill-current" />
          </button>
        </motion.div>
      )}

      {/* Mobile Cart Bar */}
      {cartCount > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-[110] p-4 md:hidden">
          <div className="bg-green-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-green-900/40">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase opacity-70">{cartCount} Items</span>
              <span className="text-lg font-black tracking-tighter">Rs {cartTotal}</span>
            </div>
            <button onClick={() => navigate(ROUTES.CART)} className="font-black text-xs uppercase tracking-widest flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              View Cart <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}

