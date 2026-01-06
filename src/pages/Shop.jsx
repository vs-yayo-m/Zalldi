// src/pages/Shop.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  ChevronDown, 
  Search, 
  X,
  LayoutGrid,
  Zap,
  Tag,
  Star
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES_DATA } from '@/data/categoriesData';
import ProductCard from '@/components/customer/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading } = useProducts({ active: true });
  
  // State Management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with URL if needed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
  }, [location]);

  const allCategories = useMemo(() => {
    const cats = [{ id: 'all', name: 'All', icon: '🛒', color: '#f97316' }];
    CATEGORIES_DATA.forEach(section => {
      section.subcategories.forEach(cat => {
        cats.push({ ...cat, sectionColor: section.color });
      });
    });
    return cats;
  }, []);

  const activeCategoryData = useMemo(() => 
    allCategories.find(c => c.id === selectedCategory), 
  [selectedCategory, allCategories]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = p.discountPrice || p.price;
        return price >= min && (max ? price <= max : true);
      });
    }

    return filtered.sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      switch (sortBy) {
        case 'price-low': return priceA - priceB;
        case 'price-high': return priceB - priceA;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'popular': return (b.soldCount || 0) - (a.soldCount || 0);
        default: return 0;
      }
    });
  }, [products, selectedCategory, priceFilter, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      {/* 1. TOP DYNAMIC NAV: Identity & Search */}
      <div className="pt-16 md:pt-20 bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <LayoutGrid size={20} />
               </div>
               <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tighter uppercase italic">
                {activeCategoryData?.name}
              </h1>
            </div>

            <div className="relative flex-1 max-w-xs md:max-w-md ml-4">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-neutral-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            </div>
          </div>

          {/* QUICK FILTERS BAR */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4">
            <button
              onClick={() => setShowSortMenu(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all"
            >
              <ArrowUpDown size={14} /> Sort: {sortBy}
            </button>

            <div className="h-6 w-px bg-neutral-100 mx-2" />

            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All Prices' },
                { id: '0-500', label: 'Under 500' },
                { id: '500-2000', label: '500 - 2k' },
                { id: '2000-10000', label: 'Premium' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPriceFilter(p.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${
                    priceFilter === p.id 
                    ? 'border-orange-500 bg-orange-50 text-orange-600' 
                    : 'border-transparent bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* 2. SIDEBAR CATEGORY TRACK */}
        <aside className="hidden md:block w-28 lg:w-32 bg-white border-r border-neutral-100 sticky top-40 self-start overflow-y-auto h-[calc(100vh-160px)] scrollbar-hide">
          <div className="py-6 space-y-1">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full group px-2 py-4 flex flex-col items-center gap-3 transition-all relative ${
                  selectedCategory === cat.id ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {selectedCategory === cat.id && (
                  <motion.div layoutId="sidebar-pill" className="absolute left-0 w-1.5 h-10 bg-orange-500 rounded-r-full" />
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-sm ${
                  selectedCategory === cat.id ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-neutral-50 group-hover:bg-neutral-100'
                }`}>
                  {cat.icon || '📦'}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* 3. MAIN PRODUCT GRID */}
        <main className="flex-1 px-4 md:px-8 py-8">
          {/* Editorial Banner */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-8 md:p-12 rounded-[3rem] overflow-hidden mb-10 text-white"
              style={{ backgroundColor: activeCategoryData?.sectionColor || '#171717' }}
            >
              <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} fill="white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Direct Marketplace</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">
                    Fresh {activeCategoryData?.name === 'All' ? 'Picks' : activeCategoryData?.name}
                  </h2>
                  <p className="mt-4 text-white/80 font-bold max-w-sm">Curated selection from Butwal's top verified suppliers.</p>
                </div>
                <div className="hidden lg:flex gap-4">
                  <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                    <p className="text-2xl font-black">{filteredProducts.length}</p>
                    <p className="text-[10px] uppercase font-bold opacity-60">Products Found</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* GRID */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4.5] bg-white rounded-[2rem] border border-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-black uppercase italic text-neutral-900">No matches found</h3>
              <p className="text-neutral-500 font-bold mt-2">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {setSelectedCategory('all'); setSearchQuery('');}}
                className="mt-8 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20"
              >
                Clear All
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* SORT DRAWER (Mobile) */}
      <AnimatePresence>
        {showSortMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100]"
              onClick={() => setShowSortMenu(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[101] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-8" />
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Sort Options</h3>
                <button onClick={() => setShowSortMenu(false)} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'relevance', label: 'Default Sorting', icon: Zap },
                  { value: 'popular', label: 'Most Popular', icon: Star },
                  { value: 'price-low', label: 'Cheapest First', icon: Tag },
                  { value: 'price-high', label: 'Premium First', icon: ArrowUpDown }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => { setSortBy(option.value); setShowSortMenu(false); }}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] font-bold transition-all ${
                      sortBy === option.value
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <option.icon size={18} />
                      <span className="uppercase tracking-widest text-[11px] font-black">{option.label}</span>
                    </div>
                    {sortBy === option.value && <CheckCircle size={18} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

