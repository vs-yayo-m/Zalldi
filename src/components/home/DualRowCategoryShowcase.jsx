// src/components/home/DualRowCategoryShowcase.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import CompactProductCard from '@/components/customer/CompactProductCard';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function DualRowCategoryShowcase({ categoryId, categoryName }) {
  const [products, setProducts] = useState({ row1: [], row2: [] });
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  
  useEffect(() => {
    fetchProducts();
  }, [categoryId]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      
      // Simplified query - no orderBy to avoid index requirement
      const q = query(
        productsRef,
        where('category', '==', categoryId),
        where('active', '==', true),
        where('stock', '>', 0),
        limit(15)
      );
      
      const snapshot = await getDocs(q);
      let productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort in JavaScript instead of Firestore
      productsData = productsData.sort((a, b) => {
        if (b.rating !== a.rating) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return (b.soldCount || 0) - (a.soldCount || 0);
      });
      
      const row1 = productsData.slice(0, 6);
      const row2 = productsData.slice(6, 12);
      const top3 = productsData.slice(12, 15);
      
      setProducts({ row1, row2 });
      setTopProducts(top3);
      
      console.log(`Fetched ${productsData.length} products for ${categoryName}`);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts({ row1: [], row2: [] });
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-6 w-48 bg-neutral-200 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[calc(33.333%-8px)]">
                <div className="bg-neutral-100 rounded-xl aspect-square mb-2 animate-pulse" />
                <div className="h-3 bg-neutral-100 rounded mb-1 animate-pulse" />
                <div className="h-3 bg-neutral-100 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[calc(33.333%-8px)]">
                <div className="bg-neutral-100 rounded-xl aspect-square mb-2 animate-pulse" />
                <div className="h-3 bg-neutral-100 rounded mb-1 animate-pulse" />
                <div className="h-3 bg-neutral-100 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!products.row1?.length && !products.row2?.length) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight mb-4">
        {categoryName}
      </h2>

      <div className="space-y-3">
        {/* Row 1 */}
        {products.row1?.length > 0 && (
          <div
            ref={row1Ref}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {products.row1.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[calc(33.333%-8px)] min-w-[110px]"
              >
                <CompactProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Row 2 */}
        <div
          ref={row2Ref}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {products.row2?.length > 0 && products.row2.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[calc(33.333%-8px)] min-w-[110px]"
            >
              <CompactProductCard product={product} />
            </motion.div>
          ))}

          {/* See All Products Box */}
          <Link
            to={`/category/${categoryId}`}
            className="flex-shrink-0 w-[calc(33.333%-8px)] min-w-[110px] bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-dashed border-orange-300 flex flex-col items-center justify-center p-4 hover:from-orange-100 hover:to-orange-200 transition-all group"
          >
            {topProducts.length > 0 ? (
              <div className="flex items-center justify-center -space-x-2 mb-2">
                {topProducts.slice(0, 3).map((product, idx) => (
                  <div
                    key={product.id}
                    className="w-8 h-8 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm"
                    style={{ zIndex: 3 - idx }}
                  >
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-200 mb-2" />
            )}
            <p className="text-[10px] font-black text-orange-600 text-center leading-tight mb-1">
              See all products
            </p>
            <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}