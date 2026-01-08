// src/components/home/DualRowCategoryShowcase.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/customer/ProductCard';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const CATEGORY_ROWS = [
  {
    id: 'row-1',
    title: 'Snacks & Beverages',
    categories: [
      { id: 'chips-namkeen', name: 'Chips & Namkeen' },
      { id: 'instant-food', name: 'Instant Food' },
      { id: 'drinks-juices', name: 'Drinks & Juices' }
    ]
  },
  {
    id: 'row-2', 
    title: 'Beauty & Essentials',
    categories: [
      { id: 'skin-face', name: 'Skin & Face' },
      { id: 'beauty-cosmetics', name: 'Beauty & Cosmetics' },
      { id: 'flour-rice-dal', name: 'Atta, Rice & Dal' }
    ]
  }
];

function CategoryRow({ rowData }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const allProducts = [];

      for (const category of rowData.categories) {
        try {
          const productsRef = collection(db, 'products');
          const q = query(
            productsRef,
            where('category', '==', category.id),
            where('active', '==', true),
            orderBy('rating', 'desc'),
            limit(8)
          );

          const snapshot = await getDocs(q);
          const categoryProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            slug: doc.data().slug || doc.id,
            ...doc.data()
          }));

          allProducts.push(...categoryProducts);
        } catch (error) {
          console.error(`Error loading ${category.name}:`, error.message);
        }
      }

      allProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setProducts(allProducts.slice(0, 24));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="h-5 w-48 bg-neutral-200 rounded animate-pulse mb-3" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[170px]">
              <div className="bg-neutral-100 rounded-xl aspect-square mb-2 animate-pulse" />
              <div className="h-3 bg-neutral-100 rounded mb-2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mb-6 relative group">
      <h3 className="text-sm sm:text-base font-black text-neutral-900 tracking-tight mb-3">
        {rowData.title}
      </h3>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-xl rounded-full items-center justify-center text-neutral-700 hover:text-orange-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-2.5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[170px]"
            >
              <ProductCard product={product} compact={true} />
            </motion.div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-xl rounded-full items-center justify-center text-neutral-700 hover:text-orange-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function DualRowCategoryShowcase() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 bg-white"
    >
      <div className="container mx-auto px-4">
        {CATEGORY_ROWS.map((row) => (
          <CategoryRow key={row.id} rowData={row} />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
}