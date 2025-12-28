// src/components/supplier/PickingList.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle, Package, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { formatQuantity } from '@utils/formatters'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'

export default function PickingList({ order, onComplete, onUpdateItem }) {
  const [pickedItems, setPickedItems] = useState({})
  const [expandedCategories, setExpandedCategories] = useState({})
  
  const groupItemsByCategory = (items) => {
    return items.reduce((acc, item) => {
      const category = item.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {})
  }
  
  const groupedItems = groupItemsByCategory(order.items)
  const categories = Object.keys(groupedItems)
  
  const toggleItemPicked = (itemId) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
    
    if (onUpdateItem) {
      onUpdateItem(itemId, !pickedItems[itemId])
    }
  }
  
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }
  
  const totalItems = order.items.length
  const pickedCount = Object.values(pickedItems).filter(Boolean).length
  const progress = (pickedCount / totalItems) * 100
  
  const allItemsPicked = pickedCount === totalItems
  
  const getCategoryProgress = (categoryItems) => {
    const categoryPicked = categoryItems.filter(item => pickedItems[item.productId]).length
    return (categoryPicked / categoryItems.length) * 100
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-heading font-semibold text-neutral-800">Picking Progress</h3>
            <p className="text-body text-neutral-600 mt-1">
              {pickedCount} of {totalItems} items picked
            </p>
          </div>
          <div className="text-right">
            <p className="text-display font-bold text-primary-600">
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600"
          />
        </div>

        {allItemsPicked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-body font-semibold text-green-900">All items picked!</p>
              <p className="text-body-sm text-green-700">Ready to move to packing stage</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryItems = groupedItems[category]
          const isExpanded = expandedCategories[category] !== false
          const categoryProgress = getCategoryProgress(categoryItems)
          const allCategoryPicked = categoryProgress === 100

          return (
            <div key={category} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    allCategoryPicked ? 'bg-green-100' : 'bg-primary-100'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      allCategoryPicked ? 'text-green-600' : 'text-primary-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-body font-semibold text-neutral-800">{category}</h4>
                    <p className="text-body-sm text-neutral-600">
                      {categoryItems.filter(item => pickedItems[item.productId]).length} of {categoryItems.length} picked
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-body font-semibold text-primary-600">
                      {Math.round(categoryProgress)}%
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-2">
                      {categoryItems.map((item, index) => {
                        const isPicked = pickedItems[item.productId]

                        return (
                          <motion.div
                            key={item.productId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => toggleItemPicked(item.productId)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isPicked
                                ? 'border-green-300 bg-green-50'
                                : 'border-neutral-200 bg-white hover:border-primary-300'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                {isPicked ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                  <Circle className="w-6 h-6 text-neutral-400" />
                                )}
                              </div>

                              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                                <img
                                  src={item.image || '/placeholder-product.png'}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h5 className={`text-body font-semibold ${
                                  isPicked ? 'text-green-900 line-through' : 'text-neutral-800'
                                }`}>
                                  {item.name}
                                </h5>
                                <div className="flex items-center gap-3 mt-1">
                                  <Badge variant="secondary">
                                    Qty: {item.quantity}
                                  </Badge>
                                  {item.sku && (
                                    <span className="text-body-sm text-neutral-600">
                                      SKU: {item.sku}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {item.notes && (
                                <div className="flex-shrink-0">
                                  <AlertCircle className="w-5 h-5 text-amber-600" />
                                </div>
                              )}
                            </div>

                            {item.notes && (
                              <div className="mt-3 ml-10 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-body-sm text-amber-900">{item.notes}</p>
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-6 rounded-t-2xl shadow-lg">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!allItemsPicked}
          onClick={onComplete}
        >
          {allItemsPicked ? 'Complete Picking' : `Pick ${totalItems - pickedCount} More Items`}
        </Button>
      </div>
    </div>
  )
}