// src/pages/Category.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ChevronDown,
  ShoppingCart,
  ChevronRight,
  Heart
} from 'lucide-react';
import { getCategoryById } from '@/data/categoriesData';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/customer/ProductCard';
import EmptyState from '@/components/shared/EmptyState';

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { items } = useCart();
  
  const category = getCategoryById(categoryId);
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  const subcategoryRefs = useRef({});
  const subcategoryNavRef = useRef(null);
  
  const { products, loading } = useProducts({ 
    category: categoryId, 
    active: true 
  });

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (selectedSubcategory !== 'all' && subcategoryRefs.current[selectedSubcategory]) {
      subcategoryRefs.current[selectedSubcategory].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'center'
      });
    }
  }, [selectedSubcategory]);

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <EmptyState
          icon={<ShoppingCart className="w-16 h-16" />}
          title="Category Not Found"
          description="The category you're looking for doesn't exist"
        />
      </div>
    );
  }

  const allSubcategories = [
    { id: 'all', name: 'All', icon: '🛒' },
    ...((category?.subcategories || []))
  ];

  const filteredProducts = selectedSubcategory === 'all' 
    ? products 
    : products.filter(p => p.subcategory === selectedSubcategory);

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <EmptyState
          icon={<ShoppingCart className="w-16 h-16 text-white" />}
          title="Category Not Found"
          description="The category you're looking for doesn't exist"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 pb-24">
      {/* Header */}
      <div className="bg-neutral-900 text-white sticky top-0 z-40 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="flex-1">
                <h1 className="text-lg font-black">{category.name}</h1>
                <p className="text-xs text-neutral-400">
                  Delivering to <span className="text-white font-bold">Home</span>
                </p>
              </div>
            </div>

            <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
              <Search className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-bold whitespace-nowrap transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-bold whitespace-nowrap transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowPrice(!showPrice)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-bold whitespace-nowrap transition-colors"
            >
              Price
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-orange-900/30 rounded-xl">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-bold text-orange-400">Appetizers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Vertical Subcategory Navigation */}
        <div className="sticky top-16 h-[calc(100vh-4rem)] w-24 bg-neutral-900 border-r border-neutral-800 overflow-y-auto scrollbar-hide flex-shrink-0">
          <div className="py-4 space-y-2">
            {allSubcategories.map((sub) => (
              <button
                key={sub.id}
                ref={el => subcategoryRefs.current[sub.id] = el}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`w-full px-2 py-3 flex flex-col items-center gap-2 transition-all ${
                  selectedSubcategory === sub.id
                    ? 'bg-green-900/20 border-l-4 border-green-500'
                    : 'hover:bg-neutral-800'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  selectedSubcategory === sub.id
                    ? 'bg-green-500/20 ring-2 ring-green-500'
                    : 'bg-neutral-800'
                }`}>
                  {sub.icon}
                </div>
                <span className={`text-[10px] font-bold text-center leading-tight ${
                  selectedSubcategory === sub.id ? 'text-green-400' : 'text-neutral-400'
                }`}>
                  {sub.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Banner */}
          {category.banner && (
            <div 
              className="h-48 relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-center px-6">
                <h2 className="text-3xl font-black text-white mb-2">
                  {category.banner}
                </h2>
                <p className="text-neutral-200 font-medium">
                  {category.tagline}
                </p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="p-4">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-neutral-800 rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon={<ShoppingCart className="w-16 h-16" />}
                title="No Products Found"
                description="Check back later for new items"
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => navigate('/cart')}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 font-black text-lg"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-sm">View cart</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{cartItemsCount} items</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </motion.button>
      )}
    </div>
  );
}