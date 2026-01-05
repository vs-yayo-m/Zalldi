// src/components/supplier/ProductForm.jsx
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

/* ================= CONSTANTS ================= */
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

/* ================= CATEGORY GROUPING ================= */
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

/* ================= CATEGORY ATTRIBUTES ================= */
// Dynamic fields for each category
const CATEGORY_ATTRIBUTES = {
  'vegetables-fruits': [
    { key: 'organic', label: 'Organic', type: 'switch' },
    { key: 'freshness', label: 'Freshness Grade', type: 'select', options: ['A', 'B', 'C'] }
  ],
  'atta-rice-dal': [
    { key: 'grainType', label: 'Grain Type', type: 'text' },
    { key: 'proteinContent', label: 'Protein Content (%)', type: 'number' }
  ],
  'oil-ghee-masala': [
    { key: 'flavor', label: 'Flavor / Spice Level', type: 'text' },
    { key: 'coldPressed', label: 'Cold Pressed', type: 'switch' }
  ],
  'dairy-bread-eggs': [
    { key: 'fatContent', label: 'Fat Content (%)', type: 'number' },
    { key: 'lactoseFree', label: 'Lactose Free', type: 'switch' }
  ],
  'bakery-biscuits': [
    { key: 'glutenFree', label: 'Gluten Free', type: 'switch' },
    { key: 'weight', label: 'Weight (g)', type: 'number' }
  ],
  'dry-fruits-cereals': [
    { key: 'origin', label: 'Origin', type: 'text' },
    { key: 'packSize', label: 'Pack Size', type: 'text' }
  ],
  'chicken-meat-fish': [
    { key: 'cutType', label: 'Cut Type', type: 'text' },
    { key: 'freshness', label: 'Freshness Grade', type: 'select', options: ['A', 'B', 'C'] }
  ],
  'kitchenware-appliances': [
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'warrantyMonths', label: 'Warranty (Months)', type: 'number' }
  ],
  'chips-namkeen': [
    { key: 'flavor', label: 'Flavor', type: 'text' },
    { key: 'saltLevel', label: 'Salt Level', type: 'text' }
  ],
  'sweets-chocolates': [
    { key: 'cocoaContent', label: 'Cocoa Content (%)', type: 'number' },
    { key: 'sugarFree', label: 'Sugar Free', type: 'switch' }
  ],
  'drinks-juices': [
    { key: 'volume', label: 'Volume (ml)', type: 'number' },
    { key: 'sugarContent', label: 'Sugar Content (%)', type: 'number' }
  ],
  'tea-coffee-milk': [
    { key: 'caffeineContent', label: 'Caffeine Content (mg)', type: 'number' },
    { key: 'organic', label: 'Organic', type: 'switch' }
  ],
  'instant-food': [
    { key: 'preparationTime', label: 'Preparation Time (mins)', type: 'number' },
    { key: 'spiceLevel', label: 'Spice Level', type: 'select', options: ['Mild','Medium','Hot'] }
  ],
  'sauces-spreads': [
    { key: 'flavor', label: 'Flavor', type: 'text' },
    { key: 'spiceLevel', label: 'Spice Level', type: 'select', options: ['Mild','Medium','Hot'] }
  ],
  // Other categories can have empty arrays if no dynamic attributes
  'paan-corner': [],
  'ice-creams-more': [],
  'bath-body': [],
  'hair-care': [],
  'skin-face': [],
  'beauty-cosmetics': [],
  'feminine-hygiene': [],
  'baby-care': [],
  'health-pharma': [],
  'sexual-wellness': [],
  'home-lifestyle': [],
  'cleaners-repellents': [],
  'electronics': [],
  'stationery-games': [],
  'spiritual-store': [],
  'pharma-store': [],
  'egifts-store': [],
  'pet-store': [],
  'sports-store': [],
  'fashion-basics': [],
  'toy-store': [],
  'book-store': []
}

