// /src/components/layout/ProductDiscoverySection.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  Leaf, 
  Snowflake, 
  ArrowRight,
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ProductCard from '../customer/ProductCard';
import { productService } from '../../services/product.service';

const DISCOVERY_SECTIONS = [
  { 
    id: 'best-selling', 
    title: 'Bestsellers', 
    subtitle: 'Top picks in Butwal right now',
    icon: Flame,
    filter: 'bestSelling',
    gradient: 'from-orange-600 to-rose-500',
    badge: 'Trending'
  },
  { 
    id: 'fresh-today', 
    title: 'Fresh Arrivals', 
    subtitle: 'Harvested & delivered today',
    icon: Leaf,
    filter: 'fresh',
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'Organic'
  },
  { 
    id: 'cold-frozen', 
    title: 'Chilled Items', 
    subtitle: 'Stored at perfect -4°C',
    icon: Snowflake,
    filter: 'frozen',
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'Chilled'
  }
];

const ProductSection = ({ section }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const results = await productService.getProducts({ 
        limit: 10, 
        featured: section.filter === 'bestSelling' 
      });
      setProducts(results || []);
    } catch (error) {
      console.error(`[Discovery] Error:`, error);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => { loadData(); }, [loadData]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -amount : amount, 
        behavior: 'smooth' 
      });
      if (navigator.vibrate) navigator.vibrate(5);
    }
  };

  const Icon = section.icon;

  return (
    <div ref={sectionRef} className="relative mb-24 last:mb-0">
      {/* SECTION HEADER: Clean & Authoritative */}
      <div className="flex items-end justify-between mb-8 px-1">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg shadow-orange-500/10`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase italic">
                {section.title}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-500 text-[9px] font-black uppercase tracking-widest">
                {section.badge}
              </span>
            </div>
            <p className="text-neutral-400 font-bold text-sm tracking-tight flex items-center gap-2">
              {section.id === 'fresh-today' && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
              {section.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL */}
      <div className="relative -mx-4 px-4 lg:mx-0 lg:px-0">
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[280px] h-[400px] bg-neutral-50 rounded-[2rem] animate-pulse" />
            ))
          ) : (
            <>
              {products.map((product) => (
                <div key={product.id} className="shrink-0 w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
              
              {/* SEE ALL END-CAP */}
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => navigate('/shop')}
                className="shrink-0 w-[200px] aspect-[3/4.5] rounded-[2.5rem] bg-neutral-900 text-white flex flex-col items-center justify-center gap-4 group transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <ArrowUpRight size={24} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs">View Full Market</span>
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default function ProductDiscoverySection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* MAIN HERO HEADER */}
        <header className="mb-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
              >
                <Zap size={12} fill="currentColor" />
                Hyper-Local Discovery
              </motion.div>
              <h2 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter leading-[0.85] italic uppercase mb-8">
                Freshness <br /> 
                <span className="text-orange-500">Unleashed.</span>
              </h2>
              <p className="text-xl text-neutral-500 font-medium max-w-xl leading-relaxed">
                We've mapped every warehouse in Butwal to ensure your essentials reach you in under 60 minutes.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:pb-4">
              {[
                { label: 'Fast Delivery', sub: '15-60 Mins', icon: Clock },
                { label: 'Quality Check', sub: '100% Organic', icon: Sparkles }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-neutral-50 p-5 rounded-[2rem] border border-neutral-100">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-neutral-900 leading-none mb-1">{item.label}</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* SECTION GRID */}
        <div className="space-y-4">
          {DISCOVERY_SECTIONS.map((section) => (
            <ProductSection key={section.id} section={section} />
          ))}
        </div>

        {/* PERSUASIVE BOTTOM CTA */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="mt-32 p-12 md:p-20 rounded-[4rem] bg-neutral-900 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase mb-6">
              Missing Something?
            </h3>
            <p className="text-neutral-400 text-lg font-medium mb-12 max-w-2xl mx-auto">
              Our full catalog features over 5,000 items from local farmers and global brands.
            </p>
            <button 
              onClick={() => navigate('/shop')}
              className="group flex items-center gap-4 bg-orange-500 hover:bg-orange-400 text-white px-12 py-6 rounded-3xl mx-auto transition-all shadow-2xl shadow-orange-500/20"
            >
              <span className="text-sm font-black uppercase tracking-[0.2em]">Explore Full Market</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

