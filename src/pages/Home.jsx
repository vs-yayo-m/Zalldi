//src/pages/Home jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform,
  useSpring
} from 'framer-motion';
import { 
  MapPin, Clock, Heart, ShoppingBag, User, Gift, Search,
  TrendingUp, Sparkles, Zap, Star, ChevronRight, Plus, Minus,
  ArrowRight, Ticket, Flame, Timer, ShieldCheck, Leaf, 
  Bike, CreditCard, ChevronDown, X
} from 'lucide-react';

// Assuming these exist in your project structure, or standard fallbacks
import Header from '@components/layout/Header'; 
import Footer from '@components/layout/Footer';
import { useCart } from '@hooks/useCart';
import { ROUTES } from '@utils/constants';
import toast from 'react-hot-toast';

// --- MOCK DATA FOR PREVIEW (Replace with your actual constants) ---
const HERO_SLIDES = [
  {
    id: 1,
    title: "10-Minute Grocery Delivery",
    subtitle: "Freshness you can trust, speed you can't believe.",
    cta: "Shop Now",
    color: "from-emerald-600 to-teal-900",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
    accent: "#10b981"
  },
  {
    id: 2,
    title: "Late Night Cravings?",
    subtitle: "We deliver until 2 AM. Snacks, drinks & more.",
    cta: "Order Snacks",
    color: "from-indigo-600 to-purple-900",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=1000",
    accent: "#6366f1"
  },
  {
    id: 3,
    title: "Farm Fresh Veggies",
    subtitle: "Direct from local farmers to your doorstep.",
    cta: "Get Fresh",
    color: "from-green-500 to-emerald-800",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1000",
    accent: "#22c55e"
  }
];

const CATEGORIES = [
  { id: 'veg', name: 'Vegetables', icon: '🥕', color: 'bg-green-50' },
  { id: 'fruit', name: 'Fruits', icon: '🍎', color: 'bg-red-50' },
  { id: 'dairy', name: 'Dairy & Bread', icon: '🥛', color: 'bg-blue-50' },
  { id: 'snacks', name: 'Munchies', icon: '🍿', color: 'bg-yellow-50' },
  { id: 'drinks', name: 'Cold Drinks', icon: '🥤', color: 'bg-purple-50' },
  { id: 'bakery', name: 'Bakery', icon: '🥐', color: 'bg-orange-50' },
  { id: 'meat', name: 'Meat & Fish', icon: '🍗', color: 'bg-rose-50' },
  { id: 'personal', name: 'Care', icon: '🧴', color: 'bg-pink-50' },
];

