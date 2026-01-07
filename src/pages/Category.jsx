// src/pages/Category.jsx

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, SlidersHorizontal, ChevronRight, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/customer/ProductGrid';
import SortDropdown from '@/components/customer/SortDropdown';
import { getSubcategoryById } from '@/data/categoriesData';
import { useProducts } from '@/hooks/useProducts';

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedLeafGroup, setSelectedLeafGroup] = useState(null);
  
  const subcategory = getSubcategoryById(categoryId);
  const { products, loading } = useProducts({ category: categoryId, active: true });
  
  const filteredProducts = useMemo(() => {
    if (!selectedLeafGroup) return products;
    return products.filter(p => p.leafGroup === selectedLeafGroup);
  }, [products, selectedLeafGroup]);
  
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price-high':
        return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);
  
  if (!subcategory) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Category Not Found</h2>
          <p className="text-neutral-500 mb-6">The category you're looking for doesn't exist</p>
          <button
            onClick={() => navigate('/categories')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="bg-white border-b border-neutral-100 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/categories')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-neutral-900">
                {subcategory.name}
              </h1>
              <p className="text-sm text-neutral-500">
                {sortedProducts.length} products available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setSelectedLeafGroup(null)}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                !selectedLeafGroup
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {subcategory.leafGroups &&
              Object.entries(subcategory.leafGroups).map(([leafId, leafGroup]) => (
                <button
                  key={leafId}
                  onClick={() => setSelectedLeafGroup(leafId)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    selectedLeafGroup === leafId
                      ? 'bg-orange-500 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {leafGroup.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-bold text-neutral-600">
              {selectedLeafGroup
                ? subcategory.leafGroups[selectedLeafGroup].name
                : 'All Products'}
            </span>
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {selectedLeafGroup && subcategory.leafGroups[selectedLeafGroup].items && (
          <div className="bg-white rounded-2xl p-4 mb-6 border border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Filter by Type:</h3>
            <div className="flex flex-wrap gap-2">
              {subcategory.leafGroups[selectedLeafGroup].items.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-neutral-50 text-neutral-600 rounded-lg text-sm font-medium border border-neutral-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <ProductGrid products={sortedProducts} loading={loading} />
      </div>

      <Footer />

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