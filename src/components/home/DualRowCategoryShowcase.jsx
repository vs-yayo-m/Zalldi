// src/components/home/DualRowCategoryShowcase.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/customer/ProductCard';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function DualRowCategoryShowcase({ categoryId, categoryName }) {
  const [allProducts, setAllProducts] = useState([]);
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
      
      setAllProducts(productsData);
      
      const row1 = productsData.slice(0, 6);
      const row2 = productsData.slice(6, 12);
      const hidden = productsData.slice(12, 15);
      
      setRow1Products(row1);
      setRow2Products(row2);
      setHiddenProducts(hidden);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-40 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((rowNum) => (
            <div key={rowNum} className="flex gap-2 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-[110px]">
                  <div className="bg-neutral-100 rounded-xl aspect-square mb-1 animate-pulse" />
                  <div className="h-3 bg-neutral-100 rounded mb-1 animate-pulse" />
                  <div className="h-2 bg-neutral-100 rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!allProducts || allProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-black text-neutral-900 tracking-tight">
          {categoryName}
        </h2>
      </div>

      <div className="space-y-2">
        {row1Products.length > 0 && (
          <div
            ref={row1Ref}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
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
                className="flex-shrink-0 w-[110px]"
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <div
            ref={row2Ref}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1 pb-1"
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
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[110px]"
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </div>

          {hiddenProducts.length > 0 && (
            <Link
              to={`/category/${categoryId}`}
              className="flex-shrink-0 w-[110px] bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:border-orange-400 transition-all p-3 flex flex-col items-center justify-center group"
            >
              <div className="flex gap-1 mb-2">
                {hiddenProducts.slice(0, 3).map((product, idx) => (
                  <div
                    key={product.id}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm"
                    style={{ marginLeft: idx > 0 ? '-8px' : '0', zIndex: 3 - idx }}
                  >
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <span className="text-xs font-black text-neutral-800 text-center mb-1">
                See all products
              </span>
              
              <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
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