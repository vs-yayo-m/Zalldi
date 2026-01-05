import { useState, useMemo } from 'react'
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

/* ================= CONSTANTS & GROUPING ================= */

const STORAGE_TYPES = [
  { label: 'Room Temperature', value: 'ambient' },
  { label: 'Refrigerated (0°C to 4°C)', value: 'chilled' },
  { label: 'Frozen (-18°C)', value: 'frozen' }
]

const WEIGHT_UNITS = [
  { label: 'Grams (g)', value: 'g' },
  { label: 'Kilograms (kg)', value: 'kg' },
  { label: 'Milliliters (ml)', value: 'ml' },
  { label: 'Liters (L)', value: 'l' }
]

const groupedCategories = CATEGORIES.reduce((acc, cat) => {
  if (!acc[cat.parent]) acc[cat.parent] = []
  acc[cat.parent].push(cat)
  return acc
}, {})

const parentLabels = {
  'grocery-kitchen': 'Grocery & Kitchen',
  'snacks-drinks': 'Snacks & Drinks',
  'beauty-personal-care': 'Beauty & Personal Care',
  'household-essentials': 'Household Essentials',
  'shop-by-store': 'Shop by Store'
}

/* ============================================================= */

export default function ProductForm({ product = null, onSuccess, onCancel }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    // Pricing
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    costPrice: product?.costPrice || '',
    // Inventory
    stock: product?.stock || '',
    lowStockThreshold: product?.lowStockThreshold || 5,
    allowBackorder: product?.allowBackorder ?? false,
    unit: product?.unit || 'pc',
    minOrder: product?.minOrder || 1,
    maxOrder: product?.maxOrder || 100,
    // Logistics
    weight: product?.weight || '',
    weightUnit: product?.weightUnit || 'g',
    storageType: product?.storageType || 'ambient',
    // Shelf Life
    hasExpiry: product?.hasExpiry ?? false,
    shelfLifeDays: product?.shelfLifeDays || '',
    // Meta
    images: product?.images || [],
    active: product?.active ?? true
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Computed Business Metrics
  const margin = useMemo(() => {
    if (!formData.price || !formData.costPrice) return 0
    const profit = Number(formData.price) - Number(formData.costPrice)
    return ((profit / Number(formData.price)) * 100).toFixed(1)
  }, [formData.price, formData.costPrice])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Logical UI Validation
    if (formData.comparePrice && Number(formData.comparePrice) <= Number(formData.price)) {
      toast.error('Compare price should be higher than selling price')
      return
    }
    if (Number(formData.maxOrder) < Number(formData.minOrder)) {
      toast.error('Max order cannot be less than min order')
      return
    }

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
        sku: formData.sku || generateSKU(formData.category, formData.name),
        // Strict Numeric Casting
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        costPrice: formData.costPrice ? Number(formData.costPrice) : null,
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        minOrder: Number(formData.minOrder),
        maxOrder: Number(formData.maxOrder),
        weight: Number(formData.weight),
        shelfLifeDays: formData.hasExpiry ? Number(formData.shelfLifeDays) : null,
        // Legacy stats preservation
        rating: product?.rating || 0,
        reviewCount: product?.reviewCount || 0,
        soldCount: product?.soldCount || 0,
        views: product?.views || 0,
        updatedAt: new Date().toISOString()
      }

      if (product) {
        await updateProduct(product.id, productData)
      } else {
        await createProduct(productData)
      }
      toast.success('Inventory synced successfully')
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Data sync failed')
      toast.error('Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-10">
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      {/* SECTION: IMAGES */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-neutral-900 border-b pb-2">Product Images</h3>
        <ImageUploader images={formData.images} onChange={(imgs) => handleChange('images', imgs)} maxImages={5} />
        {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
      </div>

      {/* SECTION: BASIC INFO */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-neutral-900 border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} error={errors.name} required />
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-orange-500 outline-none transition-all"
              required
            >
              <option value="">Select Category</option>
              {Object.entries(groupedCategories).map(([parent, categories]) => (
                <optgroup key={parent} label={parentLabels[parent] || parent}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="SKU / Internal ID" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} placeholder="Auto-generated if empty" />
          <Input label="Barcode / GTIN" value={formData.barcode} onChange={(e) => handleChange('barcode', e.target.value)} placeholder="Scan or type barcode" />
        </div>
        <textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe product features, ingredients, or usage..."
          rows={3}
          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-orange-500 outline-none resize-none"
        />
      </div>

      {/* SECTION: PRICING & MARGINS */}
      <div className="space-y-6 bg-neutral-50 p-6 rounded-2xl">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-bold text-neutral-900">Pricing & Commercials</h3>
          {Number(margin) !== 0 && (
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${Number(margin) > 20 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              Margin: {margin}%
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Selling Price (NPR)" type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} required min="0" step="0.01" />
          <Input label="Compare Price (MRP)" type="number" value={formData.comparePrice} onChange={(e) => handleChange('comparePrice', e.target.value)} />
          <Input label="Cost Price (Internal)" type="number" value={formData.costPrice} onChange={(e) => handleChange('costPrice', e.target.value)} helper="For margin calculation" />
        </div>
      </div>

      {/* SECTION: INVENTORY */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-neutral-900 border-b pb-2">Inventory Control</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Current Stock" type="number" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} required />
          <Input label="Low Stock Alert" type="number" value={formData.lowStockThreshold} onChange={(e) => handleChange('lowStockThreshold', e.target.value)} />
          <Select label="Base Unit" value={formData.unit} onChange={(e) => handleChange('unit', e.target.value)} options={PRODUCT_UNITS} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Min Order Qty" type="number" value={formData.minOrder} onChange={(e) => handleChange('minOrder', e.target.value)} />
          <Input label="Max Order Qty" type="number" value={formData.maxOrder} onChange={(e) => handleChange('maxOrder', e.target.value)} />
          <div className="flex flex-col justify-end pb-2">
            <div className="flex items-center justify-between px-3 h-12 bg-neutral-50 rounded-xl">
              <span className="text-sm font-medium">Allow Backorder</span>
              <Switch checked={formData.allowBackorder} onChange={(val) => handleChange('allowBackorder', val)} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: LOGISTICS & HANDLING */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-neutral-900 border-b pb-2">Delivery & Handling</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-2 col-span-1">
            <div className="flex-1"><Input label="Weight" type="number" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} /></div>
            <div className="w-24 mt-7"><Select value={formData.weightUnit} onChange={(e) => handleChange('weightUnit', e.target.value)} options={WEIGHT_UNITS} /></div>
          </div>
          <Select label="Storage Requirement" value={formData.storageType} onChange={(e) => handleChange('storageType', e.target.value)} options={STORAGE_TYPES} />
          <div className="flex flex-col justify-end pb-2">
            <div className="flex items-center justify-between px-3 h-12 bg-neutral-50 rounded-xl">
              <span className="text-sm font-medium">Shelf Life Support</span>
              <Switch checked={formData.hasExpiry} onChange={(val) => handleChange('hasExpiry', val)} />
            </div>
          </div>
        </div>
        {formData.hasExpiry && (
          <div className="max-w-xs">
            <Input label="Avg Shelf Life (Days)" type="number" value={formData.shelfLifeDays} onChange={(e) => handleChange('shelfLifeDays', e.target.value)} placeholder="e.g. 7" />
          </div>
        )}
      </div>

      {/* SECTION: VISIBILITY */}
      <div className="flex items-center justify-between p-5 bg-orange-50/50 border border-orange-100 rounded-2xl">
        <div>
          <p className="font-bold text-neutral-900">Publish to Marketplace</p>
          <p className="text-sm text-neutral-600 italic">Inactive products are saved as drafts</p>
        </div>
        <Switch checked={formData.active} onChange={(val) => handleChange('active', val)} />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting} className="flex-1">
          {product ? 'Update Inventory' : 'List Product'}
        </Button>
      </div>
    </form>
  )
}

