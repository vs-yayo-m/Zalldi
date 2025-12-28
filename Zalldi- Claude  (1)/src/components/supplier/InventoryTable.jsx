// src/components/supplier/InventoryTable.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Edit, Package } from 'lucide-react'
import { formatCurrency } from '@utils/formatters'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'

export default function InventoryTable({ products, onAdjustStock }) {
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  
  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' ?
        aValue.localeCompare(bValue) :
        bValue.localeCompare(aValue)
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
  })
  
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'error' }
    if (stock < 10) return { label: 'Low Stock', color: 'warning' }
    return { label: 'In Stock', color: 'success' }
  }
  
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center gap-2 text-body-sm font-semibold text-neutral-700 hover:text-neutral-900"
              >
                Product
                <SortIcon field="name" />
              </button>
            </th>
            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort('sku')}
                className="flex items-center gap-2 text-body-sm font-semibold text-neutral-700 hover:text-neutral-900"
              >
                SKU
                <SortIcon field="sku" />
              </button>
            </th>
            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort('stock')}
                className="flex items-center gap-2 text-body-sm font-semibold text-neutral-700 hover:text-neutral-900"
              >
                Stock
                <SortIcon field="stock" />
              </button>
            </th>
            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort('price')}
                className="flex items-center gap-2 text-body-sm font-semibold text-neutral-700 hover:text-neutral-900"
              >
                Price
                <SortIcon field="price" />
              </button>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="text-body-sm font-semibold text-neutral-700">
                Value
              </span>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="text-body-sm font-semibold text-neutral-700">
                Status
              </span>
            </th>
            <th className="px-6 py-4 text-right">
              <span className="text-body-sm font-semibold text-neutral-700">
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {sortedProducts.map((product, index) => {
            const stockStatus = getStockStatus(product.stock)
            const stockValue = product.price * product.stock

            return (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.images?.[0] || '/placeholder-product.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-body font-medium text-neutral-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-body-sm text-neutral-600 truncate">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-body text-neutral-700 font-mono">
                    {product.sku || '-'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package className={`w-4 h-4 ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 10 ? 'text-amber-600' :
                      'text-green-600'
                    }`} />
                    <span className={`text-body font-semibold ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 10 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                    <span className="text-body-sm text-neutral-600">
                      {product.unit || 'pc'}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-body font-medium text-neutral-800">
                    {formatCurrency(product.price)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-body font-semibold text-primary-600">
                    {formatCurrency(stockValue)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <Badge variant={stockStatus.color}>
                    {stockStatus.label}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onAdjustStock(product)}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-2">Adjust</span>
                    </Button>
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {sortedProducts.length === 0 && (
        <div className="py-12 text-center">
          <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-body text-neutral-600">No products found</p>
        </div>
      )}
    </div>
  )
}