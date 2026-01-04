// src/pages/ProductDetail.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductBySlug } from '@/hooks/useProducts';
import ProductDetail from '@/components/customer/ProductDetail';
import ProductGrid from '@/components/customer/ProductGrid';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import LoadingScreen from '@/components/shared/LoadingScreen';
import EmptyState from '@/components/shared/EmptyState';
import { 
  Package, 
  ArrowLeft, 
  Zap, 
  Sparkles, 
  ShoppingBag, 
  Truck, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import productService from '@/services/product.service';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductBySlug(slug);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);
  
  useEffect(() => {
    if (product) {
      loadRelatedProducts();
    }
  }, [product]);
  
  const loadRelatedProducts = async () => {
    if (!product) return;
    try {
      setRelatedLoading(true);
      const related = await productService.getRelated(product.id, product.category, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error('Error loading related products:', err);
    } finally {
      setRelatedLoading(false);
    }
  };
  
  const breadcrumbItems = useMemo(() => {
    if (!product) return [];
    return [
      { label: 'Shop', to: '/shop' },
      { label: product.categoryName || product.category, to: `/category/${product.category}` },
      { label: product.name, to: `/product/${product.slug}` }
    ];
  }, [product]);
  
  if (loading) {
    return <LoadingScreen message="Unboxing your next favorite item..." />;
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <EmptyState
            icon={<Package className="w-20 h-20 text-neutral-100" />}
            title="Product Not Found"
            description="This item vanished! It might have sold out or teleported to another shelf."
            action={{
              label: "Back to Shop",
              onClick: () => navigate('/shop')
            }}
          />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-orange-100 pb-20 overflow-hidden">
      {/* BACKGROUND AMBIANCE */}
      <div className="fixed top-0 right-0 w-[60vw] h-[60vw] bg-orange-50/50 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-50/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between mb-8">
          <Breadcrumbs items={breadcrumbItems} />
          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] hover:text-orange-500 transition-colors bg-white px-5 py-2.5 rounded-full border border-neutral-100 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </motion.button>
        </div>

        {/* MAIN PRODUCT HERO */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-neutral-100 overflow-hidden mb-24"
        >
            {/* The "Zalldi Quality" Corner Badge */}
            <div className="absolute top-0 right-0 p-10 z-20 pointer-events-none hidden lg:block">
                <div className="flex items-center gap-3 bg-neutral-900 text-white px-6 py-3 rounded-2xl rotate-3 shadow-2xl">
                    <ShieldCheck size={20} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Zalldi Verified</span>
                </div>
            </div>

            <ProductDetail product={product} />
        </motion.div>

        {/* DELIVERY PROMISE BANNER (High Energy) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-24 p-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[3rem] shadow-2xl shadow-orange-500/20"
        >
            <div className="bg-neutral-900 rounded-[2.8rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="relative z-10 space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                        <Truck size={14} />
                        Hyper-Velocity
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none italic">
                        Order now, delivered before <br className="hidden md:block" /> your tea even cools down.
                    </h3>
                    <p className="text-neutral-400 font-medium max-w-md">
                        Our specialized couriers are already on standby in Butwal. Real-time GPS tracking starts the second you click buy.
                    </p>
                </div>
                
                <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-white font-black text-lg leading-none italic">60 MINS</p>
                            <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Average Delivery</p>
                        </div>
                    </div>
                </div>

                {/* Background Decorative Zap */}
                <Zap className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 rotate-12" />
            </div>
        </motion.div>

        {/* RELATED PRODUCTS */}
        <AnimatePresence>
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 px-4">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-orange-500 font-black text-[11px] uppercase tracking-[0.3em] mb-4">
                    <Sparkles className="w-4 h-4 fill-current" />
                    The Collection
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-none italic uppercase">
                    More in <span className="text-orange-500">{product.categoryName || product.category}</span>
                  </h2>
                </div>
                <Link 
                  to={`/category/${product.category}`}
                  className="group flex items-center gap-4 bg-white border border-neutral-100 pl-8 pr-4 py-4 rounded-[2rem] shadow-sm hover:border-orange-200 transition-all active:scale-95"
                >
                  <span className="text-xs font-black text-neutral-900 uppercase tracking-widest">Explore Full Category</span>
                  <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </Link>
              </div>

              <div className="p-1">
                <ProductGrid 
                  products={relatedProducts} 
                  loading={relatedLoading} 
                  columns={4} 
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* TRUST SIGNALS */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
            <TrustFeature 
                icon={<ShieldCheck size={32} />}
                title="Secure Checkout"
                desc="Encrypted payments and localized fraud protection."
            />
            <TrustFeature 
                icon={<ShoppingBag size={32} />}
                title="Easy Returns"
                desc="Not satisfied? We pick it up from your door, no questions."
            />
            <TrustFeature 
                icon={<Zap size={32} />}
                title="Instant Support"
                desc="Chat with a human expert in Butwal instantly."
            />
        </div>
      </div>
    </div>
  );
}

/**
 * SUB-COMPONENT: TRUST FEATURE
 */
const TrustFeature = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center text-center space-y-4 group p-8 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-neutral-200/40 transition-all duration-500">
        <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-500">
            {icon}
        </div>
        <div className="space-y-2">
            <h4 className="font-black text-neutral-900 uppercase tracking-tight italic">{title}</h4>
            <p className="text-sm text-neutral-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

