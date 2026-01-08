// src/components/home/SubcategoryProductSlider.jsx

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function SubcategoryProductSlider({
  title,
  subcategoryId,
  products = [],
  viewAllLink
}) {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const handleScroll = () => {
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
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart!`);
  };
  
  const handleWishlistToggle = (product, e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };
  
  const calculateDiscount = (price, mrp) => {
    if (!mrp || mrp <= price) return null;
    return Math.round(((mrp - price) / mrp) * 100);
  };
  
  if (!products || products.length === 0) return null;
  
  return (
    <section className="mb-8 lg:mb-12">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-neutral-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-neutral-500 font-medium mt-1">
            {products.length} products available
          </p>
        </div>
        {viewAllLink && (
          <button
            onClick={() => navigate(viewAllLink)}
            className="text-orange-600 hover:text-orange-700 font-bold text-sm transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full items-center justify-center text-neutral-700 hover:text-orange-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full items-center justify-center text-neutral-700 hover:text-orange-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => {
            const discount = calculateDiscount(product.price, product.mrp);
            const inWishlist = isInWishlist(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-none w-[280px] lg:w-[300px]"
              >
                <div
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="group/card relative bg-white rounded-2xl border-2 border-neutral-100 hover:border-orange-500 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(product, e)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        inWishlist
                          ? 'fill-orange-500 text-orange-500'
                          : 'text-neutral-400 hover:text-orange-500'
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <div className="aspect-square relative overflow-hidden bg-neutral-50 rounded-t-xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f5f5f5" width="300" height="300"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {discount && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-black shadow-lg">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Delivery Time */}
                    {product.deliveryTime && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-bold">{product.deliveryTime} MINS</span>
                      </div>
                    )}

                    {/* Product Name & Quantity */}
                    <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    {product.quantity && (
                      <p className="text-xs text-neutral-500 font-medium mb-3">
                        {product.quantity}
                      </p>
                    )}

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-neutral-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-neutral-400 line-through font-medium">
                              MRP {formatCurrency(product.mrp)}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(product, e)}
                        className="px-5 py-2 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-lg flex items-center gap-1"
                      >
                        ADD
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}