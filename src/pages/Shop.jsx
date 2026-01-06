// src/pages/Shop.jsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES_DATA } from '@/data/categoriesData';
import ProductCard from '@/components/customer/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Shop() {
  const navigate = useNavigate();
  const { products, loading } = useProducts({ active: true });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const allCategories = useMemo(() => {
    const cats = [{ id: 'all', name: 'All', icon: '🛒' }];
    CATEGORIES_DATA.forEach(section => {
      section.subcategories.forEach(cat => {
        cats.push({ ...cat, sectionColor: section.color });
      });
    });
    return cats;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
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
  }, [products, selectedCategory, priceFilter, sortBy]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId !== 'all') {
      navigate(`/category/${categoryId}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="pt-16 md:pt-20 pb-20 md:pb-8">
        <div className="bg-white border-b border-neutral-100 sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <h1 className="text-lg font-black text-neutral-900">
                {selectedCategory === 'all' ? 'All Products' : allCategories.find(c => c.id === selectedCategory)?.name}
              </h1>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 whitespace-nowrap hover:border-orange-500 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 whitespace-nowrap hover:border-orange-500 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort
                <ChevronDown className="w-4 h-4" />
              </button>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 outline-none hover:border-orange-500 transition-colors"
              >
                <option value="all">Price</option>
                <option value="0-100">Under ₹100</option>
                <option value="100-500">₹100 - ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-99999">Above ₹1000</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="flex">
            <aside className="w-24 md:w-28 flex-shrink-0 bg-neutral-900 min-h-screen sticky top-32 md:top-36 self-start overflow-y-auto scrollbar-hide">
              <div className="py-4 space-y-2">
                {allCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full px-3 py-4 flex flex-col items-center justify-center gap-2 transition-all ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {category.icon && (
                      <span className="text-2xl">{category.icon}</span>
                    )}
                    {category.image && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-center leading-tight line-clamp-2">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <main className="flex-1 px-4 py-6 bg-gradient-to-b from-white to-neutral-50">
              <div className="mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <h2 className="text-xl font-black mb-2">
                  Healthy, juicy & seasonal
                </h2>
                <p className="text-sm opacity-90">
                  Picked fresh from India's orchards
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                      <div className="aspect-square bg-neutral-200 rounded-xl mb-3" />
                      <div className="h-4 bg-neutral-200 rounded mb-2" />
                      <div className="h-3 bg-neutral-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>

      <Footer />

      {showSortMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowSortMenu(false)}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6"
          >
            <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-black mb-4">Sort By</h3>
            <div className="space-y-2">
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
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${
                    sortBy === option.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}

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