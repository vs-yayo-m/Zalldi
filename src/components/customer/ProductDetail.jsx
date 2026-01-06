// src/components/customer/ProductDetail.jsx
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Share2,
  Star,
  ChevronDown,
  Zap,
  ShieldCheck,
  Feather
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'react-hot-toast'

/**
 * Features implemented:
 * - discountPrice shown as main selling price (product.discountPrice)
 * - Add-to-cart morph animation -> button morphs to qty selector after add
 * - Double-tap on image toggles wishlist with heart burst animation
 * - Long-press or tap -> open zoom modal where user can pinch/zoom (basic CSS zoom)
 * - Heart overlay / animated feedback on wishlist
 */

export default function ProductDetail({ product }) {
  const { addItem, updateItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { user } = useAuth && useAuth() // optional, used for analytics/personalization elsewhere
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [openDetails, setOpenDetails] = useState(false)
  const [isAdded, setIsAdded] = useState(false) // used to show morph
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [heartBurst, setHeartBurst] = useState(false)
  const doubleTapRef = useRef({ last: 0 })
  const longPressTimer = useRef(null)

  const images = product.images && product.images.length ? product.images : [product.image]

  const discountPercent =
    product.price && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0

  useEffect(() => {
    // reset state when product changes
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
    // if already in cart update quantity
    if (isAdded) {
      updateItem(product.id, { quantity: newQty })
    }
  }

  // ----- Double tap to toggle wishlist (heart burst)
  const handleImageTap = (e) => {
    const now = Date.now()
    const delta = now - (doubleTapRef.current.last || 0)
    doubleTapRef.current.last = now

    if (delta < 300) {
      // considered double tap
      toggleWishlist(product)
      setHeartBurst(true)
      toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist')
      setTimeout(() => setHeartBurst(false), 800)
    } else {
      // single tap: no-op (or open zoom on single tap if desired)
      // we don't open zoom on single tap to avoid conflict with double-tap
    }
  }

  // ----- Long press to open zoom (mobile friendly)
  const handleImageTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setZoomOpen(true)
    }, 400) // 400ms long press
  }
  const handleImageTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  // ----- Zoom modal handlers
  const toggleZoom = () => {
    setZoomOpen(prev => !prev)
    setZoomScale(1)
  }
  const increaseZoom = () => setZoomScale(s => Math.min(4, s + 0.5))
  const decreaseZoom = () => setZoomScale(s => Math.max(1, s - 0.5))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ---------- GALLERY ---------- */}
      <div className="relative">
        <div
          className="relative overflow-hidden rounded-2xl touch-manipulation"
          role="button"
          tabIndex={0}
        >
          <motion.img
            key={activeImage}
            src={images[activeImage]}
            alt={product.name}
            className="w-full aspect-square object-cover"
            initial={{ opacity: 0.7, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28 }}
            onClick={handleImageTap}
            onTouchStart={handleImageTouchStart}
            onTouchEnd={handleImageTouchEnd}
            onMouseDown={handleImageTouchStart}
            onMouseUp={handleImageTouchEnd}
            style={{ userSelect: 'none' }}
          />

          {/* heart burst animation (visible on double-tap) */}
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

          {/* wishlist & share floating icons (tap targets) */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => { toggleWishlist(product); toast.success(isInWishlist(product.id) ? 'Removed' : 'Added') }}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({ title: product.name, text: product.description, url: window.location.href })
                  } catch (e) {}
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copied')
                }
              }}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* discount badge */}
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* thumbnail strip */}
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
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-neutral-900">{product.name}</h1>
          <p className="text-sm text-neutral-500">{product.unit}</p>
        </div>

        {/* rating */}
        {product.rating && (
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-green-600 text-green-600" />
              <span className="text-sm font-bold text-green-700 ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-neutral-500">{product.reviewCount || 0} ratings</span>
          </div>
        )}

        {/* price area (discountPrice is main selling price) */}
        <div className="flex items-end gap-3">
          <div>
            <div className="text-3xl font-black text-neutral-900">
              {formatCurrency(product.discountPrice)}
            </div>
            {product.price && (
              <div className="text-sm text-neutral-400 line-through mt-1">{formatCurrency(product.price)}</div>
            )}
          </div>
        </div>

        {/* trust badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
            <Zap className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-xs font-bold">Fast delivery</div>
              <div className="text-xs text-neutral-500">Within 1 hour</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-xs font-bold">Quality assured</div>
              <div className="text-xs text-neutral-500">Sourced fresh</div>
            </div>
          </div>
        </div>

        {/* accordion for details (chunked bullets) */}
        <button onClick={() => setOpenDetails(!openDetails)} className="flex items-center justify-between w-full font-bold text-green-600">
          <span>View product details</span>
          <ChevronDown className={`${openDetails ? 'rotate-180' : ''} transition-transform`} />
        </button>

        <AnimatePresence>
          {openDetails && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-sm text-neutral-600 space-y-3">
              {/* chunked information: overview, usage, storage */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Overview</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {(product.features && product.features.slice(0, 4))?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 mb-1">How to use</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {(product.usage || ['Use as directed']).slice(0, 3).map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Storage</h4>
                <div className="text-xs text-neutral-600">Keep in cool & dry place.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- CTA / Add-to-cart morph ---------- */}
        <div className="pt-2">
          <motion.div layout className="flex items-center gap-3">
            {/* quantity box (visible after add or when user taps) */}
            <AnimatePresence initial={false}>
              {isAdded ? (
                <motion.div
                  key="qty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center border border-neutral-200 rounded-xl overflow-hidden"
                >
                  <button onClick={() => handleQtyChange(Math.max(1, qty - 1))} className="px-4 py-3 font-bold">−</button>
                  <div className="px-5 py-3 font-bold">{qty}</div>
                  <button onClick={() => handleQtyChange(qty + 1)} className="px-4 py-3 font-bold">+</button>
                </motion.div>
              ) : (
                <motion.div key="spacer" className="w-0" />
              )}
            </AnimatePresence>

            <motion.button
              layout
              onClick={() => (isAdded ? window.location.href = '/cart' : handleAddToCart())}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl py-4 flex items-center justify-center"
            >
              <motion.span layout>
                {isAdded ? 'Go to cart' : `Add • ${formatCurrency(product.discountPrice)}`}
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ---------- ZOOM MODAL ---------- */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full">
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-3">
                  <Feather className="w-5 h-5" />
                  <div className="font-bold">{product.name}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={decreaseZoom} className="px-3 py-1 rounded bg-neutral-100">-</button>
                  <button onClick={increaseZoom} className="px-3 py-1 rounded bg-neutral-100">+</button>
                  <button onClick={() => setZoomOpen(false)} className="px-3 py-1 rounded bg-neutral-100">Close</button>
                </div>
              </div>

              <div className="p-4 flex items-center justify-center">
                <div style={{ overflow: 'hidden', maxHeight: '70vh' }} className="w-full flex items-center justify-center">
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    style={{ transform: `scale(${zoomScale})`, transition: 'transform 180ms ease' }}
                    className="object-contain max-h-[70vh] w-auto"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}