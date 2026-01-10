// src/components/home/DoubleRowCategorySection.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/customer/ProductCard';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function DoubleRowCategorySection({ categoryId, categoryName }) {
  const [products, setProducts] = useState([]);
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
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('category', '==', categoryId),
        where('active', '==', true),
        where('stock', '>', 0),
        orderBy('rating', 'desc'),
        orderBy('soldCount', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const visibleProducts = productsData.slice(0, 6);
      const hidden = productsData.slice(6, 9);
      
      setProducts(visibleProducts);
      setHiddenProducts(hidden);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setHiddenProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="mb-6">
        <div className="h-5 w-40 bg-neutral-200 rounded mb-3 animate-pulse" />
        <div className="space-y-3">
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[140px]">
                <div className="bg-neutral-100 rounded-xl aspect-square mb-2 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[140px]">
                <div className="bg-neutral-100 rounded-xl aspect-square mb-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  const row1Products = products.slice(0, 3);
  const row2Products = products.slice(3, 6);
  
  return (
    <div className="mb-6">
      <h2 className="text-base font-black text-neutral-900 mb-3 px-1">
        {categoryName}
      </h2>

      <div className="space-y-3">
        {/* Row 1 */}
        <div
          ref={row1Ref}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {row1Products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[140px] sm:w-[160px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Row 2 */}
        <div
          ref={row2Ref}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {row2Products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 3) * 0.05 }}
              className="flex-shrink-0 w-[140px] sm:w-[160px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}

          {/* See All Products Box */}
          <Link
            to={`/category/${categoryId}`}
            className="flex-shrink-0 w-[140px] sm:w-[160px]"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="h-full bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 p-4 flex flex-col items-center justify-center hover:border-orange-500 hover:shadow-lg transition-all group"
            >
              {hiddenProducts.length > 0 && (
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
              )}

              <p className="text-xs font-black text-neutral-800 text-center mb-1">
                See all products
              </p>
              
              <div className="flex items-center gap-1 text-orange-600 group-hover:gap-2 transition-all">
                <span className="text-xs font-bold">View All</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
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