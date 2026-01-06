// src/components/supplier/ProductForm.jsx

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import Alert from '@/components/ui/Alert';
import ImageUploader from '@/components/shared/ImageUploader';
import { CATEGORIES, PRODUCT_UNITS } from '@/utils/constants';
import { validateProductForm } from '@/utils/validators';
import { formatSlug, generateSKU } from '@/utils/helpers';
import { createProduct, updateProduct } from '@/services/product.service';
import toast from 'react-hot-toast';

const groupedCategories = CATEGORIES.reduce((acc, cat) => {
  if (!acc[cat.parent]) {
    acc[cat.parent] = [];
  }
  acc[cat.parent].push(cat);
  return acc;
}, {});

const parentLabels = {
  'grocery-kitchen': 'Grocery & Kitchen',
  'snacks-drinks': 'Snacks & Drinks',
  'beauty-personal-care': 'Beauty & Personal Care',
  'household-essentials': 'Household Essentials',
  'shop-by-store': 'Shop by Store'
};

export default function ProductForm({ product = null, onSuccess, onCancel }) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    stock: product?.stock || '',
    unit: product?.unit || 'pc',
    weight: product?.weight || '',
    minOrder: product?.minOrder || 1,
    maxOrder: product?.maxOrder || 100,
    deliveryTime: product?.deliveryTime || '8',
    images: product?.images || [],
    imageUrls: ['', '', '', '', ''],
    brand: product?.brand || '',
    manufacturer: product?.manufacturer || '',
    expiryDate: product?.expiryDate || '',
    tags: product?.tags?.join(', ') || '',
    featured: product?.featured || false,
    active: product?.active ?? true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    setError(null);
  };
  
  const handleImagesChange = (images) => {
    handleChange('images', images);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const validationErrors = validateProductForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const allImages = [
        ...formData.images,
        ...formData.imageUrls.filter(url => url.trim() !== '')
      ];

      const productData = {
        ...formData,
        images: allImages,
        supplierId: user.uid,
        slug: product?.slug || formatSlug(formData.name),
        sku: product?.sku || generateSKU(formData.category, formData.name),
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        weight: formData.weight || null,
        minOrder: Number(formData.minOrder),
        maxOrder: Number(formData.maxOrder),
        deliveryTime: Number(formData.deliveryTime),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        rating: product?.rating || 0,
        reviewCount: product?.reviewCount || 0,
        soldCount: product?.soldCount || 0,
        views: product?.views || 0
      };
      
      if (product) {
        await updateProduct(product.id, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product added successfully');
      }
      
      onSuccess?.();
    } catch (err) {
      console.error('Product form error:', err);
      setError(err.message || 'Failed to save product');
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-lg font-black text-neutral-900 mb-4">Product Images</h3>
        <ImageUploader
          images={formData.images}
          onChange={handleImagesChange}
          maxImages={5}
        />
        
        <div className="mt-4">
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Or Add Image URLs (Optional)
          </label>
          {formData.imageUrls.map((url, index) => (
            <Input
              key={index}
              value={url}
              onChange={(e) => {
                const newUrls = [...formData.imageUrls];
                newUrls[index] = e.target.value;
                handleChange('imageUrls', newUrls);
              }}
              placeholder={`Image URL ${index + 1}`}
              className="mb-2"
            />
          ))}
        </div>
        {errors.images && (
          <p className="mt-2 text-sm text-red-600">{errors.images}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-lg font-black text-neutral-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Fresh Red Apples"
            error={errors.name}
            required
          />

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
              required
            >
              <option value="">Select Category</option>
              {Object.entries(groupedCategories).map(([parent, categories]) => (
                <optgroup key={parent} label={parentLabels[parent]}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your product in detail..."
            rows={4}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none resize-none"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Brand (Optional)"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="e.g., Amul, Parle"
          />

          <Input
            label="Manufacturer (Optional)"
            value={formData.manufacturer}
            onChange={(e) => handleChange('manufacturer', e.target.value)}
            placeholder="e.g., Britannia Industries"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-lg font-black text-neutral-900 mb-4">Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Market Price (MRP)"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="299"
            error={errors.price}
            required
            min="0"
            step="0.01"
          />

          <Input
            label="Selling Price (After Discount)"
            type="number"
            value={formData.discountPrice}
            onChange={(e) => handleChange('discountPrice', e.target.value)}
            placeholder="249"
            min="0"
            step="0.01"
            helper="Leave empty if no discount"
          />
        </div>

        {formData.price && formData.discountPrice && (
          <div className="mt-3 p-3 bg-green-50 rounded-xl">
            <p className="text-sm font-bold text-green-700">
              Discount: {Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)}% OFF
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-lg font-black text-neutral-900 mb-4">Unit & Weight</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Unit Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
              required
            >
              {PRODUCT_UNITS.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Weight/Quantity"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            placeholder="e.g., 500 g, 1 L, 6 pieces"
            helper="Specify the package size"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-lg font-black text-neutral-900 mb-4">Stock & Limits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Stock Quantity"
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            placeholder="100"
            error={errors.stock}
            required
            min="0"
          />

          <Input
            label="Min Order"
            type="number"
            value={formData.minOrder}
            onChange={(e) => handleChange('minOrder', e.target.value)}
            placeholder="1"
            min="1"
          />

          <Input
            label="Max Order"
            type="number"
            value={formData.maxOrder}
            onChange={(e) => handleChange('maxOrder', e.target.value)}
            placeholder="100"
            min="1"
          />
        </div>

        <Input
          label="Delivery Time (minutes)"
          type="number"
          value={formData.deliveryTime}
          onChange={(e) => handleChange('deliveryTime', e.target.value)}
          placeholder="8"
          min="1"
          className="mt-4"
          helper="Estimated delivery time in minutes"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="text-lg font-black text-neutral-900 mb-4">Additional Info</h3>
        
        <Input
          label="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="organic, fresh, seasonal"
          helper="Help customers find your product"
          className="mb-4"
        />

        <Input
          label="Expiry Date (Optional)"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => handleChange('expiryDate', e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-neutral-900">Featured Product</p>
            <p className="text-sm text-neutral-600">Show in featured section</p>
          </div>
          <Switch
            checked={formData.featured}
            onChange={(checked) => handleChange('featured', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-neutral-900">Product Active</p>
            <p className="text-sm text-neutral-600">Visible to customers</p>
          </div>
          <Switch
            checked={formData.active}
            onChange={(checked) => handleChange('active', checked)}
          />
        </div>
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
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}