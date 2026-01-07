// src/pages/Category.jsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  SlidersHorizontal,
  ChevronRight,
  Package,
  Filter,
  Menu
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/customer/ProductGrid';
import SortDropdown from '@/components/customer/SortDropdown';
import { getSubcategoryById } from '@/data/categoriesData';
import { useProducts } from '@/hooks/useProducts';

/**
 * Category Page
 * - Left vertical navigation (leaf groups)
 * - Sticky header with breadcrumb, count, filters & sort
 * - Hero banner (if provided via subcategory.image)
 * - ProductGrid with filters and sorting
 *
 * Defensive: works whether leafGroups is object or array and whether products is [] or undefined.
 */

function toArrayFromObject(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.entries(obj).map(([id, v]) => ({ id, ...v }));
}

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState('relevance');
  const [selectedLeafGroup, setSelectedLeafGroup] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const subcategory = getSubcategoryById(categoryId);
  const { products = [], loading } = useProducts({ category: categoryId, active: true });

  // convert leafGroups object -> array [{id, name, items}]
  const leafGroups = useMemo(() => toArrayFromObject(subcategory?.leafGroups), [subcategory]);

  // Filter products by selected leafGroup (product.leafGroup should match leafGroup id)
  const filteredProducts = useMemo(() => {
    if (!selectedLeafGroup) return products || [];
    return (products || []).filter((p) => {
      // defensive: product may store leafGroup as string id or name
      if (!p) return false;
      if (p.leafGroup === selectedLeafGroup) return true;
      // fallback: match by leaf group name
      const lg = leafGroups.find((l) => l.id === selectedLeafGroup);
      if (lg && p.leafGroup === lg.name) return true;
      return false;
    });
  }, [products, selectedLeafGroup, leafGroups]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...(filteredProducts || [])];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      case 'price-high':
        return list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      case 'name-asc':
        return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'rating':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Defensive: subcategory not found
  if (!subcategory) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Category Not Found</h2>
          <p className="text-neutral-500 mb-6">The category you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/categories')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Browse Categories
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // UI helpers for left nav visual (use subcategory image as fallback)
  const defaultThumb = subcategory.image || '/categories/placeholder.webp';
  const leftNavItems = [{ id: '__all__', name: 'All', image: defaultThumb }, ...leafGroups.map(l => ({ id: l.id, name: l.name, image: defaultThumb }))];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Sticky top bar */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/categories')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Back to categories"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-black text-neutral-900 truncate">
                {subcategory.name}
              </h1>
              <p className="text-sm text-neutral-500">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl">
                <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
                <span className="text-sm font-medium text-neutral-600">
                  {selectedLeafGroup
                    ? (leafGroups.find(l => l.id === selectedLeafGroup)?.name ?? 'Filtered')
                    : 'All Products'}
                </span>
              </div>

              <SortDropdown value={sortBy} onChange={setSortBy} />

              <button
                onClick={() => setMobileFiltersOpen((s) => !s)}
                className="px-3 py-2 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4 text-neutral-600" /> Filters
              </button>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 bg-neutral-100 rounded-lg"
                aria-label="Open filters"
              >
                <Filter className="w-5 h-5 text-neutral-700" />
              </button>
              <Menu className="w-6 h-6 text-neutral-600" />
            </div>
          </div>

          {/* Leaf group pill list (mobile/desktop) */}
          <div className="mt-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setSelectedLeafGroup(null)}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  !selectedLeafGroup ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All
              </button>

              {leafGroups.map((leaf) => (
                <button
                  key={leaf.id}
                  onClick={() => setSelectedLeafGroup(leaf.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    selectedLeafGroup === leaf.id ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {leaf.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left vertical nav (desktop) */}
          <aside className="hidden md:flex flex-col w-56 sticky top-[120px] h-[calc(100vh-140px)] overflow-auto pr-2">
            <nav className="flex flex-col gap-3">
              {leftNavItems.map((item) => {
                const active = selectedLeafGroup === item.id || (item.id === '__all__' && !selectedLeafGroup);
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedLeafGroup(item.id === '__all__' ? null : item.id)}
                    className={`flex items-center gap-3 text-left px-3 py-2 rounded-2xl transition-colors ${
                      active ? 'bg-green-900/10 border-l-4 border-green-500' : 'bg-transparent hover:bg-neutral-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center text-xl">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-neutral-800">{item.name}</div>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-green-600" />}
                  </button>
                );
              })}
            </nav>

            {/* Quick promo / info */}
            <div className="mt-4 p-3 bg-neutral-50 rounded-xl text-sm text-neutral-600 border border-neutral-100">
              <div className="font-semibold text-neutral-800">Picked fresh</div>
              <div className="mt-1">Sourced daily from local markets</div>
            </div>
          </aside>

          {/* Products column */}
          <main className="flex-1">
            {/* Hero banner */}
            <div className="mb-6">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={subcategory.image || '/categories/hero-default.webp'}
                  alt={subcategory.name}
                  className="w-full h-40 md:h-56 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/categories/hero-default.webp';
                  }}
                />
                <div className="absolute left-6 top-6 md:top-10 text-white">
                  <h2 className="text-lg md:text-2xl font-black drop-shadow-sm">{subcategory.name}</h2>
                  {subcategory.parentName && (
                    <div className="text-sm text-white/90 mt-1">{subcategory.parentName}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Filters summary / current filter chips */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden md:inline">Showing</span>
                <span className="font-bold">{sortedProducts.length}</span>
                <span className="hidden md:inline">items</span>
              </div>

              {/* active chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedLeafGroup && (
                  <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl text-sm font-semibold">
                    {leafGroups.find(l => l.id === selectedLeafGroup)?.name ?? 'Filtered'}
                  </span>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <div>
              <ProductGrid products={sortedProducts} loading={loading} />
            </div>
          </main>
        </div>
      </div>

      <Footer />

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-60 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white h-full p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5" />
                <h3 className="font-bold">Filters</h3>
              </div>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-neutral-600">
                Close
              </button>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Categories</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setSelectedLeafGroup(null); setMobileFiltersOpen(false); }}
                  className={`px-3 py-2 rounded-lg text-left ${!selectedLeafGroup ? 'bg-orange-500 text-white' : 'bg-neutral-100'}`}
                >
                  All
                </button>

                {leafGroups.map((leaf) => (
                  <button
                    key={leaf.id}
                    onClick={() => { setSelectedLeafGroup(leaf.id); setMobileFiltersOpen(false); }}
                    className={`px-3 py-2 rounded-lg text-left ${selectedLeafGroup === leaf.id ? 'bg-orange-500 text-white' : 'bg-neutral-100'}`}
                  >
                    {leaf.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Sort</h4>
              <SortDropdown value={sortBy} onChange={(v) => setSortBy(v)} />
            </div>
          </div>
        </div>
      )}

      {/* small helper styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}