/* ================= MAIN COMPONENT ================= */
export default function ProductForm({ product = null, onSuccess, onCancel }) {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    // Basic Info
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    brand: product?.brand || '',
    manufacturer: product?.manufacturer || '',
    modelNumber: product?.modelNumber || '',
    countryOfOrigin: product?.countryOfOrigin || '',
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
    hasExpiry: product?.hasExpiry ?? false,
    shelfLifeDays: product?.shelfLifeDays || '',
    // Media & Status
    images: product?.images || [],
    imageURLs: product?.imageURLs || ['', '', '', '', '', ''], // 6 URL slots
    active: product?.active ?? true,
    // Dynamic attributes
    attributes: product?.attributes || {}
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  /* ================= COMPUTED MARGIN ================= */
  const margin = useMemo(() => {
    if (!formData.price || !formData.costPrice) return 0
    const profit = Number(formData.price) - Number(formData.costPrice)
    return ((profit / Number(formData.price)) * 100).toFixed(1)
  }, [formData.price, formData.costPrice])

  /* ================= HANDLERS ================= */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
    setError(null)
  }

  const handleAttributeChange = (key, value) => {
    setFormData(prev => ({ ...prev, attributes: { ...prev.attributes, [key]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Basic validations
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
      // Merge uploaded images + URL inputs
      const mergedImages = [
        ...(formData.images || []),
        ...formData.imageURLs.filter(url => url.trim() !== '')
      ]

      const productData = {
        ...formData,
        images: mergedImages,
        supplierId: user.uid,
        slug: product?.slug || formatSlug(formData.name),
        sku: formData.sku || generateSKU(formData.category, formData.name),
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        costPrice: formData.costPrice ? Number(formData.costPrice) : null,
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        minOrder: Number(formData.minOrder),
        maxOrder: Number(formData.maxOrder),
        weight: Number(formData.weight),
        shelfLifeDays: formData.hasExpiry ? Number(formData.shelfLifeDays) : null,
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
      toast.success('Product synced successfully')
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Data sync failed')
      toast.error('Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const dynamicAttributes = CATEGORY_ATTRIBUTES[formData.category] || []

  /* ================= JSX ================= */
  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-10">
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      {/* IMAGES */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-neutral-900 border-b pb-2">Product Images</h3>
        <ImageUploader images={formData.images} onChange={(imgs) => handleChange('images', imgs)} maxImages={10} />
        <div className="mt-4">
          <p className="font-semibold text-neutral-700 mb-1">Or provide Image URLs (max 6)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {formData.imageURLs.map((url, idx) => (
              <Input
                key={idx}
                placeholder={`Image URL ${idx + 1}`}
                value={url}
                onChange={(e) => {
                  const newURLs = [...formData.imageURLs]
                  newURLs[idx] = e.target.value
                  handleChange('imageURLs', newURLs)
                }}
              />
            ))}
          </div>
        </div>
        {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
      </div>

      {/* BASIC INFO */}
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

        {/* Dynamic category attributes */}
        {dynamicAttributes.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="font-semibold text-neutral-900">Category-Specific Attributes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicAttributes.map(attr => {
                if(attr.type === 'switch') return (
                  <div key={attr.key} className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-xl">
                    <span>{attr.label}</span>
                    <Switch checked={!!formData.attributes[attr.key]} onChange={(val) => handleAttributeChange(attr.key, val)} />
                  </div>
                )
                if(attr.type === 'select') return (
                  <Select
                    key={attr.key}
                    label={attr.label}
                    value={formData.attributes[attr.key] || ''}
                    onChange={(e) => handleAttributeChange(attr.key, e.target.value)}
                    options={attr.options.map(opt => ({ label: opt, value: opt }))}
                  />
                )
                return <Input key={attr.key} label={attr.label} value={formData.attributes[attr.key] || ''} onChange={(e) => handleAttributeChange(attr.key, e.target.value)} type={attr.type} />
              })}
            </div>
          </div>
        )}

        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe product features, ingredients, or usage..."
          rows={4}
          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-orange-500 outline-none resize-none"
        />
      </div>

      {/* PRICING & MARGIN */}
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

      {/* INVENTORY */}
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
          { /* Allow Backorder */ }
<div className="flex flex-col justify-end pb-2">
          <div className="flex items-center justify-between px-3 h-12 bg-neutral-50 rounded-xl">
            <span className="text-sm font-medium">Allow Backorder</span>
            <Switch checked={formData.allowBackorder} onChange={(val) => handleChange('allowBackorder', val)} />
          </div>
        </div> </div> </div>

{ /* LOGISTICS & HANDLING */ }
<div className="space-y-6">
      <h3 className="text-lg font-bold text-neutral-900 border-b pb-2">Delivery & Handling</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex gap-2 col-span-1">
          <div className="flex-1">
            <Input label="Weight" type="number" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} />
          </div>
          <div className="w-24 mt-7">
            <Select value={formData.weightUnit} onChange={(e) => handleChange('weightUnit', e.target.value)} options={WEIGHT_UNITS} />
          </div>
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
          <Input
            label="Avg Shelf Life (Days)"
            type="number"
            value={formData.shelfLifeDays}
            onChange={(e) => handleChange('shelfLifeDays', e.target.value)}
            placeholder="e.g. 7"
          />
        </div>
      )}
    </div>

{ /* VISIBILITY */ }
<div className="flex items-center justify-between p-5 bg-orange-50/50 border border-orange-100 rounded-2xl">
      <div>
        <p className="font-bold text-neutral-900">Publish to Marketplace</p>
        <p className="text-sm text-neutral-600 italic">Inactive products are saved as drafts</p>
      </div>
      <Switch checked={formData.active} onChange={(val) => handleChange('active', val)} />
    </div>

{ /* ACTIONS */ }
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