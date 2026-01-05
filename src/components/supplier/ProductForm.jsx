import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Globe, 
  Plus, 
  Calculator,
  Image as ImageIcon,
  Zap,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Alert from '@/components/ui/Alert';
import ImageUploader from '@/components/shared/ImageUploader';
import { CATEGORIES, PRODUCT_UNITS } from '@/utils/constants';
import { validateProductForm } from '@/utils/validators';
import { formatSlug, generateSKU } from '@/utils/helpers';
import { createProduct, updateProduct } from '@/services/product.service';
import toast from 'react-hot-toast';

// Configurable Category Attributes
const CATEGORY_ATTRIBUTES = {
  'vegetables-fruits': [
    { key: 'organic', label: 'Certified Organic', type: 'switch' },
    { key: 'freshness', label: 'Freshness Grade', type: 'select', options: ['Premium (A+)', 'Standard (A)', 'Market (B)'] }
  ],
  'dairy-bread-eggs': [
    { key: 'fatContent', label: 'Fat Content (%)', type: 'number' },
    { key: 'lactoseFree', label: 'Lactose Free', type: 'switch' }
  ],
  'chicken-meat-fish': [
    { key: 'halal', label: 'Halal Certified', type: 'switch' },
    { key: 'cutType', label: 'Cut Type', type: 'text', placeholder: 'e.g. Skinless, Bone-in' }
  ],
  'kitchenware-appliances': [
    { key: 'warranty', label: 'Warranty (Months)', type: 'number' },
    { key: 'material', label: 'Primary Material', type: 'text' }
  ]
};

