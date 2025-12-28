// src/pages/supplier/Inventory.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useProducts } from '@hooks/useProducts'
import InventoryTable from '@components/supplier/InventoryTable'
import StockAdjustment from '@components/supplier/StockAdjustment'
import LowStockAlerts from '@components/supplier/LowStockAlerts'
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@utils/formatters'
import { calculateStockValue } from '@utils/calculations'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import Modal from '@components/ui/Modal'

export default function SupplierInventory() {
  const { user } = useAuth()
  const { products, loading, fetchSupplierProducts } = useProducts()
  const [showAdjustment, setShowAdjustment] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  
  useEffect(() => {
    if (user?.uid) {
      fetchSupplierProducts(user.uid)
    }
  }, [user])
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    if (stockFilter === 'low') return product.stock < 10
    if (stockFilter === 'out') return product.stock === 0
    if (stockFilter === 'in') return product.stock > 0
    return true
  })
  
  const stats = {
    totalProducts: products.length,
    totalValue: calculateStockValue(products),
    lowStock: products.filter(p => p.stock < 10 && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length
  }
  
  const handleAdjustStock = (product) => {
    setSelectedProduct(product)
    setShowAdjustment(true)
  }
  
  const handleCloseAdjustment = () => {
    setShowAdjustment(false)
    setSelectedProduct(null)
  }
  
  if (loading) {
    return <LoadingScreen />
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-display font-display text-neutral-800">Inventory Management</h1>
          <p className="text-body text-neutral-600 mt-1">
            Track and manage your product stock levels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Total Products</p>
            <p className="text-display font-bold text-neutral-800">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Stock Value</p>
            <p className="text-heading font-bold text-neutral-800">
              {formatCurrency(stats.totalValue)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Low Stock</p>
            <p className="text-display font-bold text-amber-600">{stats.lowStock}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Out of Stock</p>
            <p className="text-display font-bold text-red-600">{stats.outOfStock}</p>
          </div>
        </div>

        {stats.lowStock > 0 && (
          <div className="mb-8">
            <LowStockAlerts products={products.filter(p => p.stock < 10 && p.stock > 0)} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-card">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          <InventoryTable
            products={filteredProducts}
            onAdjustStock={handleAdjustStock}
          />
        </div>
      </div>

      <Modal
        isOpen={showAdjustment}
        onClose={handleCloseAdjustment}
        title="Adjust Stock"
      >
        {selectedProduct && (
          <StockAdjustment
            product={selectedProduct}
            onClose={handleCloseAdjustment}
          />
        )}
      </Modal>
    </div>
  )
}