// src/pages/supplier/AddProduct.jsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import ProductForm from '@components/supplier/ProductForm'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import { USER_ROLES } from '@utils/constants'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddProduct() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  
  useEffect(() => {
    if (!authLoading && (!user || user.role !== USER_ROLES.SUPPLIER)) {
      navigate('/login?redirect=/supplier/products/add', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  if (authLoading) {
    return <LoadingScreen />
  }
  
  if (!user || user.role !== USER_ROLES.SUPPLIER) {
    return null
  }
  
  const handleSuccess = () => {
    toast.success('Product added successfully')
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
            Add New Product
          </h1>
          <p className="text-neutral-600">
            Fill in the product details to add it to your catalog
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
        >
          <ProductForm
            onSuccess={handleSuccess}
            onCancel={() => navigate('/supplier/products')}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}