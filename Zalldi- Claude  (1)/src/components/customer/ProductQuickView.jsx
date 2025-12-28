// src/components/customer/ProductQuickView.jsx

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import PriceDisplay from './PriceDisplay'
import RatingStars from './RatingStars'
import QuantitySelector from './QuantitySelector'
import StockIndicator from './StockIndicator'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function ProductQuickView({ product, isOpen, onClose }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
    onClose()
  }
  
  if (!product) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-neutral-50">
                <img
                  src={product.images?.[selectedImage] || '/placeholder.png'}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />

                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index
                            ? 'border-orange-500'
                            : 'border-neutral-200 hover:border-orange-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                {product.category && (
                  <Badge variant="outline">{product.category}</Badge>
                )}

                <h2 className="text-2xl font-bold text-neutral-800">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4">
                  <RatingStars rating={product.rating || 0} showValue />
                  <span className="text-neutral-600 text-sm">
                    {product.reviewCount || 0} reviews
                  </span>
                </div>

                <PriceDisplay
                  price={product.price}
                  discountPrice={product.discountPrice}
                  size="md"
                  showSavings
                />

                <StockIndicator stock={product.stock} />

                <p className="text-neutral-700 text-sm leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-4 border-t border-neutral-200 space-y-4">
                  <QuantitySelector
                    quantity={quantity}
                    onChange={setQuantity}
                    min={product.minOrder || 1}
                    max={Math.min(product.stock, product.maxOrder || 100)}
                  />

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    icon={<ShoppingCart className="w-5 h-5" />}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 