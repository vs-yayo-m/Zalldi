// src/components/home/DualRowCategoryShowcase.jsx

// src/components/home/DualRowCategoryShowcase.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/customer/ProductCard';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function DualRowCategoryShowcase({
  categoryId,
  categoryName
}) {
  const [row1Products, setRow1Products] = useState([]);
  const [row2Products, setRow2Products] = useState([]);
  const [hiddenProducts, setHiddenProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  
  useEffect(() => {
    fetchProducts();
  }, [categoryId]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      if (!db) return;
      
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('category', '==', categoryId),
        where('active', '==', true),
        orderBy('rating', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        slug: doc.data().slug || doc.id,
        ...doc.data()
      }));
      
      productsData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
      // Split into rows: 6 for row1, 6 for row2, rest for "See All"
      setRow1Products(productsData.slice(0, 6));
      setRow2Products(productsData.slice(6, 12));
      setHiddenProducts(productsData.slice(12).slice(0, 3)); // Top 3 from remaining
      
      console.log(`✅ Loaded ${productsData.length} products for ${categoryName}`);
      
    } catch (error) {
      console.error(`❌ Error for ${categoryName}:`, error.message);
      setRow1Products([]);
      setRow2Products([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-5 w-48 bg-neutral-200 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          <div className="flex gap-2.5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[170px]">
                <div className="bg-neutral-100 rounded-xl aspect-square mb-2 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[170px]">
                <div className="bg-neutral-100 rounded-xl aspect-square mb-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (row1Products.length === 0 && row2Products.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight mb-4 px-4 sm:px-0">
        {categoryName}
      </h2>

      <div className="space-y-3">
        {/* Row 1 */}
        {row1Products.length > 0 && (
          <div
            ref={row1Ref}
            className="flex gap-2.5 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {row1Products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[170px]"
              >
                <ProductCard product={product} compact={true} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Row 2 */}
        {row2Products.length > 0 && (
          <div
            ref={row2Ref}
            className="flex gap-2.5 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {row2Products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[170px]"
              >
                <ProductCard product={product} compact={true} />
              </motion.div>
            ))}

            {/* See All Products Box */}
            <Link
              to={`/category/${categoryId}`}
              className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[170px] bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all p-4 flex flex-col items-center justify-center group"
            >
              <div className="flex -space-x-3 mb-3">
                {hiddenProducts.slice(0, 3).map((product, idx) => (
                  <div
                    key={product.id}
                    className="w-12 h-12 rounded-full border-2 border-white bg-white overflow-hidden shadow-md"
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
              <span className="text-xs font-black text-orange-600 text-center mb-1">
                See all products
              </span>
              <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}