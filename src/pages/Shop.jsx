import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  ShoppingBag, 
  Search, 
  ChevronRight,
  Filter,
  Check,
  Star,
  Info
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES } from '@/utils/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/customer/ProductCard';

export default function Shop() {
  const { products, loading } = useProducts({ active: true });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    inStock: true,
    hasDiscount: false
  });

  // Flatten categories for the sidebar
  const allCategories = useMemo(() => {
    return [{ id: 'all', name: 'All', icon: '🛒' }, ...CATEGORIES];
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.inStock) filtered = filtered.filter(p => p.stock > 0);
    if (filters.hasDiscount) filtered = filtered.filter(p => (p.comparePrice && p.comparePrice > p.price));

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'popular': return (b.soldCount || 0) - (a.soldCount || 0);
        default: return 0;
      }
    });
  }, [products, selectedCategory, filters, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* MOBILE SEARCH BAR - Sticky underneath header */}
      <div className="pt-20 lg:pt-24 sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-neutral-100">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search Butwal's freshest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-neutral-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl font-bold text-sm outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex h-[calc(100vh-136px)] lg:h-auto overflow-hidden">
        
        {/* LEFT NAV: Iconic Category Rail */}
        <aside className="w-20 lg:w-24 shrink-0 bg-neutral-900 flex flex-col items-center py-6 overflow-y-auto scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="relative w-full py-4 flex flex-col items-center gap-2 group transition-all"
            >
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 rotate-0' 
                  : 'bg-white/5 text-neutral-500 group-hover:bg-white/10 rotate-3'
              }`}>
                {cat.icon || '📦'}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter text-center px-1 ${
                selectedCategory === cat.id ? 'text-white' : 'text-neutral-500'
              }`}>
                {cat.name}
              </span>
              {selectedCategory === cat.id && (
                <motion.div 
                  layoutId="activeRail"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-l-full" 
                />
              )}
            </button>
          ))}
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 lg:bg-white rounded-tl-[2.5rem] lg:rounded-none shadow-inner lg:shadow-none p-4 lg:p-8">
          
          {/* TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 tracking-tighter italic uppercase">
                {selectedCategory === 'all' ? 'The Market' : allCategories.find(c => c.id === selectedCategory)?.name}
              </h1>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{filteredProducts.length} Results Found</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSortMenu(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-neutral-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-orange-500 transition-all"
              >
                <ArrowUpDown size={14} /> {sortBy}
              </button>
              <button 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
              >
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4.5] bg-neutral-100 rounded-[2rem] animate-pulse" />
                ))
              ) : (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6 text-neutral-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2">Nothing found</h3>
              <p className="text-neutral-500 text-sm max-w-xs">Try adjusting your filters or search for something else.</p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: SORTING */}
      <AnimatePresence>
        {showSortMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSortMenu(false)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 z-[101] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-black uppercase italic mb-6">Sort Collection</h3>
              <div className="space-y-3">
                {[
                  { id: 'relevance', label: 'Recommended' },
                  { id: 'popular', label: 'Most Popular' },
                  { id: 'price-low', label: 'Lowest Price' },
                  { id: 'price-high', label: 'Highest Price' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                    className={`w-full h-16 rounded-2xl flex items-center justify-between px-6 font-bold transition-all ${
                      sortBy === opt.id ? 'bg-orange-500 text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.id && <Check size={20} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

