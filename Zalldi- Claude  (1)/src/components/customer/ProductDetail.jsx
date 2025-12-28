// src/components/customer/ProductDetail.jsx

import React, { useState } from 'react'
import { Share2, Heart, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { toast } from 'react-hot-toast'
import ProductGallery from './ProductGallery'
import PriceDisplay from './PriceDisplay'
import RatingStars from './RatingStars'
import QuantitySelector from './QuantitySelector'
import DeliveryBadge from './DeliveryBadge'
import StockIndicator from './StockIndicator'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function ProductDetail({ product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  
  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <ProductGallery images={product.images} />
      </div>

      <div className="space-y-6">
        <div>
          {product.category && (
            <Badge variant="outline" className="mb-3">
              {product.category}
            </Badge>
          )}
          
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <RatingStars rating={product.rating || 0} showValue />
            <span className="text-neutral-600">
              {product.reviewCount || 0} reviews
            </span>
          </div>

          <PriceDisplay
            price={product.price}
            discountPrice={product.discountPrice}
            size="lg"
            showSavings
          />
        </div>

        <div className="border-t border-b border-neutral-200 py-4 space-y-3">
          <DeliveryBadge />
          <StockIndicator stock={product.stock} />
        </div>

        <div>
          <p className="text-neutral-700 leading-relaxed">
            {product.description}
          </p>
        </div>

        {product.metadata && (
          <div className="space-y-2">
            {product.metadata.brand && (
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Brand</span>
                <span className="font-medium text-neutral-800">{product.metadata.brand}</span>
              </div>
            )}
            {product.unit && (
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Unit</span>
                <span className="font-medium text-neutral-800">{product.unit}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">SKU</span>
                <span className="font-medium text-neutral-800">{product.sku}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              min={product.minOrder || 1}
              max={Math.min(product.stock, product.maxOrder || 100)}
            />

            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
            >
              Add to Cart
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              icon={<Heart className="w-5 h-5" />}
              className="flex-1"
            >
              Add to Wishlist
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              icon={<Share2 className="w-5 h-5" />}
            >
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Truck className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800 text-sm">Fast Delivery</p>
              <p className="text-xs text-neutral-600">Within 1 hour</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800 text-sm">Secure Payment</p>
              <p className="text-xs text-neutral-600">100% Protected</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <RotateCcw className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800 text-sm">Easy Returns</p>
              <p className="text-xs text-neutral-600">7 Days Return</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}