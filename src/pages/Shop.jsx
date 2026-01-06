// src/pages/Shop.jsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES_DATA } from '@/data/categoriesData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FilterSidebar from '@/components/customer/FilterSidebar';
import ProductCard from '@/components/customer/ProductCard';

export default function Shop() {
  const { products, loading } = useProducts({ active: true });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    inStock: true,
    hasDiscount: false
  });

  const allCategories = useMemo(() => {
    const cats = [{ id: 'all', name: 'All', image: null }];
    CATEGORIES_DATA.forEach(section => {
      section.subcategories.forEach(cat => cats.push(cat));
    });
    return cats;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => (p.discountPrice || p.price) >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => (p.discountPrice || p.price) <= filters.maxPrice);
    }

    if (filters.minRating) {
      filtered = filtered.filter(p => (p.rating || 0) >= filters.minRating);
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    if (filters.hasDiscount) {
      filtered = filtered.filter(p => p.discountPrice);
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
  }, [products, selectedCategory, filters, sortBy]);

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: true,
      hasDiscount: false
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = filters.categories.length;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.hasDiscount) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="pt-20 md:pt-24">
        <div className="bg-white border-b border-neutral-100 sticky top-16 md:top-20 z-40 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-black text-neutral-900">
              {selectedCategory === 'all' ? 'All Products' : allCategories.find(c => c.id === selectedCategory)?.name || 'Shop'}
            </h1>
            <p className="text-sm text-neutral-500 font-medium">{filteredProducts.length} items</p>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 whitespace-nowrap hover:border-orange-500 transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            <button
              onClick={() => setShowSortMenu(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 whitespace-nowrap hover:border-orange-500 transition-colors flex-shrink-0"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>

            <button className="px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 whitespace-nowrap hover:border-orange-500 transition-colors flex-shrink-0">
              Price
            </button>
          </div>
        </div>

        <div className="flex">
          <aside className="w-20 flex-shrink-0 bg-neutral-900 sticky top-36 h-[calc(100vh-144px)] overflow-y-auto scrollbar-hide">
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full px-2 py-4 flex flex-col items-center gap-2 transition-all ${
                  selectedCategory === category.id
                    ? 'bg-orange-500'
                    : 'hover:bg-neutral-800'
                }`}
              >
                {category.image ? (
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                    selectedCategory === category.id ? 'border-white' : 'border-transparent'
                  }`}>
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-black">
                    🛒
                  </div>
                )}
                <span className={`text-[9px] font-bold text-center leading-tight line-clamp-2 ${
                  selectedCategory === category.id ? 'text-white' : 'text-neutral-400'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </aside>

          <main className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
              <h2 className="text-lg font-black mb-1">Healthy, juicy & seasonal</h2>
              <p className="text-xs opacity-90">Picked fresh from India's orchards</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                    <div className="aspect-square bg-neutral-200 rounded-lg mb-2" />
                    <div className="h-3 bg-neutral-200 rounded mb-1" />
                    <div className="h-2 bg-neutral-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-500 font-medium">No products found</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-black">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar filters={filters} onChange={setFilters} onClear={handleClearFilters} />
              </div>
              <div className="p-4 border-t">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-black"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}

        {showSortMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSortMenu(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6"
            >
              <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-black mb-4">Sort By</h3>
              {[
                { value: 'relevance', label: 'Relevance' },
                { value: 'popular', label: 'Popularity' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Rating' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold mb-2 transition-colors ${
                    sortBy === option.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}