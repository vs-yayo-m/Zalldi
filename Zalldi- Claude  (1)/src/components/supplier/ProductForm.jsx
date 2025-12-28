// src/components/supplier/ProductForm.jsx

import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Switch from '@components/ui/Switch'
import Alert from '@components/ui/Alert'
import ImageUploader from '@components/shared/ImageUploader'
import { CATEGORIES, PRODUCT_UNITS } from '@utils/constants'
import { validateProductForm } from '@utils/validators'
import { formatSlug, generateSKU } from '@utils/helpers'
import { createProduct, updateProduct } from '@services/product.service'
import toast from 'react-hot-toast'

export default function ProductForm({ product = null, onSuccess, onCancel }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    stock: product?.stock || '',
    unit: product?.unit || 'pc',
    minOrder: product?.minOrder || 1,
    maxOrder: product?.maxOrder || 100,
    images: product?.images || [],
    active: product?.active ?? true
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    setError(null)
  }
  
  const handleImagesChange = (images) => {
    handleChange('images', images)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    const validationErrors = validateProductForm(formData)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const productData = {
        ...formData,
        supplierId: user.uid,
        slug: product?.slug || formatSlug(formData.name),
        sku: product?.sku || generateSKU(formData.category, formData.name),
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        stock: Number(formData.stock),
        minOrder: Number(formData.minOrder),
        maxOrder: Number(formData.maxOrder),
        rating: product?.rating || 0,
        reviewCount: product?.reviewCount || 0,
        soldCount: product?.soldCount || 0,
        views: product?.views || 0
      }
      
      if (product) {
        await updateProduct(product.id, productData)
      } else {
        await createProduct(productData)
      }
      
      onSuccess?.()
    } catch (err) {
      console.error('Product form error:', err)
      setError(err.message || 'Failed to save product')
      toast.error('Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div>
        <label className="block text-sm font-semibold text-neutral-900 mb-3">
          Product Images <span className="text-red-500">*</span>
        </label>
        <ImageUploader
          images={formData.images}
          onChange={handleImagesChange}
          maxImages={5}
        />
        {errors.images && (
          <p className="mt-2 text-sm text-red-600">{errors.images}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Fresh Red Apples"
          error={errors.name}
          required
        />

       <Select
  label="Category"
  value={formData.category}
  onChange={(e) => handleChange('category', e.target.value)}
  error={errors.category}
  required
  options={[
    { value: '', label: 'Select category', disabled: true },
    ...CATEGORIES.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  ]}
/>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-900 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your product..."
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
            errors.description ? 'border-red-300' : 'border-neutral-200'
          }`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Price (NPR)"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder="0"
          error={errors.price}
          required
          min="0"
          step="0.01"
        />

        <Input
          label="Compare at Price (Optional)"
          type="number"
          value={formData.comparePrice}
          onChange={(e) => handleChange('comparePrice', e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          helper="Original price for discount display"
        />

        <Select
  label="Unit"
  value={formData.unit}
  onChange={(e) => handleChange('unit', e.target.value)}
  required
  options={PRODUCT_UNITS}
/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Stock Quantity"
          type="number"
          value={formData.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
          placeholder="0"
          error={errors.stock}
          required
          min="0"
        />

        <Input
          label="Minimum Order"
          type="number"
          value={formData.minOrder}
          onChange={(e) => handleChange('minOrder', e.target.value)}
          placeholder="1"
          min="1"
        />

        <Input
          label="Maximum Order"
          type="number"
          value={formData.maxOrder}
          onChange={(e) => handleChange('maxOrder', e.target.value)}
          placeholder="100"
          min="1"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
        <div>
          <p className="font-semibold text-neutral-900">Product Status</p>
          <p className="text-sm text-neutral-600">Make this product visible to customers</p>
        </div>
        <Switch
          checked={formData.active}
          onChange={(checked) => handleChange('active', checked)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}