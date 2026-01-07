// src/pages/Categories.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mic, ShoppingCart, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CATEGORIES_DATA } from '@/data/categoriesData';
import { useCart } from '@/hooks/useCart';

export default function Categories() {
  const navigate = useNavigate();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = Array.isArray(items)
    ? items.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  // Filter categories based on search
  const filteredData = CATEGORIES_DATA?.map(section => {
    if (!section || !Array.isArray(section.subcategories)) return section;

    const filteredSubcats = section.subcategories.filter(sub =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { ...section, subcategories: filteredSubcats };
  }) || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="bg-gradient-to-b from-orange-50 to-white pb-8">
        <div className="container mx-auto px-4 pt-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Shop by Category
                </h1>
                <p className="text-sm text-neutral-500 font-medium">
                  Explore all products organized by category
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative flex items-center bg-white rounded-2xl border-2 border-neutral-100 shadow-sm hover:border-orange-500 transition-all">
                <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search categories"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent outline-none text-neutral-800 font-medium placeholder:text-neutral-400"
                />
                <button className="absolute right-4 p-2 text-neutral-400 hover:text-orange-500 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {Array.isArray(filteredData) && filteredData.map((mainCat, sectionIdx) => (
            <motion.div
              key={mainCat.id || sectionIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.1 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: `${mainCat.color || '#eee'}15` }}
                >
                  {mainCat.icon || '🛒'}
                </div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                  {mainCat.name || 'Unnamed Category'}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {Array.isArray(mainCat.subcategories) && mainCat.subcategories.map((subCat, idx) => (
                  <motion.button
                    key={subCat.id || idx}
                    onClick={() => navigate(`/category/${subCat.id}`)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group relative bg-white rounded-2xl p-4 border-2 border-neutral-100 hover:border-orange-500 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square mb-3 rounded-xl overflow-hidden bg-neutral-50">
                      <img
                        src={subCat.image || ''}
                        alt={subCat.name || 'Category'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-800 text-center leading-tight group-hover:text-orange-600 transition-colors">
                      {subCat.name || 'Unnamed'}
                    </h3>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />

      {cartItemsCount > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => navigate('/cart')}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-full shadow-2xl shadow-orange-500/50 flex items-center gap-3 z-40 group"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-orange-600 rounded-full flex items-center justify-center text-xs font-black">
              {cartItemsCount}
            </span>
          </div>
          <span className="font-black text-lg">View Cart</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}