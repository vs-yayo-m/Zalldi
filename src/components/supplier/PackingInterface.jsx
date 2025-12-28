// src/components/supplier/PackingInterface.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Printer,
  Scale,
  Box,
  ShieldCheck
} from 'lucide-react'
import { formatCurrency } from '@utils/formatters'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'

export default function PackingInterface({ order, onComplete, onPrint }) {
  const [checkedItems, setCheckedItems] = useState({})
  const [packingNotes, setPackingNotes] = useState('')
  const [fragileItems, setFragileItems] = useState({})
  
  const toggleItemChecked = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }
  
  const toggleFragile = (itemId) => {
    setFragileItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }
  
  const totalItems = order.items.length
  const checkedCount = Object.values(checkedItems).filter(Boolean).length
  const allItemsChecked = checkedCount === totalItems
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-heading font-semibold">Packing Station</h3>
            <p className="text-white/90 mt-1">
              Order {order.orderNumber}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            className="bg-white text-primary-600 hover:bg-neutral-100"
          >
            <Printer className="w-4 h-4" />
            <span className="ml-2">Print Label</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5" />
              <span className="text-body-sm font-medium">Items</span>
            </div>
            <p className="text-display font-bold">{totalItems}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-body-sm font-medium">Checked</span>
            </div>
            <p className="text-display font-bold">{checkedCount}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5" />
              <span className="text-body-sm font-medium">Value</span>
            </div>
            <p className="text-body font-bold">{formatCurrency(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h4 className="text-body font-semibold text-neutral-800 mb-4">Packing Checklist</h4>
        
        <div className="space-y-3">
          {order.items.map((item, index) => {
            const isChecked = checkedItems[item.productId]
            const isFragile = fragileItems[item.productId]

            return (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isChecked
                    ? 'border-green-300 bg-green-50'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleItemChecked(item.productId)}
                    className="mt-1 flex-shrink-0"
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'border-green-600 bg-green-600'
                        : 'border-neutral-300 bg-white'
                    }`}>
                      {isChecked && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>

                  <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || '/placeholder-product.png'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className={`text-body font-semibold ${
                      isChecked ? 'text-green-900' : 'text-neutral-800'
                    }`}>
                      {item.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        Qty: {item.quantity}
                      </Badge>
                      <span className="text-body-sm text-neutral-600">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFragile(item.productId)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFragile
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    title="Mark as fragile"
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h4 className="text-body font-semibold text-neutral-800 mb-4">
          Packing Instructions
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <Box className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-body font-medium text-blue-900 mb-1">Box Selection</p>
              <p className="text-body-sm text-blue-700">
                Use appropriate box size to prevent item movement during delivery
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-body font-medium text-amber-900 mb-1">Fragile Items</p>
              <p className="text-body-sm text-amber-700">
                {Object.values(fragileItems).filter(Boolean).length > 0
                  ? `${Object.values(fragileItems).filter(Boolean).length} fragile items - Use bubble wrap and "Fragile" stickers`
                  : 'No fragile items in this order'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-body font-medium text-green-900 mb-1">Quality Check</p>
              <p className="text-body-sm text-green-700">
                Verify all items match the order list and are in good condition
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-body font-medium text-neutral-800 mb-2">
            Packing Notes (Optional)
          </label>
          <textarea
            value={packingNotes}
            onChange={(e) => setPackingNotes(e.target.value)}
            placeholder="Add any notes about the packing..."
            rows={3}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-6 rounded-t-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body text-neutral-700">Progress</span>
              <span className="text-body font-semibold text-neutral-800">
                {checkedCount}/{totalItems}
              </span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(checkedCount / totalItems) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={!allItemsChecked}
            onClick={() => onComplete({ packingNotes, fragileItems })}
          >
            {allItemsChecked ? 'Complete Packing' : 'Check All Items'}
          </Button>
        </div>
      </div>
    </div>
  )
}