// src/components/customer/CartSummary.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/formatters'
import { Truck } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function CartSummary({
  showDelivery = true,
  showCheckout = false,
  className = ''
}) {
  const navigate = useNavigate()
  const { subtotal, deliveryFee, total, items } = useCart()
  
  const isEmpty = !items || items.length === 0
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-neutral-700">
        <span>Subtotal</span>
        <span className="font-semibold">{formatCurrency(subtotal)}</span>
      </div>

      {showDelivery && (
        <div className="flex items-center justify-between text-neutral-700">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Delivery Fee</span>
          </div>
          <span className="font-semibold">
            {deliveryFee === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-3">
        <div className="flex items-center justify-between text-lg font-bold text-neutral-800">
          <span>Total</span>
          <span className="text-orange-500">{formatCurrency(total)}</span>
        </div>
      </div>

      {deliveryFee === 0 && showDelivery && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">
            Congratulations! You've qualified for free delivery
          </p>
        </div>
      )}

      {/* ✅ BUY / CHECKOUT BUTTON */}
      {showCheckout && (
        <Button
          size="lg"
          className="w-full"
          disabled={isEmpty}
          onClick={() => navigate('/checkout')}
        >
          {isEmpty ? 'Cart is Empty' : 'Proceed to Checkout'}
        </Button>
      )}
    </div>
  )
}