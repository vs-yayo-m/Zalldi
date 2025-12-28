// src/components/supplier/StockAdjustment.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, RotateCcw, Save } from 'lucide-react'
import { useProducts } from '@hooks/useProducts'
import { formatCurrency } from '@utils/formatters'
import Button from '@components/ui/Button'
import toast from 'react-hot-toast'

export default function StockAdjustment({ product, onClose }) {
  const { updateProduct } = useProducts()
  const [adjustmentType, setAdjustmentType] = useState('add')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  
  const currentStock = product.stock || 0
  const adjustmentQuantity = parseInt(quantity) || 0
  
  const newStock = adjustmentType === 'add' ?
    currentStock + adjustmentQuantity :
    adjustmentType === 'subtract' ?
    Math.max(0, currentStock - adjustmentQuantity) :
    adjustmentQuantity
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!quantity || parseInt(quantity) < 0) {
      toast.error('Please enter a valid quantity')
      return
    }
    
    if (adjustmentType !== 'set' && parseInt(quantity) === 0) {
      toast.error('Quantity must be greater than 0')
      return
    }
    
    setLoading(true)
    
    try {
      await updateProduct(product.id, {
        stock: newStock,
        stockHistory: [
          ...(product.stockHistory || []),
          {
            type: adjustmentType,
            quantity: parseInt(quantity),
            previousStock: currentStock,
            newStock: newStock,
            reason: reason || 'Manual adjustment',
            timestamp: new Date().toISOString()
          }
        ]
      })
      
      toast.success('Stock updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update stock')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={product.images?.[0] || '/placeholder-product.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body font-semibold text-neutral-800 mb-1">
            {product.name}
          </h3>
          <p className="text-body-sm text-neutral-600">
            Current Stock: <span className="font-semibold text-primary-600">{currentStock}</span> {product.unit || 'pc'}
          </p>
          <p className="text-body-sm text-neutral-600">
            Unit Price: {formatCurrency(product.price)}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-body font-medium text-neutral-800 mb-3">
          Adjustment Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setAdjustmentType('add')}
            className={`p-4 rounded-xl border-2 transition-all ${
              adjustmentType === 'add'
                ? 'border-green-500 bg-green-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <Plus className={`w-6 h-6 mx-auto mb-2 ${
              adjustmentType === 'add' ? 'text-green-600' : 'text-neutral-600'
            }`} />
            <p className={`text-body-sm font-medium ${
              adjustmentType === 'add' ? 'text-green-900' : 'text-neutral-700'
            }`}>
              Add Stock
            </p>
          </button>

          <button
            type="button"
            onClick={() => setAdjustmentType('subtract')}
            className={`p-4 rounded-xl border-2 transition-all ${
              adjustmentType === 'subtract'
                ? 'border-red-500 bg-red-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <Minus className={`w-6 h-6 mx-auto mb-2 ${
              adjustmentType === 'subtract' ? 'text-red-600' : 'text-neutral-600'
            }`} />
            <p className={`text-body-sm font-medium ${
              adjustmentType === 'subtract' ? 'text-red-900' : 'text-neutral-700'
            }`}>
              Remove Stock
            </p>
          </button>

          <button
            type="button"
            onClick={() => setAdjustmentType('set')}
            className={`p-4 rounded-xl border-2 transition-all ${
              adjustmentType === 'set'
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <RotateCcw className={`w-6 h-6 mx-auto mb-2 ${
              adjustmentType === 'set' ? 'text-primary-600' : 'text-neutral-600'
            }`} />
            <p className={`text-body-sm font-medium ${
              adjustmentType === 'set' ? 'text-primary-900' : 'text-neutral-700'
            }`}>
              Set Stock
            </p>
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-body font-medium text-neutral-800 mb-2">
          {adjustmentType === 'set' ? 'New Stock Quantity' : 'Quantity to Adjust'}
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          step="1"
          placeholder="Enter quantity"
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-body"
          required
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-body font-medium text-neutral-800 mb-2">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Received new shipment, Damaged goods, Stock count correction..."
          rows={3}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-body"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-neutral-50 rounded-xl border border-neutral-200"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-body text-neutral-700">Current Stock:</span>
          <span className="text-body font-semibold text-neutral-800">
            {currentStock} {product.unit || 'pc'}
          </span>
        </div>
        
        {quantity && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-body text-neutral-700">
                {adjustmentType === 'add' && 'Adding:'}
                {adjustmentType === 'subtract' && 'Removing:'}
                {adjustmentType === 'set' && 'Setting to:'}
              </span>
              <span className={`text-body font-semibold ${
                adjustmentType === 'add' ? 'text-green-600' :
                adjustmentType === 'subtract' ? 'text-red-600' :
                'text-primary-600'
              }`}>
                {adjustmentType === 'set' ? quantity : parseInt(quantity)} {product.unit || 'pc'}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-body font-semibold text-neutral-800">New Stock:</span>
              <span className="text-body font-bold text-primary-600">
                {newStock} {product.unit || 'pc'}
              </span>
            </div>
          </>
        )}
      </motion.div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !quantity}
          className="flex-1"
        >
          <Save className="w-4 h-4" />
          <span className="ml-2">{loading ? 'Saving...' : 'Save Changes'}</span>
        </Button>
      </div>
    </form>
  )
}