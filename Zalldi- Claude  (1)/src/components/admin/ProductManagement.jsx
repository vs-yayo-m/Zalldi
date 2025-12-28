// src/components/admin/ProductManagement.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@config/firebase'
import { CATEGORIES } from '@utils/constants'
import { formatCurrency, formatStock } from '@utils/formatters'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Modal from '@components/ui/Modal'
import EmptyState from '@components/shared/EmptyState'
import { Search, Filter, Package, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProductManagement() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [stockFilter, setStockFilter] = useState(searchParams.get('stock') || 'all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    lowStock: 0,
    outOfStock: 0
  })

  useEffect(() => {
    loadProducts()
  }, [categoryFilter, statusFilter, stockFilter])

  useEffect(() => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (categoryFilter !== 'all') params.category = categoryFilter
    if (statusFilter !== 'all') params.status = statusFilter
    if (stockFilter !== 'all') params.stock = stockFilter
    setSearchParams(params)
  }, [searchTerm, categoryFilter, statusFilter, stockFilter])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))

      if (categoryFilter !== 'all') {
        q = query(
          collection(db, 'products'),
          where('category', '==', categoryFilter),
          orderBy('createdAt', 'desc')
        )
      }

      const snapshot = await getDocs(q)
      let allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      if (statusFilter !== 'all') {
        allProducts = allProducts.filter(product => 
          statusFilter === 'active' ? product.active !== false : product.active === false
        )
      }

      if (stockFilter !== 'all') {
        allProducts = allProducts.filter(product => {
          const stock = product.stock || 0
          switch (stockFilter) {
            case 'in-stock':
              return stock > 10
            case 'low-stock':
              return stock > 0 && stock <= 10
            case 'out-of-stock':
              return stock === 0
            default:
              return true
          }
        })
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        allProducts = allProducts.filter(product =>
          product.name?.toLowerCase().includes(term) ||
          product.sku?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term)
        )
      }

      setProducts(allProducts)

      const statsData = {
        total: allProducts.length,
        active: allProducts.filter(p => p.active !== false).length,
        inactive: allProducts.filter(p => p.active === false).length,
        lowStock: allProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length,
        outOfStock: allProducts.filter(p => (p.stock || 0) === 0).length
      }

      setStats(statsData)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = !product.active
      await updateDoc(doc(db, 'products', product.id), {
        active: newStatus,
        updatedAt: new Date()
      })
      
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'}`)
      loadProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      await deleteDoc(doc(db, 'products', selectedProduct.id))
      toast.success('Product deleted successfully')
      setShowDeleteModal(false)
      setSelectedProduct(null)
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'red', icon: XCircle }
    if (stock <= 10) return { label: 'Low Stock', color: 'amber', icon: AlertTriangle }
    return { label: 'In Stock', color: 'green', icon: CheckCircle }
  }

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map(cat => ({ value: cat.id, label: cat.name }))
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  const stockOptions = [
    { value: 'all', label: 'All Stock' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
              Product Management
            </h1>
            <p className="text-neutral-600">
              Manage and monitor all platform products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Products', value: stats.total, color: 'blue', icon: Package },
            { label: 'Active', value: stats.active, color: 'green', icon: CheckCircle },
            { label: 'Inactive', value: stats.inactive, color: 'red', icon: XCircle },
            { label: 'Low Stock', value: stats.lowStock, color: 'amber', icon: AlertTriangle },
            { label: 'Out of Stock', value: stats.outOfStock, color: 'red', icon: XCircle }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">{stat.label}</p>
                    <p className="text-xl font-bold text-neutral-800">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by product name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={categoryOptions}
                icon={Filter}
                className="min-w-[180px]"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                icon={Filter}
                className="min-w-[140px]"
              />
              <Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                options={stockOptions}
                icon={Filter}
                className="min-w-[140px]"
              />
            </div>
          </div>
        </Card>

        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting your filters or search criteria"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product.stock || 0)
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-card-hover transition-shadow">
                    <div className="relative h-48 bg-neutral-100">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-16 h-16 text-neutral-300" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge
                          variant={product.active !== false ? 'green' : 'red'}
                          size="sm"
                        >
                          {product.active !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant={stockStatus.color}
                          size="sm"
                          icon={stockStatus.icon}
                        >
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-800 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-3">
                        {product.category}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Stock: {product.stock || 0} {product.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-600">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                          icon={Eye}
                          className="flex-1"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant={product.active !== false ? 'outline' : 'primary'}
                          onClick={() => handleToggleStatus(product)}
                          icon={product.active !== false ? XCircle : CheckCircle}
                        >
                          {product.active !== false ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowDeleteModal(true)
                          }}
                          icon={Trash2}
                          className="text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedProduct(null)
        }}
        title="Delete Product"
      >
        <div className="p-6">
          <p className="text-neutral-700 mb-6">
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedProduct(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteProduct}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}