// src/components/home/DualRowCategoryShowcase.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/customer/ProductCard';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function DualRowCategoryShowcase({ categoryId, categoryName }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  
  useEffect(() => {
    if (!categoryId) return;
    fetchProducts();
  }, [categoryId]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const q = query(
        collection(db, 'products'),
        where('category', '==', categoryId),
        where('active', '==', true),
        where('stock', '>', 0),
        orderBy('stock'), // 🔴 REQUIRED BY FIRESTORE
        orderBy('soldCount', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProducts(data);
    } catch (err) {
      console.error('DualRowCategoryShowcase error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return null;
  if (products.length === 0) return null;
  
  const row1Products = products.slice(0, 6);
  const row2Products = products.slice(6, 12);
  const hiddenProducts = products.slice(12, 15);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-black text-neutral-900">
          {categoryName}
        </h2>
      </div>

      <div className="space-y-2">
        {/* ROW 1 */}
        <div
          ref={row1Ref}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          {row1Products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex-shrink-0 w-[110px]"
            >
              <ProductCard product={product} compact />
            </motion.div>
          ))}
        </div>

        {/* ROW 2 + SEE ALL */}
        <div className="flex gap-2">
          <div
            ref={row2Ref}
            className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
          >
            {row2Products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex-shrink-0 w-[110px]"
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </div>

          {hiddenProducts.length > 0 && (
            <Link
              to={`/category/${categoryId}`}
              className="flex-shrink-0 w-[110px] bg-orange-50 rounded-xl border p-3 flex flex-col items-center justify-center"
            >
              <div className="flex gap-1 mb-2">
                {hiddenProducts.map((p, i) => (
                  <div
                    key={p.id}
                    className="w-8 h-8 rounded-full overflow-hidden border"
                    style={{ marginLeft: i ? -8 : 0 }}
                  >
                    <img
                      src={p.imageUrls?.[0] || '/placeholder.png'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <span className="text-xs font-bold">
                See all
              </span>
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}