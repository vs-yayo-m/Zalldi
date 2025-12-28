// src/pages/supplier/EditProduct.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import ProductForm from '@components/supplier/ProductForm'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'
import { getProductById } from '@services/product.service'
import { USER_ROLES } from '@utils/constants'
import { Package, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!authLoading && (!user || user.role !== USER_ROLES.SUPPLIER)) {
      navigate('/login?redirect=/supplier/products', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !user) return
      
      setLoading(true)
      try {
        const productData = await getProductById(productId)
        
        if (productData.supplierId !== user.uid) {
          toast.error('You do not have permission to edit this product')
          navigate('/supplier/products')
          return
        }
        
        setProduct(productData)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchProduct()
    }
  }, [productId, user, navigate])
  
  if (authLoading || loading) {
    return <LoadingScreen />
  }
  
  if (!user || user.role !== USER_ROLES.SUPPLIER) {
    return null
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={Package}
            title="Product not found"
            description="The product you're looking for doesn't exist or has been removed"
            actionLabel="Back to Products"
            onAction={() => navigate('/supplier/products')}
          />
        </div>
      </div>
    )
  }
  
  const handleSuccess = () => {
    toast.success('Product updated successfully')
    navigate('/supplier/products')
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-50 py-8 sm:py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/supplier/products')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Products
          </Button>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Edit Product
          </h1>
          <p className="text-neutral-600">
            Update product information and settings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
        >
          <ProductForm
            product={product}
            onSuccess={handleSuccess}
            onCancel={() => navigate('/supplier/products')}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}