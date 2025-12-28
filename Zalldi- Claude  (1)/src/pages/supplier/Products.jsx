// src/pages/supplier/Products.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useProducts } from '@hooks/useProducts'
import ProductManagement from '@components/supplier/ProductManagement'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import { USER_ROLES } from '@utils/constants'
import { Plus, ArrowLeft } from 'lucide-react'

export default function Products() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { products, loading: productsLoading } = useProducts({ supplierId: user?.uid })
  
  useEffect(() => {
    if (!authLoading && (!user || user.role !== USER_ROLES.SUPPLIER)) {
      navigate('/login?redirect=/supplier/products', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  if (authLoading || productsLoading) {
    return <LoadingScreen />
  }
  
  if (!user || user.role !== USER_ROLES.SUPPLIER) {
    return null
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-50 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/supplier/dashboard')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                Product Management
              </h1>
              <p className="text-neutral-600">
                {products.length} products in your catalog
              </p>
            </div>
            <Button
              onClick={() => navigate('/supplier/products/add')}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Add Product
            </Button>
          </div>
        </motion.div>

        <ProductManagement products={products} />
      </div>
    </motion.div>
  )
}