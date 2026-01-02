// src/components/layout/FeaturedProductsSection.jsx

 import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, ShoppingBag, Loader2 } from 'lucide-react';
import ProductCard from '@components/customer/ProductCard';
import { productService } from '@services/product.service';
import { ShimmerProductCard } from '@components/animations/Shimmer';
import Button from '@components/ui/Button';

/**
 * ZALLDI FEATURED PRODUCTS SECTION
 * A high-performance product grid with category filtering and lazy-loading.
 * Resolved: Path resolution errors for aliases.
 */
export default function FeaturedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(12);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const results = await productService.getProducts({
        limit: 50,
        active: true,
        category: filter !== 'all' ? filter : undefined
      });
      setProducts(results || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setIsExpanding(true);
    // Mimic network delay for better UX tactile feedback
    setTimeout(() => {
      setDisplayCount(prev => prev + 8);
      setIsExpanding(false);
    }, 400);
  };

  const filters = [
    { id: 'all', label: 'All Essentials' },
    { id: 'groceries', label: 'Groceries' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'dairy', label: 'Dairy & Eggs' },
    { id: 'snacks', label: 'Snacks & Munchies' }
  ];

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = products.length > displayCount;

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest mb-4">
              <ShoppingBag className="w-3 h-3" />
              <span>Our Catalog</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">
              Featured <span className="text-orange-500">Products</span>
            </h2>
            <p className="text-neutral-500 mt-2 font-medium max-w-lg">
              Handpicked premium essentials delivered with love. Pure quality, zero compromises.
            </p>
          </motion.div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex items-center gap-2 text-neutral-400 mr-2 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Filter</span>
            </div>
            {filters.map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => {
                  setFilter(filterOption.id);
                  setDisplayCount(12);
                }}
                className={`
                  relative px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300
                  ${filter === filterOption.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                    : 'bg-white text-neutral-500 border border-neutral-200 hover:border-orange-500/50 hover:bg-orange-50/50'
                  }
                `}
              >
                <span className="relative z-10">{filterOption.label}</span>
                {filter === filterOption.id && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-xl bg-orange-500 z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ShimmerProductCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-neutral-50 rounded-[3rem] border-2 border-dashed border-neutral-200"
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                <Filter className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="text-xl font-black text-neutral-800 mb-2">
                No matches found
              </h3>
              <p className="text-neutral-500 max-w-xs mx-auto">
                We couldn't find products in this category. Try adjusting your filter or check back later!
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((product, index) => (
                    <motion.div
                      key={product.id || index}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-20">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isExpanding}
                    className="px-12 py-4 rounded-2xl font-black uppercase tracking-widest border-2 border-neutral-200 hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-all group min-w-[240px]"
                  >
                    {isExpanding ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Load More Products
                        <motion.div
                          animate={{ y: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          ↓
                        </motion.div>
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}