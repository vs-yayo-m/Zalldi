// src/components/customer/ProductCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function ProductCard({ product, compact = false }) {
  const { addItem, updateQuantity, getItemQuantity, removeItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const quantity = getItemQuantity(product.id);
  
  const discount =
    product.discountPrice && product.price ?
    Math.round(((product.price - product.discountPrice) / product.price) * 100) :
    null;
  
  const stockBadge = () => {
    if (product.stock === 0)
      return { text: 'Out of stock', cls: 'bg-red-50 text-red-600 border-red-100' };
    if (product.stock < 10)
      return {
        text: `Only ${product.stock} left`,
        cls: 'bg-orange-50 text-orange-600 border-orange-100',
      };
    return { text: 'In stock', cls: 'bg-green-50 text-green-600 border-green-100' };
  };
  
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return toast.error('Out of stock');
    quantity === 0 ? addItem(product, 1) : updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1);
  };
  
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };
  
  const stockInfo = stockBadge();
  
  return (
    <Link
      to={`/product/${product.slug}`}
      className="block bg-white rounded-2xl border border-neutral-100 overflow-hidden transition hover:shadow-md"
    >
      {/* IMAGE */}
      <div className="relative aspect-square bg-neutral-50 p-3">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />

        {/* TAG (top-left) */}
        {product.tags?.length > 0 && (
          <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50/60 text-green-700 border border-green-100">
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

        {/* ADD / QUANTITY (bottom-right) */}
        <AnimatePresence>
          {quantity === 0 ? (
            <motion.button
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={handleAdd}
              className="absolute bottom-2 right-2 px-4 py-1.5 rounded-lg text-[11px] font-black bg-neutral-900 text-white hover:bg-orange-500"
            >
              ADD
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="absolute bottom-2 right-2 flex items-center gap-2 bg-green-500 rounded-lg"
            >
              <button onClick={handleDecrease} className="p-1.5 text-white">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-black text-sm">{quantity}</span>
              <button onClick={handleAdd} className="p-1.5 text-white">
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        {/* DELIVERY + WEIGHT */}
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span className="text-[9px] font-bold text-neutral-500 uppercase">30 mins</span>

          {product.weight && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50/60 text-green-700 border border-green-100">
              {product.weight}
            </span>
          )}
        </div>

        {/* NAME */}
        <h3 className="text-[13px] font-normal text-neutral-800 leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* DISCOUNT + STOCK */}
        <div className="flex items-center gap-2 mb-1">
          {discount && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
              {discount}% OFF
            </span>
          )}

          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${stockInfo.cls}`}
          >
            {stockInfo.text}
          </span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black text-neutral-900">
            Rs.{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-[11px] text-neutral-400 line-through">
              Rs.{product.price}
            </span>
          )}
        </div>

        {/* RATING (unchanged) */}
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
  
  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl border border-neutral-100 hover:border-orange-500 hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        <Link to={`/product/${product.slug}`} className="block">
          {/* Image */}
          <div className="relative aspect-square bg-neutral-50 overflow-hidden">
            <img
              src={product.images?.[0] || '/placeholder-product.png'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-lg">
                {product.discount}% OFF
              </div>
            )}

            {/* Quick Add Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="absolute bottom-2 right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-2">
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                <span className="text-xs font-bold text-neutral-700">{product.rating.toFixed(1)}</span>
              </div>
            )}

            {/* Name */}
            <h3 className="text-xs font-bold text-neutral-800 line-clamp-2 mb-1 leading-tight">
              {product.name}
            </h3>

            {/* Unit */}
            {product.unit && (
              <p className="text-xs text-neutral-500 mb-2">{product.unit}</p>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-neutral-900">
                ₹{product.price}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{product.comparePrice}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

}