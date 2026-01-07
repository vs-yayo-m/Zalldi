// src/pages/Category.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Grid, ChevronRight, ShoppingCart, Home } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCategoryById } from '@/data/categoriesStructure';
import { useCart } from '@/hooks/useCart';

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { items } = useCart();
  const [category, setCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const categoryData = getCategoryById(categoryId);
    if (categoryData) {
      setCategory(categoryData);
    } else {
      navigate('/categories');
    }
  }, [categoryId, navigate]);

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Grid className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-neutral-600 font-medium">Loading category...</p>
        </div>
      </div>
    );
  }

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const filteredSubcategories = searchQuery
    ? category.subcategories.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : category.subcategories;

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/category/${categoryId}/subcategory/${subcategoryId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="bg-gradient-to-b from-orange-50 via-white to-neutral-50 pb-12">
        <div className="container mx-auto px-4 pt-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm overflow-x-auto scrollbar-hide">
            <Link to="/" className="text-neutral-500 hover:text-orange-600 transition-colors flex items-center gap-1 whitespace-nowrap">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
            <Link to="/categories" className="text-neutral-500 hover:text-orange-600 transition-colors whitespace-nowrap">
              All Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
            <span className="text-neutral-900 font-bold whitespace-nowrap">{category.name}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/categories')}
                className="p-2 hover:bg-orange-50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                  style={{ backgroundColor: `${category.groupColor}20` }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-3xl">${category.groupIcon}</span>`;
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-bold mb-1">{category.groupName}</p>
                  <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                    {category.name}
                  </h1>
                  <p className="text-sm text-neutral-500 font-medium mt-1">
                    {category.subcategories.length} subcategories available
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl">
              <div className="relative flex items-center bg-white rounded-2xl border-2 border-neutral-100 shadow-sm hover:border-orange-500 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all">
                <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={`Search in ${category.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-neutral-800 font-medium placeholder:text-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredSubcategories.map((subcategory, idx) => (
              <motion.button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.id)}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02, type: 'spring', stiffness: 300 }}
                className="group relative bg-white rounded-2xl overflow-hidden border-2 border-neutral-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden bg-neutral-50">
                  <img
                    src={subcategory.image}
                    alt={subcategory.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="12" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + subcategory.name + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-3">
                  <h3 className="text-xs font-bold text-neutral-800 text-center leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[2.25rem] flex items-center justify-center">
                    {subcategory.name}
                  </h3>
                </div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2"
                >
                  <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-xl">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: category.groupColor }}
                />
              </motion.button>
            ))}
          </div>

          {filteredSubcategories.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">No subcategories found</h3>
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
          <span className="font-black text-lg hidden sm:inline">View Cart</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}