// /src/pages/Shop.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  X, 
  Zap, 
  Sparkles, 
  Filter, 
  Trash2, 
  ChevronDown,
  LayoutGrid,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/customer/ProductGrid';
import FilterSidebar from '@/components/customer/FilterSidebar';
import SortDropdown from '@/components/customer/SortDropdown';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // State Initialization
  const [filters, setFilters] = useState({
    categories: searchParams.getAll('category') || [],
    minPrice: searchParams.get('minPrice') || null,
    maxPrice: searchParams.get('maxPrice') || null,
    minRating: searchParams.get('rating') || null,
    inStock: searchParams.get('stock') !== 'false',
    hasDiscount: searchParams.get('deals') === 'true'
  });
  
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const { products, loading } = useProducts({ active: true });

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.categories.length > 0) filters.categories.forEach(c => params.append('category', c));
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minRating) params.set('rating', filters.minRating);
    if (!filters.inStock) params.set('stock', 'false');
    if (filters.hasDiscount) params.set('deals', 'true');
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [filters, sortBy, setSearchParams]);

  // Logic: Filtering & Sorting
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
      const currentPrice = product.discountPrice || product.price;
      if (filters.minPrice && currentPrice < filters.minPrice) return false;
      if (filters.maxPrice && currentPrice > filters.maxPrice) return false;
      if (filters.minRating && (product.rating || 0) < filters.minRating) return false;
      if (filters.inStock && product.stock === 0) return false;
      if (filters.hasDiscount && !product.discountPrice) return false;
      return true;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      switch (sortBy) {
        case 'price-low': return priceA - priceB;
        case 'price-high': return priceB - priceA;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        default: return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = filters.categories.length;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.hasDiscount) count++
    return count;
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      categories: [], minPrice: null, maxPrice: null,
      minRating: null, inStock: true, hasDiscount: false
    });
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* HERO SECTION: Clean & Focused */}
      <section className="pt-32 pb-12 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }]} className="mb-8" />
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3"
              >
                <Sparkles size={14} className="fill-current" />
                The Butwal Collection
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter leading-none italic uppercase mb-4">
                The <span className="text-orange-500">Market</span>
              </h1>
              <p className="text-neutral-500 font-medium text-lg italic">
                {sortedProducts.length} premium items curated for instant 60-min delivery.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-neutral-100">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden !rounded-full"
                  leftIcon={<SlidersHorizontal size={14} />}
                >
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
                <div className="hidden lg:flex items-center px-4 gap-2 text-neutral-400">
                    <LayoutGrid size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sort By</span>
                </div>
                <SortDropdown value={sortBy} onChange={setSortBy} className="!border-0 !bg-transparent !shadow-none" />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN EXPLORATION AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                  <Filter size={16} className="text-orange-500" />
                  Control Panel
                </h3>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={handleClearFilters}
                    className="text-[10px] font-black text-rose-500 hover:scale-105 transition-transform uppercase tracking-widest flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Reset
                  </button>
                )}
              </div>
              
              <div className="bg-neutral-50/50 rounded-[2.5rem] p-8 border border-neutral-100">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onClear={handleClearFilters}
                />
              </div>

              {/* LIVE SLOGAN WIDGET */}
              <div className="bg-orange-500 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                  <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Zall-Dash Promise</p>
                  <p className="text-sm font-black italic leading-tight">Delivered before your tea even cools down.</p>
              </div>
            </div>
          </aside>

          {/* PRODUCT LISTING */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {sortedProducts.length === 0 && !loading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-32 flex flex-col items-center"
                >
                  <EmptyState
                    icon={<ShoppingBag className="w-20 h-20 text-neutral-100 mb-6" />}
                    title="No Match Found"
                    description="The items you're looking for have outrun our filters. Try a broader search."
                    action={{ label: "Show All Products", onClick: handleClearFilters }}
                  />
                </motion.div>
              ) : (
                <motion.div layout className="space-y-12">
                  <ProductGrid 
                    products={sortedProducts} 
                    loading={loading} 
                    columns={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* MOBILE DRAWER: Standardized & Clean */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[360px] bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-neutral-900 uppercase tracking-widest text-sm italic">Filters</h3>
                  <p className="text-[10px] font-bold text-orange-500 uppercase">{activeFilterCount} active selections</p>
                </div>
                <button onClick={() => setShowFilters(false)} className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <FilterSidebar filters={filters} onChange={setFilters} onClear={handleClearFilters} />
              </div>

              <div className="p-8 bg-neutral-50">
                <Button 
                    fullWidth 
                    variant="orange" 
                    size="lg"
                    onClick={() => setShowFilters(false)}
                >
                    Apply Changes
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

