// src/pages/Category.jsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  SlidersHorizontal,
  Package
} from 'lucide-react';

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
  const { products, loading } = useProducts({
    category: categoryId,
    active: true
  });
  
  /* -------------------- FILTERING -------------------- */
  const filteredProducts = useMemo(() => {
    if (!selectedLeafGroup) return products;
    return products.filter(
      (p) => p.leafGroup === selectedLeafGroup
    );
  }, [products, selectedLeafGroup]);
  
  /* -------------------- SORTING -------------------- */
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        return list.sort(
          (a, b) =>
          (a.discountPrice || a.price) -
          (b.discountPrice || b.price)
        );
      case 'price-high':
        return list.sort(
          (a, b) =>
          (b.discountPrice || b.price) -
          (a.discountPrice || a.price)
        );
      case 'name-asc':
        return list.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      case 'rating':
        return list.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
      case 'newest':
        return list.sort(
          (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);
  
  /* -------------------- NOT FOUND -------------------- */
  if (!subcategory) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />

        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Category Not Found
          </h2>
          <p className="text-neutral-500 mb-6">
            The category you're looking for doesn’t exist.
          </p>
          <button
            onClick={() => navigate('/categories')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600"
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }
  
  /* ==================== UI ==================== */
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* ---------- STICKY CATEGORY HEADER ---------- */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* Title */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/categories')}
              className="p-2 rounded-lg hover:bg-neutral-100"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-black text-neutral-900">
                {subcategory.name}
              </h1>
              <p className="text-sm text-neutral-500">
                {sortedProducts.length} items
              </p>
            </div>
          </div>

          {/* Leaf groups (Blinkit-style horizontal rail) */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setSelectedLeafGroup(null)}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${
                !selectedLeafGroup
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              All
            </button>

            {subcategory.leafGroups &&
              Object.entries(subcategory.leafGroups).map(
                ([leafId, leaf]) => (
                  <button
                    key={leafId}
                    onClick={() =>
                      setSelectedLeafGroup(leafId)
                    }
                    className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${
                      selectedLeafGroup === leafId
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {leaf.name}
                  </button>
                )
              )}
          </div>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="container mx-auto px-4 py-6">
        {/* Sort / Filter bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-neutral-600">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-sm font-bold">
              {selectedLeafGroup
                ? subcategory.leafGroups[selectedLeafGroup].name
                : 'All Products'}
            </span>
          </div>

          <SortDropdown
            value={sortBy}
            onChange={setSortBy}
          />
        </div>

        {/* Optional leaf meta (Blinkit info chips) */}
        {selectedLeafGroup &&
          subcategory.leafGroups[selectedLeafGroup]
            .items && (
            <div className="bg-white border border-neutral-100 rounded-2xl p-4 mb-6">
              <h3 className="text-sm font-bold text-neutral-700 mb-3">
                Available Types
              </h3>

              <div className="flex flex-wrap gap-2">
                {subcategory.leafGroups[
                  selectedLeafGroup
                ].items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-sm rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Products */}
        <ProductGrid
          products={sortedProducts}
          loading={loading}
        />
      </div>

      <Footer />

      {/* Hide scrollbars (mobile UX parity) */}
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