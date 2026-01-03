import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  X, 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  Tag, 
  Zap,
  ArrowUpDown,
  History
} from 'lucide-react';

// Layout & UI Components
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/customer/ProductCard';
import EmptyState from '../components/shared/EmptyState';
import LoadingScreen from '../components/shared/LoadingScreen';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

// Hooks & Constants
import { useSearch } from '../hooks/useSearch';
import { CATEGORIES } from '../utils/constants';

/**
 * ZALLDI - High-Performance Search & Discovery
 * Features: Instant pill-filters, dynamic sorting, and optimized grid density.
 */

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const { results, isLoading, error, searchProducts } = useSearch();
  
  useEffect(() => {
    if (query) {
      searchProducts(query, { category: categoryParam });
    }
  }, [query, categoryParam, searchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchInput.trim();
    if (trimmedQuery) {
      const params = new URLSearchParams();
      params.set('q', trimmedQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      setSearchParams(params);
    }
  };

  const handleCategoryToggle = (catId) => {
    const newCat = selectedCategory === catId ? '' : catId;
    setSelectedCategory(newCat);
    const params = new URLSearchParams(searchParams);
    if (newCat) params.set('category', newCat);
    else params.delete('category');
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSelectedCategory('');
    setSearchParams({});
  };

  const sortedResults = useMemo(() => {
    if (!results) return [];
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        default: return 0;
      }
    });
  }, [results, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* SEARCH HEADER SECTION */}
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-6 md:p-8"
            >
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                      <SearchIcon size={22} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search fresh groceries, essentials..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-14 pr-14 py-5 bg-gray-50 border-none rounded-3xl text-gray-900 font-bold placeholder:text-gray-400 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all outline-none text-lg"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput('')}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        <X size={22} />
                      </button>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-700 text-white px-10 rounded-3xl font-black py-5 shadow-lg shadow-orange-200"
                  >
                    SEARCH
                  </Button>
                </div>

                {/* CATEGORY PILLS */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  <div className="flex-shrink-0 flex items-center gap-2 text-gray-400 mr-2 border-r border-gray-100 pr-4">
                    <Filter size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                  </div>
                  
                  <CategoryPill 
                    label="All" 
                    isActive={!selectedCategory} 
                    onClick={() => handleCategoryToggle('')} 
                  />
                  {CATEGORIES.map((cat) => (
                    <CategoryPill 
                      key={cat.id}
                      label={cat.name}
                      isActive={selectedCategory === cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                    />
                  ))}
                </div>
              </form>
            </motion.div>
          </div>

          {/* RESULTS META & SORTING */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
            <div>
              {query ? (
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-gray-900">
                    Results for "<span className="text-orange-600">{query}</span>"
                  </h1>
                  <span className="bg-gray-100 text-gray-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    {sortedResults.length} FOUND
                  </span>
                </div>
              ) : (
                <h1 className="text-2xl font-black text-gray-900">Start Discovering</h1>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none">
                  <ArrowUpDown size={14} />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-900 appearance-none focus:ring-4 focus:ring-orange-500/5 outline-none cursor-pointer uppercase tracking-tight"
                >
                  <option value="relevance">Popularity</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
              
              {query && (
                <button
                  onClick={clearAllFilters}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Clear all"
                >
                  <History size={20} />
                </button>
              )}
            </div>
          </div>

          {/* GRID CONTENT */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <LoadingScreen />
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center">
                <Zap className="text-red-400 mx-auto mb-4" size={40} />
                <h3 className="text-red-900 font-black">Something went wrong</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            ) : !query ? (
              <EmptyState
                icon={SearchIcon}
                title="Find what you need"
                description="Search for fresh produce, dairy, electronics or daily essentials in Butwal."
              />
            ) : sortedResults.length === 0 ? (
              <EmptyState
                icon={SearchIcon}
                title="No results found"
                description={`We couldn't find matches for "${query}" in our Butwal store.`}
                actionLabel="Browse All Categories"
                onAction={() => navigate('/shop')}
              />
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
              >
                <AnimatePresence>
                  {sortedResults.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * Modern Category Pill Component
 */
const CategoryPill = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex-shrink-0 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300
      ${isActive 
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 translate-y-[-2px]' 
        : 'bg-white text-gray-500 border border-gray-100 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50'
      }
    `}
  >
    {label}
  </button>
);

export default Search;

