// src/pages/Categories.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mic, ShoppingCart, ChevronRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CATEGORIES_STRUCTURE } from '@/data/categoriesStructure';
import { useCart } from '@/hooks/useCart';

export default function Categories() {
  const navigate = useNavigate();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const filteredGroups = searchQuery
    ? CATEGORIES_STRUCTURE.map(group => ({
        ...group,
        categories: group.categories.filter(cat =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.categories.length > 0)
    : CATEGORIES_STRUCTURE;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="bg-gradient-to-b from-orange-50 via-white to-neutral-50 pb-12">
        <div className="container mx-auto px-4 pt-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                    All Categories
                  </h1>
                  <p className="text-sm text-neutral-500 font-medium mt-1">
                    Browse {CATEGORIES_STRUCTURE.reduce((sum, group) => sum + group.categories.length, 0)} categories across {CATEGORIES_STRUCTURE.length} groups
                  </p>
                </div>
              </div>
            </div>

            <div className="relative max-w-2xl">
              <div className="relative flex items-center bg-white rounded-2xl border-2 border-neutral-100 shadow-sm hover:border-orange-500 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all">
                <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder='Search categories...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent outline-none text-neutral-800 font-medium placeholder:text-neutral-400"
                />
                <button className="absolute right-4 p-2 text-neutral-400 hover:text-orange-500 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {filteredGroups.map((group, groupIdx) => (
            <motion.div
              key={group.groupId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                  style={{ backgroundColor: `${group.groupColor}20` }}
                >
                  {group.groupIcon}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                    {group.groupName}
                  </h2>
                  <p className="text-sm text-neutral-500 font-medium">
                    {group.categories.length} categories
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {group.categories.map((category, idx) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03, type: 'spring', stiffness: 300 }}
                    className="group relative bg-white rounded-2xl overflow-hidden border-2 border-neutral-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="aspect-square relative overflow-hidden bg-neutral-50">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + category.name + '%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-bold text-neutral-800 text-center leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                        {category.name}
                      </h3>
                      {category.subcategories && (
                        <p className="text-xs text-neutral-400 text-center mt-1 font-medium">
                          {category.subcategories.length} subcategories
                        </p>
                      )}
                    </div>

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shadow-xl">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>

                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: group.groupColor }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">No categories found</h3>
              <p className="text-neutral-500">Try searching with different keywords</p>
            </div>
          )}
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