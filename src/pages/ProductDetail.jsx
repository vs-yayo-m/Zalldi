// src/pages/ProductDetail.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowLeft, Share2, Heart, Star, Clock, Zap, ShieldCheck, 
  ChevronRight, Minus, Plus, ShoppingBag, Info, ChevronDown
} from 'lucide-react';
import { useProductBySlug } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import Header from '@/components/layout/Header';
import LoadingScreen from '@/components/shared/LoadingScreen';
import productService from '@/services/product.service';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProductBySlug(slug);
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [activeImage, setActiveImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [boughtTogether, setBoughtTogether] = useState([]);
  
  const scrollRef = useRef(null);
  const cartQuantity = product ? getItemQuantity(product.id) : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) loadRecommendations();
  }, [slug, product]);

  const loadRecommendations = async () => {
    try {
      const [related, recommended, together] = await Promise.all([
        productService.getRelated(product.id, product.category, 8),
        productService.getTrending(8),
        productService.getBoughtTogether(product.id, 4)
      ]);
      setRelatedProducts(related || []);
      setRecommendedProducts(recommended || []);
      setBoughtTogether(together || []);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Get ${product.name} delivered in minutes via Zalldi!`,
      url: window.location.href
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      document.execCommand('copy'); // Fallback logic as per instructions
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <LoadingScreen />;
  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [product.image || '/placeholder.png'];
  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* MOBILE TOP NAVIGATION (TRANSLUCENT) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100 px-4 py-3 flex items-center justify-between lg:hidden">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-800" />
        </button>
        <div className="flex items-center gap-1">
          <button onClick={handleShare} className="p-2 rounded-full active:bg-neutral-100">
            <Share2 className="w-5 h-5 text-neutral-800" />
          </button>
          <button onClick={() => toggleWishlist(product)} className="p-2 rounded-full active:bg-neutral-100">
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-800'}`} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-12">
          
          {/* IMAGE CAROUSEL SECTION */}
          <div className="relative pt-14 lg:pt-0">
            <div className="sticky top-24">
              <div className="relative aspect-square overflow-hidden bg-neutral-50 group">
                <motion.div 
                  className="flex h-full"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -50 && activeImage < images.length - 1) setActiveImage(prev => prev + 1);
                    if (info.offset.x > 50 && activeImage > 0) setActiveImage(prev => prev - 1);
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={images[activeImage]}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full h-full object-contain p-6 mix-blend-multiply"
                    />
                  </AnimatePresence>
                </motion.div>

                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-300 ${activeImage === i ? 'w-6 bg-orange-500' : 'w-1.5 bg-neutral-300'}`} 
                    />
                  ))}
                </div>

                {discountPercent > 0 && (
                  <div className="absolute top-6 left-6 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-xl">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Desktop Thumbnails */}
              <div className="hidden lg:flex gap-3 p-6 justify-center">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl border-2 transition-all p-1 bg-white ${activeImage === i ? 'border-orange-500 scale-110 shadow-lg' : 'border-neutral-100 opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT INFO SECTION */}
          <div className="px-5 py-6 lg:py-12">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-tight">8 Mins</span>
              </div>
              <div className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-tight">Quality Assured</span>
              </div>
            </div>

            <h1 className="text-xl lg:text-3xl font-black text-neutral-900 leading-tight mb-1">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-neutral-400 mb-6 uppercase tracking-tighter italic">
              {product.unit || 'per unit'}
            </p>

            <div className="flex items-end gap-3 mb-8">
              <div className="flex flex-col">
                <span className="text-2xl lg:text-4xl font-black text-neutral-900">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-neutral-400 line-through font-bold -mt-1">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <div className="mb-1 bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
                  Save {formatCurrency(product.comparePrice - product.price)}
                </div>
              )}
            </div>

            {/* PRODUCT DETAILS ACCORDION (BLINKIT STYLE) */}
            <div className="border-y border-neutral-100 py-2 mb-8">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full py-3 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                    <Info size={18} />
                  </div>
                  <span className="text-sm font-black text-neutral-800 uppercase tracking-tight">View Product Details</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${showDetails ? 'rotate-180 text-orange-500' : ''}`} />
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 space-y-6 pt-2">
                      <div className="bg-neutral-50 p-4 rounded-2xl">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Description</h4>
                        <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                          {product.description || "Freshly sourced high-quality product, hand-picked and delivered with care to ensure peak freshness."}
                        </p>
                      </div>

                      {product.features && (
                        <div>
                          <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Highlights</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {product.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 bg-white border border-neutral-100 p-3 rounded-xl shadow-sm">
                                <Zap className="w-3 h-3 text-orange-500" />
                                <span className="text-[11px] font-bold text-neutral-600">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* TRUST MARKERS */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Superfast Delivery', desc: '8-15 mins', icon: <Zap className="text-orange-500" /> },
                { label: 'Best Prices', desc: 'Lower than Mart', icon: <Star className="text-yellow-500" /> },
                { label: 'Wide Range', desc: '5000+ Items', icon: <ShoppingBag className="text-blue-500" /> }
              ].map((item, i) => (
                <div key={i} className="text-center flex flex-col items-center">
                  <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center mb-2">
                    {React.cloneElement(item.icon, { size: 16 })}
                  </div>
                  <p className="text-[9px] font-black uppercase text-neutral-800">{item.label}</p>
                  <p className="text-[8px] font-bold text-neutral-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ENDLESS RECOMMENDATIONS SECTIONS */}
        <div className="space-y-12 mt-12 px-5 lg:px-0">
          {boughtTogether.length > 0 && (
            <RecommendationSection title="People also bought" products={boughtTogether} />
          )}
          
          <RecommendationSection 
            title="Top products in this category" 
            products={relatedProducts} 
            subtitle="Explore more freshness"
          />

          <RecommendationSection 
            title="Recommended for you" 
            products={recommendedProducts} 
            subtitle="Based on your preferences"
          />
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR (MOBILE FIRST) */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 bg-white/90 backdrop-blur-xl border-t border-neutral-100 lg:hidden shadow-2xl">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex flex-col flex-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Total Price</span>
            <span className="text-lg font-black text-neutral-900">{formatCurrency(product.price * (cartQuantity || 1))}</span>
          </div>
          
          <AnimatePresence mode="wait">
            {cartQuantity === 0 ? (
              <motion.button
                key="add-to-cart"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => addItem(product)}
                className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white font-black text-sm uppercase h-14 rounded-2xl shadow-xl shadow-orange-200 active:scale-95 transition-all"
              >
                Add to Cart
              </motion.button>
            ) : (
              <motion.div 
                key="stepper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-[2] bg-neutral-900 h-14 rounded-2xl flex items-center justify-between px-2 overflow-hidden shadow-xl"
              >
                <button 
                  onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                  className="w-12 h-full flex items-center justify-center text-white active:bg-white/10"
                >
                  <Minus size={20} strokeWidth={3} />
                </button>
                <span className="text-white font-black text-lg">{cartQuantity}</span>
                <button 
                  onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                  className="w-12 h-full flex items-center justify-center text-white active:bg-white/10"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RecommendationSection({ title, subtitle, products }) {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-lg font-black text-neutral-900 tracking-tight leading-none mb-1 uppercase italic">{title}</h2>
          {subtitle && <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{subtitle}</p>}
        </div>
        <button onClick={() => navigate('/shop')} className="text-xs font-black text-orange-600 uppercase tracking-tighter">See All</button>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
        {products.map((p) => (
          <CompactProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function CompactProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  return (
    <div className="flex-shrink-0 w-32 snap-start">
      <div 
        onClick={() => navigate(`/product/${product.slug}`)}
        className="aspect-square bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden mb-2 relative"
      >
        <img src={product.image || product.images?.[0]} className="w-full h-full object-contain p-2 mix-blend-multiply" alt="" />
        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded shadow-sm flex items-center gap-0.5">
           <Clock size={8} className="text-orange-500" />
           <span className="text-[7px] font-black uppercase text-neutral-800">8m</span>
        </div>
      </div>
      <h3 className="text-[11px] font-bold text-neutral-800 line-clamp-2 leading-tight mb-2 h-7">{product.name}</h3>
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-black text-neutral-900">{formatCurrency(product.price)}</span>
        
        {quantity === 0 ? (
          <button 
            onClick={(e) => { e.stopPropagation(); addItem(product); }}
            className="px-3 py-1 bg-white border border-orange-500 text-orange-600 text-[10px] font-black rounded-lg shadow-sm active:bg-orange-50 transition-colors"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center bg-orange-500 rounded-lg overflow-hidden text-white shadow-sm h-6">
            <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantity - 1); }} className="w-5 flex items-center justify-center"><Minus size={10} strokeWidth={4} /></button>
            <span className="text-[10px] font-black w-4 text-center">{quantity}</span>
            <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantity + 1); }} className="w-5 flex items-center justify-center"><Plus size={10} strokeWidth={4} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

