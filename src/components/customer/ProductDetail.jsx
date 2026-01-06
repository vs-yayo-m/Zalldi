// src/components/customer/ProductDetail.jsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Share2, Star, ChevronDown, ChevronRight, X, 
  Plus, Minus, Clock, Shield, Truck, Package, Check
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function ProductDetail({ product }) {
  const { items, addItem, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [activeImage, setActiveImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  
  const doubleTapTimer = useRef(null);
  const images = product.images?.length ? product.images : [product.image];
  
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const inCart = quantity > 0;
  
  const discount = product.discountPrice && product.price 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  
  const finalPrice = product.discountPrice || product.price;
  const isLowStock = product.stock < 10 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const handleImageDoubleTap = () => {
    if (doubleTapTimer.current) {
      clearTimeout(doubleTapTimer.current);
      doubleTapTimer.current = null;
      
      toggleWishlist(product);
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 600);
      toast.success(isInWishlist(product.id) ? '💔 Removed' : '❤️ Added to wishlist');
    } else {
      doubleTapTimer.current = setTimeout(() => {
        doubleTapTimer.current = null;
      }, 300);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({ ...product, quantity: 1 });
    toast.success('Added to cart');
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty <= 0) {
      updateQuantity(product.id, 0);
    } else if (newQty <= product.stock) {
      updateQuantity(product.id, newQty);
    } else {
      toast.error('Stock limit reached');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Zalldi`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        
        {/* LEFT: Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100">
            <motion.img
              key={activeImage}
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageDoubleTap}
              onDoubleClick={() => setShowZoom(true)}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Double-tap heart burst */}
            <AnimatePresence>
              {heartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Heart className="w-20 h-20 fill-red-500 text-red-500 drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <div className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-lg">
                  {discount}% OFF
                </div>
              )}
              {product.tags?.[0] && (
                <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                  {product.tags[0]}
                </div>
              )}
            </div>

            {/* Top right actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  toggleWishlist(product);
                  toast.success(isInWishlist(product.id) ? 'Removed' : 'Added');
                }}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isInWishlist(product.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-neutral-600'
                  }`}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 text-neutral-600" />
              </motion.button>
            </div>

            {/* Delivery time badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-neutral-900">21 mins</span>
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === idx 
                      ? 'border-orange-500 shadow-md' 
                      : 'border-neutral-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col">
          {/* Title & Weight */}
          <div className="mb-3">
            <h1 className="text-xl font-bold text-neutral-900 leading-tight mb-2">
              {product.name}
            </h1>
            {product.unit && (
              <div className="inline-flex items-center bg-neutral-100 text-neutral-700 text-sm font-bold px-3 py-1 rounded-full">
                {product.minOrder} {product.unit}
              </div>
            )}
          </div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-green-600 text-green-600" />
                <span className="text-sm font-bold text-green-700">{product.rating}</span>
              </div>
              <span className="text-sm text-neutral-500">
                {product.reviewCount || 0} ratings
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-neutral-900">
                {formatCurrency(finalPrice)}
              </span>
              {discount > 0 && (
                <span className="text-lg text-neutral-400 line-through font-medium">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">Inclusive of all taxes</p>
          </div>

          {/* Stock indicator */}
          <div className="mb-5">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-red-600 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                Out of stock
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-orange-600 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-orange-600" />
                Only {product.stock} left
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                In stock
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Shield, label: 'Quality assured', color: 'text-green-600' },
              { icon: Truck, label: '1 hr delivery', color: 'text-orange-600' },
              { icon: Package, label: 'Easy returns', color: 'text-blue-600' }
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 bg-neutral-50 rounded-xl">
                <badge.icon className={`w-5 h-5 mb-1 ${badge.color}`} />
                <span className="text-xs font-bold text-neutral-700">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Add to Cart / Quantity Selector */}
          <div className="mt-auto">
            <AnimatePresence mode="wait">
              {!inCart ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full h-14 rounded-2xl font-black text-lg shadow-lg transition-all ${
                    isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>
              ) : (
                <motion.div
                  key="qty-selector"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between bg-orange-500 rounded-2xl p-2 shadow-lg"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"
                  >
                    <Minus className="w-5 h-5 text-orange-600" />
                  </motion.button>
                  <span className="text-xl font-black text-white">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"
                  >
                    <Plus className="w-5 h-5 text-orange-600" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Details Button */}
          <button
            onClick={() => setShowDetails(true)}
            className="mt-4 flex items-center justify-center gap-2 text-orange-600 font-bold text-sm hover:gap-3 transition-all"
          >
            View product details
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoom(false)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={images[activeImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setShowZoom(false); }}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end lg:items-center lg:justify-center"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl lg:rounded-3xl w-full lg:max-w-2xl max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-neutral-900">Product Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {product.description && (
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-2">Description</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.metadata?.features && (
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-2">Features</h4>
                    <ul className="space-y-2">
                      {product.metadata.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Category</p>
                    <p className="text-sm font-bold text-neutral-900">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">SKU</p>
                    <p className="text-sm font-bold text-neutral-900">{product.sku}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}