import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductBySlug } from '@/hooks/useProducts';
import ProductDetail from '@/components/customer/ProductDetail';
import ProductGrid from '@/components/customer/ProductGrid';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import LoadingScreen from '@/components/shared/LoadingScreen';
import EmptyState from '@/components/shared/EmptyState';
import { Package, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import productService from '@/services/product.service';

/**
 * ZALLDI PREMIUM PRODUCT VIEW
 * A high-conversion detail view with contextual navigation and smart recommendations.
 */

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductBySlug(slug);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // Scroll to top on navigation to a new product
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
      // Fetch related products based on category, excluding current product
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
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <EmptyState
            icon={<Package className="w-20 h-20 text-neutral-200" />}
            title="Product Not Found"
            description="We couldn't track down this specific item. It might have moved or is out of stock in Butwal."
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
    <div className="min-h-screen bg-[#F9FAFB] selection:bg-orange-100 pb-20 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-orange-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Row */}
        <div className="flex items-center justify-between mb-8">
          <Breadcrumbs items={breadcrumbItems} />
          <button 
            onClick={() => navigate(-1)}
            className="hidden md:flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Main Product Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden mb-20"
        >
          <ProductDetail product={product} />
        </motion.div>

        {/* Recommendations Section */}
        <AnimatePresence>
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-end justify-between px-2">
                <div>
                  <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                    <Sparkles className="w-3 h-3 fill-current" />
                    Curated for you
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tighter">
                    More in <span className="text-orange-500 underline decoration-orange-500/20 underline-offset-8">{product.categoryName || product.category}</span>
                  </h2>
                </div>
                <Link 
                  to={`/category/${product.category}`}
                  className="group flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors"
                >
                  View All
                  <Zap className="w-3 h-3 group-hover:fill-orange-500 transition-all" />
                </Link>
              </div>

              <div className="p-1">
                <ProductGrid 
                  products={relatedProducts} 
                  loading={relatedLoading} 
                  columns={4} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Promise Footer (Contextual) */}
        <div className="mt-24 p-8 bg-neutral-900 rounded-[2.5rem] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-white font-black text-xl mb-1 tracking-tight">Standard Delivery in 60 Minutes</h3>
              <p className="text-neutral-400 text-sm font-medium">Freshness and speed, guaranteed across Butwal.</p>
            </div>
            <Link 
              to="/faq" 
              className="px-6 py-3 bg-white hover:bg-neutral-100 text-neutral-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              Learn More
            </Link>
          </div>
          <Zap className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5" />
        </div>
      </div>
    </div>
  );
}

