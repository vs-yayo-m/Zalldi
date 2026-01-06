// src/components/customer/ProductCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem, updateQuantity, getItemQuantity, removeItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const quantity = getItemQuantity(product.id);
  const discount = product.discountPrice && product.price ?
    Math.round(((product.price - product.discountPrice) / product.price) * 100) :
    null;
  
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    
    if (quantity === 0) {
      addItem(product, 1);
      toast.success('Added to cart');
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };
  
  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity === 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };
  
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };
  
  return (
    <Link
      to={`/product/${product.slug}`}
      className="block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square bg-neutral-50 p-3">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />

        <button
          onClick={handleWishlist}
          className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
          aria-label="toggle wishlist"
        >
          <Heart 
            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`}
          />
        </button>

        {discount && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black">
            {discount}% OFF
          </div>
        )}

        <AnimatePresence>
          {quantity === 0 ? (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`absolute bottom-2 right-2 px-4 py-1.5 rounded-lg text-[11px] font-black transition-colors ${
                product.stock === 0
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-900 text-white hover:bg-orange-500'
              }`}
            >
              ADD
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute bottom-2 right-2 flex items-center gap-2 bg-green-500 rounded-lg shadow-lg"
            >
              <button
                onClick={handleDecrease}
                className="p-1.5 text-white hover:bg-green-600 rounded-l-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-black text-sm min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="p-1.5 text-white hover:bg-green-600 rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span className="text-[9px] font-bold text-neutral-500 uppercase"> 30 mins</span>
        </div>

        {/* Weight badge: very small, rounded, translucent green badge */}
        {product.weight && (
          <div className="mb-1">
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50/60 text-green-700 border border-green-100">
              {product.weight}
            </span>
          </div>
        )}

        <h3 className="text-sm font-bold text-neutral-800 line-clamp-2 mb-1 leading-tight">
          {product.name}
        </h3>
        
        {product.unit && (
          <p className="text-[10px] text-neutral-500 mb-2">
            {product.stock > 0 ? product.unit : 'Out of stock'}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black text-neutral-900">
              Rs.{product.discountPrice || product.price}
            </span>
            {product.discountPrice && product.price && (
              <span className="text-[10px] text-neutral-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {product.stock > 0 && product.stock < 10 && (
            <span className="text-[9px] font-bold text-orange-600">
              Only {product.stock} left
            </span>
          )}
        </div>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-[10px] font-bold text-neutral-700">
              {product.rating}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-[9px] text-neutral-400">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}