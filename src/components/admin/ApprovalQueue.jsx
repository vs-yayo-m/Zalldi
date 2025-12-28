// src/components/admin/ApprovalQueue.jsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency, formatRelativeTime } from '@utils/formatters'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Modal from '@components/ui/Modal'
import EmptyState from '@components/shared/EmptyState'
import { Package, CheckCircle, XCircle, Eye, AlertCircle, User, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ApprovalQueue() {
  const [pendingProducts, setPendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadPendingProducts()
  }, [])

  const loadPendingProducts = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, 'products'),
        where('approved', '==', false)
      )
      
      const snapshot = await getDocs(q)
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const productsWithSuppliers = await Promise.all(
        products.map(async (product) => {
          try {
            const supplierDoc = await getDocs(
              query(collection(db, 'users'), where('__name__', '==', product.supplierId))
            )
            const supplier = supplierDoc.docs[0]?.data()
            return {
              ...product,
              supplierName: supplier?.displayName || 'Unknown Supplier',
              supplierEmail: supplier?.email || ''
            }
          } catch (error) {
            return {
              ...product,
              supplierName: 'Unknown Supplier',
              supplierEmail: ''
            }
          }
        })
      )

      setPendingProducts(productsWithSuppliers)
    } catch (error) {
      console.error('Error loading pending products:', error)
      toast.error('Failed to load pending products')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (productId) => {
    try {
      setProcessing(true)
      await updateDoc(doc(db, 'products', productId), {
        approved: true,
        approvedAt: serverTimestamp(),
        active: true,
        updatedAt: serverTimestamp()
      })

      toast.success('Product approved successfully')
      loadPendingProducts()
    } catch (error) {
      console.error('Error approving product:', error)
      toast.error('Failed to approve product')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (productId) => {
    try {
      setProcessing(true)
      await updateDoc(doc(db, 'products', productId), {
        approved: false,
        rejected: true,
        rejectedAt: serverTimestamp(),
        active: false,
        updatedAt: serverTimestamp()
      })

      toast.success('Product rejected')
      loadPendingProducts()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error rejecting product:', error)
      toast.error('Failed to reject product')
    } finally {
      setProcessing(false)
    }
  }

  const openDetailModal = (product) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-neutral-200 rounded"></div>
          ))}
        </div>
      </Card>
    )
  }

  if (pendingProducts.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={CheckCircle}
          title="No pending approvals"
          description="All products have been reviewed"
        />
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-neutral-800">
              Approval Queue
            </h2>
            <Badge variant="amber">{pendingProducts.length}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {pendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="p-4 border border-neutral-200 rounded-xl hover:border-orange-300 transition-all bg-white">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-8 h-8 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-800 mb-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-neutral-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{product.supplierName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatRelativeTime(product.createdAt?.toDate())}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Stock: {product.stock || 0}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetailModal(product)}
                          icon={Eye}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(product.id)}
                          disabled={processing}
                          icon={CheckCircle}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(product.id)}
                          disabled={processing}
                          icon={XCircle}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedProduct(null)
        }}
        title="Product Details"
        size="lg"
      >
        {selectedProduct && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-4">
                  {selectedProduct.images && selectedProduct.images[0] ? (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-16 h-16 text-neutral-300" />
                    </div>
                  )}
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.slice(1, 5).map((img, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                  {selectedProduct.name}
                </h3>
                <Badge variant="blue" className="mb-4">
                  {selectedProduct.category}
                </Badge>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Price</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(selectedProduct.price)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Stock</span>
                    <span className="font-semibold">
                      {selectedProduct.stock} {selectedProduct.unit}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">SKU</span>
                    <span className="font-semibold">{selectedProduct.sku}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Supplier</span>
                    <span className="font-semibold">{selectedProduct.supplierName}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-neutral-800 mb-2">Description</h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(selectedProduct.id)}
                    disabled={processing}
                    icon={CheckCircle}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve Product
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedProduct.id)}
                    disabled={processing}
                    icon={XCircle}
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}