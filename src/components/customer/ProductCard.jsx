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
  
  if (compact) {
    return (
      <Link
        to={`/product/${product.slug}`}
        className="block bg-white rounded-xl border border-neutral-100 overflow-hidden transition hover:shadow-md"
      >
        <div className="relative aspect-square bg-neutral-50 p-2">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />

          {product.tags?.length > 0 && (
            <div className="absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-green-50/60 text-green-700 border border-green-100">
              {product.tags[0]}
            </div>
          )}

          <button
            onClick={handleWishlist}
            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm"
          >
            <Heart
              className={`w-3 h-3 ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'
              }`}
            />
          </button>

          <AnimatePresence>
            {quantity === 0 ? (
              <motion.button
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={handleAdd}
                className="absolute bottom-1 right-1 px-3 py-1 rounded-lg text-[10px] font-black bg-neutral-900 text-white hover:bg-orange-500"
              >
                ADD
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="absolute bottom-1 right-1 flex items-center gap-1 bg-green-500 rounded-lg"
              >
                <button onClick={handleDecrease} className="p-1 text-white">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-white font-black text-xs">{quantity}</span>
                <button onClick={handleAdd} className="p-1 text-white">
                  <Plus className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-2">
          <div className="flex items-center gap-1 mb-0.5">
            <Clock className="w-2.5 h-2.5 text-neutral-400" />
            <span className="text-[8px] font-bold text-neutral-500 uppercase">30 mins</span>

            {product.weight && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-green-50/60 text-green-700 border border-green-100">
                {product.weight}
              </span>
            )}
          </div>

          <h3 className="text-[11px] font-normal text-neutral-800 leading-snug line-clamp-2 mb-0.5">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-0.5">
            {discount && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                {discount}% OFF
              </span>
            )}

            <span
              className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${stockInfo.cls}`}
            >
              {stockInfo.text}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[13px] font-black text-neutral-900">
              Rs.{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-[9px] text-neutral-400 line-through">
                Rs.{product.price}
              </span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500 text-[10px]">★</span>
              <span className="text-[9px] font-bold text-neutral-700">
                {product.rating}
              </span>
              {product.reviewCount > 0 && (
                <span className="text-[8px] text-neutral-400">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    );
  }
  
  return (
    <Link
      to={`/product/${product.slug}`}
      className="block bg-white rounded-2xl border border-neutral-100 overflow-hidden transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-neutral-50 p-3">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />

        {product.tags?.length > 0 && (
          <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50/60 text-green-700 border border-green-100">
            {product.tags[0]}
          </div>
        )}

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

      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span className="text-[9px] font-bold text-neutral-500 uppercase">30 mins</span>

          {product.weight && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50/60 text-green-700 border border-green-100">
              {product.weight}
            </span>
          )}
        </div>

        <h3 className="text-[13px] font-normal text-neutral-800 leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

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