// src/components/customer/ProductCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem, updateQuantity, getItemQuantity, removeItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const quantity = getItemQuantity(product.id);
  
  const discount =
    product.discountPrice && product.price ?
    Math.round(((product.price - product.discountPrice) / product.price) * 100) :
    null;
  
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    
    if (quantity === 0) addItem(product, 1);
    else updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity === 1) removeItem(product.id);
    else updateQuantity(product.id, quantity - 1);
  };
  
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };
  
  return (
    <Link
      to={`/product/${product.slug}`}
      className="block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-md transition"
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-square bg-neutral-50 p-3">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />

        {/* TAG (top-left) */}
        {product.tags?.length > 0 && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">
            {product.tags[0]}
          </div>
        )}

        {/* WISHLIST (top-right) */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'
            }`}
          />
        </button>

        {/* ADD / COUNTER (bottom-right) */}
        <AnimatePresence>
          {quantity === 0 ? (
            <motion.button
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`absolute bottom-2 right-2 px-4 py-1.5 rounded-lg text-[11px] font-black ${
                product.stock === 0
                  ? 'bg-neutral-200 text-neutral-400'
                  : 'bg-neutral-900 text-white hover:bg-orange-500'
              }`}
            >
              ADD
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="absolute bottom-2 right-2 flex items-center bg-green-500 rounded-lg shadow"
            >
              <button
                onClick={handleDecrease}
                className="p-1.5 text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-2 text-white font-black text-sm">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="p-1.5 text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INFO SECTION */}
      <div className="p-3">
        {/* 30 mins + weight */}
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center gap-1 text-[9px] text-neutral-500 font-semibold">
            <Clock className="w-3 h-3" /> 30 mins
          </span>

          {product.weight && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
              {product.weight}
            </span>
          )}
        </div>

        {/* PRODUCT NAME */}
        <h3 className="text-[13px] text-neutral-800 leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* DISCOUNT */}
        {discount && (
          <span className="inline-block text-[9px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-1">
            {discount}% OFF
          </span>
        )}

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-black text-neutral-900">
            Rs.{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-[10px] text-neutral-400 line-through">
              Rs.{product.price}
            </span>
          )}
        </div>

        {/* RATING */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-[10px] text-neutral-700">
              {product.rating}
            </span>
            <span className="text-[9px] text-neutral-400">😊</span>
          </div>
        )}
      </div>
    </Link>
  );
}