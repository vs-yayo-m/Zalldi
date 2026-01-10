import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/customer/ProductCard';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';

export default function DualRowCategoryShowcase({ categoryId, categoryName }) {
  const [row1Products, setRow1Products] = useState([]);
  const [row2Products, setRow2Products] = useState([]);
  const [hiddenProducts, setHiddenProducts] = useState([]);
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
      const db = getFirestore();

      const q = query(
        collection(db, 'products'),
        where('category', '==', categoryId),
        where('active', '==', true),
        where('stock', '>', 0),
        orderBy('rating', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRow1Products(products.slice(0, 6));
      setRow2Products(products.slice(6, 12));
      setHiddenProducts(products.slice(12, 15));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setRow1Products([]);
      setRow2Products([]);
      setHiddenProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="h-5 w-40 bg-neutral-200 rounded animate-pulse mb-3" />
        {[1, 2].map(row => (
          <div key={row} className="flex gap-2 mb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-[110px]">
                <div className="aspect-square bg-neutral-100 rounded-xl mb-1 animate-pulse" />
                <div className="h-3 bg-neutral-100 rounded mb-1 animate-pulse" />
                <div className="h-2 bg-neutral-100 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!row1Products.length && !row2Products.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-base font-black text-neutral-900 mb-3">
        {categoryName}
      </h2>

      <div className="space-y-2">
        {row1Products.length > 0 && (
          <div
            ref={row1Ref}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          >
            {row1Products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
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
          >
            {row2Products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-[110px]"
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </div>

          {hiddenProducts.length > 0 && (
            <Link
              to={`/category/${categoryId}`}
              className="w-[110px] flex-shrink-0 rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-3 flex flex-col items-center justify-center group"
            >
              <div className="flex mb-2">
                {hiddenProducts.map((p, i) => (
                  <div
                    key={p.id}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white"
                    style={{ marginLeft: i ? -8 : 0, zIndex: 10 - i }}
                  >
                    <img
                      src={p.images?.[0] || '/placeholder.png'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <span className="text-xs font-black mb-1">
                See all products
              </span>
              <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}