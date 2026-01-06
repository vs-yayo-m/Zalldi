// src/components/customer/ProductDetail.jsx
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, Star, ChevronDown, Zap, ShieldCheck, Feather } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'react-hot-toast'

export default function ProductDetail({ product }) {
  const { addItem, updateItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [openDetails, setOpenDetails] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [heartBurst, setHeartBurst] = useState(false)
  const doubleTapRef = useRef({ last: 0 })
  const longPressTimer = useRef(null)
  
  const images = product.images && product.images.length ? product.images : [product.image]
  const discountPercent = product.price && product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0
  
  useEffect(() => {
    setActiveImage(0)
    setQty(1)
    setIsAdded(false)
  }, [product.id])
  
  // ----- ADD TO CART with morph
  const handleAddToCart = () => {
    addItem({ ...product, quantity: qty })
    setIsAdded(true)
    toast.success('Added to cart')
  }
  
  const handleQtyChange = (newQty) => {
    setQty(newQty)
    if (isAdded) updateItem(product.id, { quantity: newQty })
  }
  
  // ----- Double tap wishlist
  const handleImageTap = () => {
    const now = Date.now()
    const delta = now - (doubleTapRef.current.last || 0)
    doubleTapRef.current.last = now
    if (delta < 300) {
      toggleWishlist(product)
      setHeartBurst(true)
      toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist')
      setTimeout(() => setHeartBurst(false), 800)
    }
  }
  
  // ----- Long press zoom
  const handleImageTouchStart = () => {
    longPressTimer.current = setTimeout(() => setZoomOpen(true), 400)
  }
  const handleImageTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }
  
  // ----- Zoom modal controls
  const toggleZoom = () => setZoomOpen(prev => !prev)
  const increaseZoom = () => setZoomScale(s => Math.min(4, s + 0.5))
  const decreaseZoom = () => setZoomScale(s => Math.max(1, s - 0.5))
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ---------- IMAGE GALLERY ---------- */}
      <div className="relative">
        <div
          className="relative overflow-hidden rounded-2xl touch-manipulation cursor-pointer"
          onClick={handleImageTap}
          onTouchStart={handleImageTouchStart}
          onTouchEnd={handleImageTouchEnd}
          onMouseDown={handleImageTouchStart}
          onMouseUp={handleImageTouchEnd}
        >
          <motion.img
            key={activeImage}
            src={images[activeImage]}
            alt={product.name}
            className="w-full aspect-square object-cover"
            initial={{ opacity: 0.8, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          />

          {/* Heart burst */}
          <AnimatePresence>
            {heartBurst && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="w-24 h-24 text-white drop-shadow-xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top left tag */}
          {product.tags?.length > 0 && (
            <div className="absolute top-4 left-4 bg-green-200/50 px-3 py-1 rounded-full text-xs font-bold text-green-700">
              {product.tags[0]}
            </div>
          )}

          {/* Top right wishlist */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => { toggleWishlist(product); toast.success(isInWishlist(product.id) ? 'Removed' : 'Added') }}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied') }}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Top discount */}
          {discountPercent > 0 && (
            <div className="absolute top-14 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {discountPercent}% OFF
            </div>
          )}

          {/* Bottom right Add-to-Cart */}
          <div className="absolute bottom-4 right-4">
            <motion.button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white font-black rounded-xl py-2 px-4"
            >
              Add
            </motion.button>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${activeImage === idx ? 'border-green-600 scale-105' : 'border-neutral-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- DETAILS ---------- */}
      <div className="space-y-4">
        {/* Name & Weight row */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-normal text-neutral-900">{product.name}</h1>
          {product.weight && (
            <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{product.weight}</div>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-green-600 text-green-600" />
              <span className="text-xs font-bold text-green-700 ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-neutral-500">{product.reviewCount || 0} ratings</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-neutral-900">{formatCurrency(product.discountPrice)}</span>
          {product.price && <span className="text-sm text-neutral-400 line-through">{formatCurrency(product.price)}</span>}
        </div>
      </div>
    </div>
  )
}