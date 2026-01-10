// src/components/customer/BillSummary.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Receipt } from 'lucide-react'
import { formatCurrency } from '@utils/formatters'

export default function BillSummary({ pricing }) {
  const [expanded, setExpanded] = useState(false)
  
  const {
    mrpTotal,
    subtotal,
    discount,
    discountPercent,
    fulfillmentFee,
    deliveryFee,
    giftFee,
    tip,
    total,
    savings
  } = pricing
  
  return (
    <div className="mx-3 mt-3">
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Collapsed View */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-green-700" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-neutral-900">
                {formatCurrency(total)}
              </div>
              {savings > 0 && (
                <div className="text-[10px] font-bold text-green-600">
                  You saved {formatCurrency(savings)} (-{discountPercent}%)
                </div>
              )}
            </div>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          </motion.div>
        </button>

        {/* Expanded View */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-neutral-100"
            >
              <div className="p-4 space-y-3 text-xs">
                {/* MRP */}
                <div className="flex items-center justify-between text-neutral-600">
                  <span>MRP (Original Price)</span>
                  <span className="font-bold">{formatCurrency(mrpTotal)}</span>
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount (Save {discountPercent}%)</span>
                    <span className="font-bold">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="border-t border-dashed border-neutral-200 my-2" />

                {/* Subtotal */}
                <div className="flex items-center justify-between font-bold text-neutral-900">
                  <span>Subtotal (Selling Price)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="border-t border-dashed border-neutral-200 my-2" />

                {/* Fulfillment Fee */}
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Fulfillment Fee</span>
                  <span className="font-bold">{formatCurrency(fulfillmentFee)}</span>
                </div>

                {/* Delivery Fee */}
                <div className="flex items-center justify-between text-neutral-600">
                  <div className="flex flex-col">
                    <span>Standard Delivery</span>
                    {deliveryFee === 0 && (
                      <span className="text-[9px] text-green-600 font-bold">
                        Free on orders above Rs. 599
                      </span>
                    )}
                  </div>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>

                {/* Gift Packaging */}
                {giftFee > 0 && (
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Gift Packaging</span>
                    <span className="font-bold">{formatCurrency(giftFee)}</span>
                  </div>
                )}

                {/* Tip */}
                {tip > 0 && (
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Tip for Delivery Partner</span>
                    <span className="font-bold">{formatCurrency(tip)}</span>
                  </div>
                )}

                <div className="border-t border-neutral-200 my-3" />

                {/* Final Total */}
                <div className="flex items-center justify-between text-base font-black text-neutral-900">
                  <span>Final Payable Amount</span>
                  <span className="text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Savings Badge */}
      {savings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200 text-center"
        >
          <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">
            🎉 Total Savings: {formatCurrency(savings)} on this order
          </span>
        </motion.div>
      )}
    </div>
  )
}