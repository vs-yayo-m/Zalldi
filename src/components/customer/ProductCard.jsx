import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Zap, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatters';

export default function ProductCard({ product }) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  // Constants for design precision
  const hasDiscount = !!product.discountPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 0) updateQuantity(product.id, quantity - 1);
  };

  return (
    <motion.div
      layout
      className="group relative bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-neutral-200/40 transition-all duration-300"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* 1. PRODUCT IMAGE CONTAINER */}
        <div className="relative aspect-[4/3] bg-neutral-50 overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />

          {/* DISCOUNT BADGE - Minimalist */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </div>
          )}

          {/* DELIVERY TIME - Very Small/Pill */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md border border-neutral-100 px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            <Zap className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
            <span className="text-[8px] font-black uppercase text-neutral-800 tracking-tighter">
              {product.deliveryTime || '10 Mins'}
            </span>
          </div>

          {/* 5. BLINKIT-STYLE CTA (Floating Action) */}
          <div className="absolute bottom-2 right-2">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="h-8 px-4 bg-white border border-orange-500 text-orange-600 font-black text-xs rounded-xl shadow-sm hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:border-neutral-300 disabled:text-neutral-400"
                >
                  {product.stock === 0 ? 'OUT' : 'ADD'}
                </motion.button>
              ) : (
                <motion.div
                  key="stepper"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="h-8 bg-orange-500 text-white flex items-center rounded-xl overflow-hidden shadow-lg shadow-orange-200"
                >
                  <button 
                    onClick={handleDecrement}
                    className="w-8 h-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="w-6 text-center text-xs font-black">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-8 h-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 2 & 3. PRODUCT INFO AREA */}
        <div className="p-3">
          {/* RATING & STOCK - Tiny secondary row */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-bold text-neutral-500">
                {product.rating || '4.5'}
              </span>
            </div>
            
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest">
                Only {product.stock} left
              </span>
            )}
          </div>

          <h3 className="text-xs font-bold text-neutral-800 line-clamp-1 mb-0.5 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mb-2">
            {product.unit || '1 pc'}
          </p>

          {/* 4. PRICING */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-neutral-900">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-neutral-400 line-through font-medium">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

