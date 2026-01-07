// src/pages/Category.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { getCategoryById } from '@/data/categoriesStructure';
import { useProducts } from '@/hooks/useProducts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/customer/ProductCard';
import FilterSidebar from '@/components/customer/FilterSidebar';

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts({ category: categoryId, active: true });

  const [category, setCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    minRating: null,
    inStock: true,
    hasDiscount: false
  });

  const subcategoryRefs = useRef({});

  useEffect(() => {
    const categoryData = getCategoryById(categoryId);
    if (categoryData) {
      setCategory(categoryData);
    } else {
      navigate('/categories');
    }
  }, [categoryId, navigate]);

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    let filtered = [...products];

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
  }, [products, selectedSubcategory, searchQuery, filters, sortBy]);

  const productsBySubcategory = useMemo(() => {
    if (!category || !products) return {};

    const grouped = { all: products };
    category.subcategories.forEach(sub => {
      grouped[sub.id] = products.filter(p => p.subcategory === sub.id);
    });
    return grouped;
  }, [category, products]);

  const handleClearFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: true,
      hasDiscount: false
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.hasDiscount) count++;
    return count;
  }, [filters]);

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const allSubcategories = [
    { id: 'all', name: 'All', image: category.image },
    ...category.subcategories
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="pt-20 md:pt-24">
        {/* Sticky Top Bar */}
        <div className="bg-white border-b border-neutral-100 sticky top-16 md:top-20 z-40 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-neutral-900 truncate">{category.name}</h1>
              <p className="text-xs text-neutral-500 font-medium">{filteredProducts.length} items</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative flex items-center bg-neutral-100 rounded-xl overflow-hidden">
              <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-sm font-medium placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Filter Pills */}
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
          {/* Subcategories Sidebar */}
          <aside className="w-20 flex-shrink-0 bg-white border-r border-neutral-100 sticky top-48 h-[calc(100vh-192px)] overflow-y-auto scrollbar-hide">
            {allSubcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`w-full px-2 py-4 flex flex-col items-center gap-2 transition-all border-l-4 ${
                  selectedSubcategory === sub.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-transparent hover:bg-neutral-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                  selectedSubcategory === sub.id ? 'border-orange-500' : 'border-neutral-200'
                }`}>
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23f5f5f5" width="48" height="48"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + sub.name[0] + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <span className={`text-[9px] font-bold text-center leading-tight line-clamp-2 ${
                  selectedSubcategory === sub.id ? 'text-orange-600' : 'text-neutral-600'
                }`}>
                  {sub.name}
                </span>
                {productsBySubcategory[sub.id] && (
                  <span className="text-[8px] font-bold text-neutral-400">
                    {productsBySubcategory[sub.id].length}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* Products Area */}
          <main className="flex-1 p-4 overflow-y-auto">
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
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral-500 font-medium">No products found</p>
                {(searchQuery || activeFilterCount > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      handleClearFilters();
                    }}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-bold"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Filter Modal */}
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

        {/* Sort Modal */}
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
                    sortBy === option.value ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-700'
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