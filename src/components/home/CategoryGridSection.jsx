// src/components/home/CategoryGridSection.jsx 
//2x3 layout non scroll 

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/customer/ProductCard';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function CategoryGridSection({
  categoryId,
  categoryName,
  displayCount = 6
}) {
  const [products, setProducts] = useState([]);
  const [hiddenProducts, setHiddenProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
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
        limit(displayCount + 3)
      );
      
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProducts(productsData.slice(0, displayCount));
      setHiddenProducts(productsData.slice(displayCount, displayCount + 3));
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
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-40 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-neutral-100 rounded-xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
          {categoryName}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} compact />
          </motion.div>
        ))}
      </div>

      {hiddenProducts.length > 0 && (
        <Link
          to={`/category/${categoryId}`}
          className="flex items-center justify-center gap-3 py-4 bg-neutral-50 hover:bg-orange-50 rounded-xl border border-neutral-100 hover:border-orange-200 transition-all group"
        >
          <div className="flex -space-x-2">
            {hiddenProducts.slice(0, 3).map((product, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-neutral-100"
              >
                <img
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="text-sm font-bold text-neutral-700 group-hover:text-orange-600 transition-colors">
            See all products
          </span>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </Link>
      )}
    </motion.div>
  );
}