const FLASH_DEALS = [
  { id: 101, name: "Amul Gold Milk", price: 64, originalPrice: 70, discount: 8, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=60&w=200", time: "12m" },
  { id: 102, name: "Farm Eggs (6pcs)", price: 45, originalPrice: 60, discount: 25, image: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&q=60&w=200", time: "08m" },
  { id: 103, name: "Fortune Oil 1L", price: 145, originalPrice: 180, discount: 19, image: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&q=60&w=200", time: "15m" },
  { id: 104, name: "Whole Wheat Atta", price: 320, originalPrice: 400, discount: 20, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=60&w=200", time: "22m" },
];

const CURATED_LISTS = [
  { title: "Breakfast Corner", items: 120, image: "https://images.unsplash.com/photo-1533089862017-5614a957425c?auto=format&fit=crop&q=80&w=400" },
  { title: "Snack Attack", items: 85, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=400" },
  { title: "Home Essentials", items: 200, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400" },
];

// --- UTILITY COMPONENTS ---

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-6 px-1">
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight font-display">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1 font-medium">{subtitle}</p>}
    </div>
    {action && (
      <button className="text-emerald-600 font-bold text-sm flex items-center hover:text-emerald-700 transition-colors">
        {action} <ChevronRight className="w-4 h-4 ml-0.5" />
      </button>
    )}
  </div>
);

const CountDownTimer = ({ initialMinutes = 15 }) => {
  return (
    <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">
      <Timer className="w-3 h-3" />
      <span>{initialMinutes}m left</span>
    </div>
  );
};

// --- ENTERPRISE SKELETON LOADER ---
const HomeSkeleton = () => (
  <div className="min-h-screen bg-gray-50 space-y-6 pb-20">
    <div className="h-16 bg-white border-b" />
    <div className="container mx-auto px-4 space-y-8 pt-4">
      <div className="h-48 md:h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 w-48 bg-gray-200 rounded-2xl flex-shrink-0 animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// --- MAIN HOME COMPONENT ---

export default function Home() {
  const navigate = useNavigate();
  // Safe destructuring with defaults in case hook isn't ready
  const { addToCart, cartItems = [], removeFromCart } = useCart() || {}; 
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [stickySearch, setStickySearch] = useState(false);
  const scrollRef = useRef(null);
  const { scrollY } = useScroll();

  // Simulate enterprise data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sticky Search Bar Effect
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setStickySearch(latest > 200);
    });
  }, [scrollY]);

  // Placeholder Typewriter Effect
  const PLACEHOLDERS = ["Search 'Milk'...", "Search 'Curd'...", "Search 'Chips'...", "Search 'Diapers'..."];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Cart Helper
  const getProductQty = (id) => cartItems?.find(i => i.id === id)?.quantity || 0;

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 pb-24 md:pb-10">
      
      {/* --- DELIVERY STATUS HEADER (STICKY) --- */}
      <motion.div 
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${stickySearch ? 'shadow-md pb-3' : 'border-b border-gray-100'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 cursor-pointer group">
                <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  12 Minutes
                </h3>
                <MapPin className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              </div>
              <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                Home - Butwal Ward 9, Rupandehi
                <ChevronDown className="w-3 h-3 inline ml-1" />
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors">
                <User className="w-6 h-6 text-gray-700" />
              </button>
              <button 
                onClick={() => navigate(ROUTES.CART)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItems?.length > 0 ? (
                   <span className="font-bold">₹{cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)}</span>
                ) : (
                  <span className="font-bold text-sm">My Cart</span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - Transforms based on scroll */}
          <div className={`transition-all duration-300 ease-in-out ${stickySearch ? 'block' : 'block pb-4'}`}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={PLACEHOLDERS[placeholderIndex]}
                className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl py-3 pl-12 pr-4 text-sm font-medium transition-all duration-300 outline-none placeholder-gray-400 shadow-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-gray-200 rounded-full hover:bg-gray-300">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 space-y-10 pt-6">
        
        {/* --- HERO SECTION --- */}
        <section className="relative h-[220px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 group">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className={`absolute inset-0 bg-gradient-to-r ${HERO_SLIDES[activeSlide].color} flex items-center`}
            >
              <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <img 
                src={HERO_SLIDES[activeSlide].image} 
                alt="Hero"
                className="absolute right-0 top-0 h-full w-3/5 object-cover mask-image-linear-gradient"
                style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}
              />
              
              <div className="relative z-10 p-8 md:p-16 max-w-xl">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-4 border border-white/10"
                >
                  #FastDelivery
                </motion.span>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg"
                >
                  {HERO_SLIDES[activeSlide].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/90 text-lg mb-8 font-medium max-w-sm"
                >
                  {HERO_SLIDES[activeSlide].subtitle}
                </motion.p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  {HERO_SLIDES[activeSlide].cta} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-8 flex space-x-2 z-20">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </section>

        {/* --- CATEGORY GRID --- */}
        <section>
          <SectionHeader title="Shop by Category" />
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-6">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className={`${cat.color} w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 border border-gray-100`}>
                  {cat.icon}
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- FLASH SALE RAIL (HORIZONTAL SCROLL) --- */}
        <section className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-6 border border-rose-100">
          <SectionHeader 
            title={
              <span className="flex items-center gap-2 text-rose-600">
                <Flame className="w-6 h-6 fill-rose-600" /> Flash Deals
              </span>
            } 
            subtitle="Lowest prices in 30 days"
            action="See all"
          />
          
          <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
            {FLASH_DEALS.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                cartQty={getProductQty(product.id)}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                type="flash"
              />
            ))}
          </div>
        </section>

        {/* --- CURATED COLLECTIONS (MASONRY-ISH) --- */}
        <section>
          <SectionHeader title="Curated For You" subtitle="Handpicked essentials for every mood" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CURATED_LISTS.map((list, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              >
                <img src={list.image} alt={list.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-white text-xl font-bold mb-1">{list.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-300 text-sm">{list.items} items</p>
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- BANK OFFERS / PROMO STRIP --- */}
        <section className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-indigo-600 rounded-2xl p-6 flex items-center justify-between text-white relative overflow-hidden shadow-xl shadow-indigo-200">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Pay with UPI</p>
              <h3 className="text-2xl font-bold mb-1">Get 20% Cashback</h3>
              <p className="text-sm opacity-90">Use code: ZALLDI20</p>
            </div>
            <CreditCard className="w-24 h-24 absolute -right-4 -bottom-4 opacity-20 rotate-12" />
            <div className="bg-white/10 px-4 py-2 rounded-lg font-mono text-sm font-bold border border-white/20 backdrop-blur-sm relative z-10">
              COPY
            </div>
          </div>
          
          <div className="flex-1 bg-emerald-600 rounded-2xl p-6 flex items-center justify-between text-white relative overflow-hidden shadow-xl shadow-emerald-200">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Free Delivery</p>
              <h3 className="text-2xl font-bold mb-1">On orders above ₹199</h3>
              <p className="text-sm opacity-90">First 3 orders only</p>
            </div>
            <Bike className="w-24 h-24 absolute -right-4 -bottom-4 opacity-20 rotate-12" />
          </div>
        </section>

        {/* --- TRUST BADGES --- */}
        <section className="py-8 border-t border-dashed border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TrustItem icon={<Zap className="text-amber-500" />} title="Superfast Delivery" sub="Within 15 mins" />
            <TrustItem icon={<ShieldCheck className="text-emerald-500" />} title="Safe & Hygienic" sub="Regular checks" />
            <TrustItem icon={<Star className="text-indigo-500" />} title="Best Prices" sub="Cheaper than market" />
            <TrustItem icon={<Leaf className="text-green-500" />} title="Fresh Guarantee" sub="Refund if not fresh" />
          </div>
        </section>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TrustItem({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
    </div>
  );
}

function ProductCard({ product, cartQty, addToCart, removeFromCart, type = 'standard' }) {
  const isFlash = type === 'flash';
  
  return (
    <motion.div 
      className={`relative bg-white rounded-2xl p-3 flex flex-col justify-between flex-shrink-0 group transition-all duration-300 ${
        isFlash ? 'w-[160px] md:w-[200px] border border-rose-100 shadow-md hover:shadow-lg' : 'w-full border border-gray-100'
      }`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {isFlash && (
        <div className="absolute top-3 right-3 z-10">
          <CountDownTimer initialMinutes={parseInt(product.time)} />
        </div>
      )}

      {/* Image Area */}
      <div className="relative h-32 mb-3 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain mix-blend-multiply p-2 group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
          <Clock className="w-3 h-3" /> {isFlash ? product.time : '12 mins'}
        </div>
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[40px] leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">500g</p> {/* Mock Unit */}
        
        <div className="flex items-end justify-between pt-2">
          <div>
             <span className="block text-gray-400 text-xs line-through">₹{product.originalPrice}</span>
             <span className="block text-gray-900 font-extrabold text-base">₹{product.price}</span>
          </div>

          {/* ADD BUTTON / COUNTER */}
          {cartQty > 0 ? (
            <div className="flex items-center bg-emerald-50 border border-emerald-600 rounded-lg h-9 overflow-hidden shadow-sm">
              <button 
                onClick={() => removeFromCart(product.id)}
                className="w-8 h-full flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-emerald-700">{cartQty}</span>
              <button 
                onClick={() => addToCart(product)}
                className="w-8 h-full flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addToCart && addToCart(product)}
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-95 uppercase tracking-wide"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

