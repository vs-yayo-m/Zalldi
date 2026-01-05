import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Tag, 
  Layers, 
  ChevronDown, 
  Plus, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  TrendingDown
} from 'lucide-react';
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

export default function ProductForm({ product = null, onSuccess, onCancel }) {
  const { user } = useAuth();
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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Computed: Discount Insight for Suppliers
  const discountInfo = useMemo(() => {
    if (!formData.price || !formData.comparePrice) return null;
    const price = Number(formData.price);
    const compare = Number(formData.comparePrice);
    if (compare <= price) return null;
    const percent = Math.round(((compare - price) / compare) * 100);
    return { percent, savings: (compare - price).toFixed(2) };
  }, [formData.price, formData.comparePrice]);

  // Grouping Categories for Cleaner UX
  const groupedCategories = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      if (!acc[cat.parent]) acc[cat.parent] = [];
      acc[cat.parent].push(cat);
      return acc;
    }, {});
  }, []);

  const parentLabels = {
    'grocery-kitchen': 'Grocery & Kitchen',
    'snacks-drinks': 'Snacks & Drinks',
    'beauty-personal-care': 'Beauty & Personal Care',
    'household-essentials': 'Household Essentials',
    'shop-by-store': 'Shop by Store'
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProductForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error('Required fields are missing.');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        supplierId: user?.uid,
        slug: product?.slug || formatSlug(formData.name),
        sku: product?.sku || generateSKU(formData.category, formData.name),
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        stock: Number(formData.stock),
        minOrder: Number(formData.minOrder),
        maxOrder: Number(formData.maxOrder),
        updatedAt: new Date().toISOString()
      };

      if (product) {
        await updateProduct(product.id, productData);
        toast.success('Inventory Updated');
      } else {
        await createProduct({ ...productData, createdAt: new Date().toISOString() });
        toast.success('Product Listed Live');
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Server connection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-32 lg:pb-12">
      {error && (
        <Alert variant="error" className="rounded-3xl border-rose-100 bg-rose-50/50">
          {error}
        </Alert>
      )}

      {/* SECTION: VISUALS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <ImageIcon size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight italic">Product Gallery</h3>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">First image is your main cover</p>
          </div>
        </div>
        
        <ImageUploader
          images={formData.images}
          onChange={(imgs) => handleChange('images', imgs)}
          maxImages={5}
        />
        {errors.images && <p className="mt-4 text-[10px] font-black text-rose-500 uppercase tracking-widest">{errors.images}</p>}
      </motion.section>

      {/* SECTION: IDENTITY */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
            <Tag size={22} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight italic">Basic Info</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="What are you selling?"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Premium Avocado"
            error={errors.name}
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Market Category</label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full h-14 pl-5 pr-10 bg-neutral-50 border-2 border-transparent focus:border-orange-500 rounded-2xl appearance-none font-bold text-sm transition-all outline-none"
              >
                <option value="">Select a Category</option>
                {Object.entries(groupedCategories).map(([parent, categories]) => (
                  <optgroup key={parent} label={parentLabels[parent] || parent}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Product Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full p-6 bg-neutral-50 border-2 border-transparent focus:border-orange-500 rounded-[2rem] font-medium text-sm transition-all outline-none resize-none"
            placeholder="Highlight freshness, origin, or special instructions..."
          />
        </div>
      </motion.section>

      {/* SECTION: PRICING */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
            <Package size={22} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight italic">Pricing & Inventory</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Listing Price (NPR)"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            error={errors.price}
          />
          <div className="relative">
            <Input
              label="Original Price (MRP)"
              type="number"
              value={formData.comparePrice}
              onChange={(e) => handleChange('comparePrice', e.target.value)}
            />
            {discountInfo && (
              <div className="absolute -top-1 right-0 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1">
                <TrendingDown size={10} /> {discountInfo.percent}% OFF
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Unit Type</label>
            <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full h-14 px-5 bg-neutral-50 border-2 border-transparent focus:border-orange-500 rounded-2xl font-bold text-sm transition-all outline-none"
            >
                {PRODUCT_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <Input label="Total Stock" type="number" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} error={errors.stock} />
            <Input label="Min Order" type="number" value={formData.minOrder} onChange={(e) => handleChange('minOrder', e.target.value)} />
            <Input label="Max Order" type="number" value={formData.maxOrder} onChange={(e) => handleChange('maxOrder', e.target.value)} />
        </div>

        <div className="p-8 bg-neutral-50 rounded-[2.5rem] flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${formData.active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-neutral-200 text-neutral-400'}`}>
                    {formData.active ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                </div>
                <div>
                    <p className="text-sm font-black uppercase tracking-tight italic">Visibility Status</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        {formData.active ? 'Live on ZALLDI marketplace' : 'Draft mode (Hidden)'}
                    </p>
                </div>
            </div>
            <Switch checked={formData.active} onChange={(val) => handleChange('active', val)} />
        </div>
      </motion.section>

      {/* PERSISTENT ACTION BAR */}
      <div className="fixed bottom-10 left-6 right-6 lg:relative lg:bottom-0 lg:left-0 lg:right-0 z-[100] lg:z-auto">
        <div className="max-w-xl mx-auto lg:max-w-none flex items-center gap-4 bg-white/80 backdrop-blur-2xl p-4 lg:p-0 rounded-[2.5rem] border border-white/20 shadow-2xl lg:shadow-none lg:bg-transparent lg:border-none lg:backdrop-blur-none">
            {onCancel && (
                <button 
                  type="button"
                  onClick={onCancel} 
                  className="h-16 px-8 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors bg-neutral-100 lg:bg-transparent"
                >
                    Discard
                </button>
            )}
            <Button 
                type="submit" 
                variant="orange" 
                className="flex-1 h-16 !rounded-[1.5rem] shadow-xl shadow-orange-500/20"
                loading={isSubmitting}
                icon={product ? null : <Plus size={18} />}
            >
                {product ? 'Update Inventory' : 'List on Market'}
            </Button>
        </div>
      </div>
    </form>
  );
}

