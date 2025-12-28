// src/pages/ProductDetail.jsx

import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProductBySlug } from '@/hooks/useProducts'
import ProductDetail from '@/components/customer/ProductDetail'
import ProductGrid from '@/components/customer/ProductGrid'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import { Package } from 'lucide-react'
import productService from '@/services/product.service'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { product, loading, error } = useProductBySlug(slug)
  const [relatedProducts, setRelatedProducts] = React.useState([])
  const [relatedLoading, setRelatedLoading] = React.useState(false)
  
  useEffect(() => {
    if (product) {
      loadRelatedProducts()
    }
  }, [product])
  
  const loadRelatedProducts = async () => {
    if (!product) return
    
    try {
      setRelatedLoading(true)
      const related = await productService.getRelated(product.id, product.category, 6)
      setRelatedProducts(related)
    } catch (err) {
      console.error('Error loading related products:', err)
    } finally {
      setRelatedLoading(false)
    }
  }
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed"
        />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: product.category, to: `/category/${product.category}` },
            { label: product.name, to: `/product/${product.slug}` }
          ]}
          className="mb-8"
        />

        <div className="bg-white rounded-2xl p-6 lg:p-8 mb-12">
          <ProductDetail product={product} />
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts} loading={relatedLoading} columns={4} />
          </div>
        )}
      </div>
    </div>
  )
}