const groupedCategories = CATEGORIES.reduce((acc, cat) => {
  if (!acc[cat.parent]) acc[cat.parent] = [];
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
    sku: product?.sku || '',
    brand: product?.brand || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    costPrice: product?.costPrice || '',
    stock: product?.stock || '',
    lowStockThreshold: product?.lowStockThreshold || 5,
    unit: product?.unit || 'pc',
    minOrder: product?.minOrder || 1,
    maxOrder: product?.maxOrder || 100,
    weight: product?.weight || '',
    weightUnit: product?.weightUnit || 'g',
    hasExpiry: product?.hasExpiry ?? false,
    shelfLifeDays: product?.shelfLifeDays || '',
    images: product?.images || [],
    imageURLs: product?.imageURLs || ['', ''],
    active: product?.active ?? true,
    attributes: product?.attributes || {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const marginData = useMemo(() => {
    if (!formData.price || !formData.costPrice) return { profit: 0, percentage: 0 };
    const profit = Number(formData.price) - Number(formData.costPrice);
    const percentage = ((profit / Number(formData.price)) * 100).toFixed(1);
    return { profit, percentage };
  }, [formData.price, formData.costPrice]);

  const handleAttributeChange = (key, value) => {
    setFormData(prev => ({ ...prev, attributes: { ...prev.attributes, [key]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProductForm(formData);
    if (validationErrors) { setErrors(validationErrors); return; }

    setIsSubmitting(true);
    try {
      const mergedImages = [...(formData.images || []), ...formData.imageURLs.filter(u => u.trim())];
      const payload = {
        ...formData,
        images: mergedImages,
        supplierId: user.uid,
        slug: product?.slug || formatSlug(formData.name),
        sku: formData.sku || generateSKU(formData.category, formData.name),
        updatedAt: new Date().toISOString()
      };

      if (product) await updateProduct(product.id, payload);
      else await createProduct({ ...payload, createdAt: new Date().toISOString() });
      
      toast.success('Inventory Synchronized');
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Sync Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dynamicAttrs = CATEGORY_ATTRIBUTES[formData.category] || [];

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 pb-32">
      
      {/* HEADER & GLOBAL ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 bg-white/80 backdrop-blur-md py-4 border-b border-neutral-100 mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tighter italic uppercase">{product ? 'Edit Asset' : 'New Listing'}</h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Global Product Registry</p>
        </div>
        <div className="flex gap-2">
          {onCancel && <Button variant="ghost" onClick={onCancel} className="!rounded-xl text-neutral-400">Discard</Button>}
          <Button type="submit" loading={isSubmitting} className="!rounded-xl bg-neutral-900 text-white shadow-xl shadow-neutral-200">
            {product ? 'Update Inventory' : 'Publish Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: VISUALS & IDENTITY */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white p-8 rounded-[2.5rem] border border-neutral-100">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="text-orange-500" size={20} />
              <h3 className="font-black uppercase text-sm tracking-widest italic">Visual Media</h3>
            </div>
            <ImageUploader images={formData.images} onChange={(i) => setFormData(p => ({...p, images: i}))} maxImages={10} />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.imageURLs.map((url, i) => (
                <Input 
                  key={i} 
                  placeholder={`CDN URL ${i+1}`} 
                  value={url} 
                  className="!h-10 text-xs"
                  onChange={(e) => {
                    const u = [...formData.imageURLs]; u[i] = e.target.value;
                    setFormData(p => ({...p, imageURLs: u}));
                  }}
                />
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 space-y-6">
             <div className="flex items-center gap-3 mb-2">
              <Tag className="text-blue-500" size={20} />
              <h3 className="font-black uppercase text-sm tracking-widest italic">Identity & Attributes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Display Name" value={formData.name} onChange={(e) => setFormData(p=>({...p, name: e.target.value}))} error={errors.name} />
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Category Registry</label>
                <select 
                  className="w-full h-14 bg-neutral-50 rounded-2xl px-5 font-bold text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                  value={formData.category} 
                  onChange={(e) => setFormData(p=>({...p, category: e.target.value}))}
                >
                  <option value="">Select Path</option>
                  {Object.entries(groupedCategories).map(([p, cats]) => (
                    <optgroup key={p} label={parentLabels[p] || p}>
                      {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* DYNAMIC ATTRIBUTE INJECTION */}
            <AnimatePresence mode="wait">
              {dynamicAttrs.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-3xl"
                >
                  {dynamicAttrs.map(attr => (
                    <div key={attr.key}>
                      {attr.type === 'switch' ? (
                        <div className="flex items-center justify-between h-14 px-4 bg-white rounded-xl border border-neutral-100">
                          <span className="text-xs font-bold uppercase tracking-tight">{attr.label}</span>
                          <Switch checked={formData.attributes[attr.key]} onChange={(v) => handleAttributeChange(attr.key, v)} />
                        </div>
                      ) : attr.type === 'select' ? (
                        <Select 
                          label={attr.label} 
                          value={formData.attributes[attr.key]} 
                          options={attr.options.map(o => ({label: o, value: o}))}
                          onChange={(e) => handleAttributeChange(attr.key, e.target.value)}
                        />
                      ) : (
                        <Input label={attr.label} value={formData.attributes[attr.key]} onChange={(e) => handleAttributeChange(attr.key, e.target.value)} type={attr.type} />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <textarea 
              className="w-full p-6 bg-neutral-50 rounded-3xl min-h-[120px] outline-none focus:ring-2 focus:ring-orange-500/20 font-medium text-sm transition-all"
              placeholder="Technical specifications and customer information..."
              value={formData.description}
              onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}
            />
          </section>
        </div>

        {/* RIGHT COLUMN: COMMERCIALS & LOGISTICS */}
        <div className="space-y-8">
          
          <section className="bg-neutral-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="text-orange-400" size={20} />
              <h3 className="font-black uppercase text-sm tracking-widest italic">Pricing Engine</h3>
            </div>
            <div className="space-y-6">
              <Input label="Selling Price" type="number" value={formData.price} onChange={(e) => setFormData(p=>({...p, price: e.target.value}))} dark />
              <Input label="Cost Price (Internal)" type="number" value={formData.costPrice} onChange={(e) => setFormData(p=>({...p, costPrice: e.target.value}))} dark />
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Gross Margin</span>
                  <span className={`text-2xl font-black italic ${Number(marginData.percentage) > 20 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {marginData.percentage}%
                  </span>
                </div>
                <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.min(100, Math.max(0, marginData.percentage))}%` }}
                    className={`h-full ${Number(marginData.percentage) > 20 ? 'bg-emerald-400' : 'bg-orange-400'}`} 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="text-indigo-500" size={20} />
              <h3 className="font-black uppercase text-sm tracking-widest italic">Fulfillment</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData(p=>({...p, stock: e.target.value}))} />
              <Select label="Unit" value={formData.unit} options={PRODUCT_UNITS} onChange={(e) => setFormData(p=>({...p, unit: e.target.value}))} />
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest">Market Visibility</span>
              <Switch checked={formData.active} onChange={(v) => setFormData(p=>({...p, active: v}))} />
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 space-y-6">
             <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h3 className="font-black uppercase text-sm tracking-widest italic">Handling</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
              <span className="text-xs font-bold uppercase">Shelf Life Check</span>
              <Switch checked={formData.hasExpiry} onChange={(v) => setFormData(p=>({...p, hasExpiry: v}))} />
            </div>
            {formData.hasExpiry && (
              <Input label="Days Until Expired" type="number" value={formData.shelfLifeDays} onChange={(e) => setFormData(p=>({...p, shelfLifeDays: e.target.value}))} />
            )}
          </section>

        </div>
      </div>
    </form>
  );
}

