// src/pages/ProductDetail.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductBySlug } from '@/hooks/useProducts';
import ProductDetail from '@/components/customer/ProductDetail';
import ProductGrid from '@/components/customer/ProductGrid';
import LoadingScreen from '@/components/shared/LoadingScreen';
import EmptyState from '@/components/shared/EmptyState';
import { 
  Package, 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import productService from '@/services/product.service';

/**
 * CLEAN HEADER COMPONENT
 */
const Header = () => (
  <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-orange-500 p-1.5 rounded-lg">
          <Zap size={18} className="text-white fill-current" />
        </div>
        <span className="text-xl font-black tracking-tighter uppercase italic">Zalldi</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/shop" className="text-sm font-bold text-neutral-600 hover:text-orange-500 transition-colors">Shop</Link>
        <button className="relative p-2 text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors">
          <ShoppingBag size={22} />
          <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
        </button>
      </div>
    </div>
  </header>
);

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
    if (product) loadRelatedProducts();
  }, [product]);
  
  const loadRelatedProducts = async () => {
    if (!product) return;
    try {
      setRelatedLoading(true);
      const related = await productService.getRelated(product.id, product.category, 8); // Increased to 8 for more suggestions
      setRelatedProducts(related);
    } catch (err) {
      console.error('Error loading related products:', err);
    } finally {
      setRelatedLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Order now, delivered before your tea cools down..." />;
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Package className="w-16 h-16 text-neutral-200" />}
            title="Item Unavailable"
            description="We can't find this product in our Butwal inventory right now."
            action={{ label: "Continue Shopping", onClick: () => navigate('/shop') }}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col selection:bg-orange-100">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* BACK ACTION - Clean & Professional */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
              <ChevronLeft size={18} />
            </div>
            Back to Collection
          </button>
        </div>

        {/* MAIN FOCUS: THE PRODUCT */}
        <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden mb-16">
          <ProductDetail product={product} />
        </div>

        {/* SUGGESTIONS SECTION: KEEP THEM BUSY */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Sparkles size={20} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 italic">People Also Bought</h2>
                <p className="text-sm text-neutral-500 font-medium">Top picks in {product.categoryName || product.category}</p>
              </div>
            </div>
            <Link 
              to={`/category/${product.category}`}
              className="hidden md:flex items-center gap-2 text-sm font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest"
            >
              See all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-neutral-50/50 p-6 rounded-[2rem] border border-neutral-100">
            <ProductGrid 
              products={relatedProducts} 
              loading={relatedLoading} 
              columns={4} 
            />
          </div>
        </section>

        {/* COMPACT SPEED PROMISE */}
        <div className="bg-neutral-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shrink-0">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-white font-black text-xl italic leading-none">Hyper-Fast Delivery</p>
              <p className="text-neutral-400 text-sm mt-1 font-medium">Delivered to your door in Butwal within 60 minutes.</p>
            </div>
          </div>
          <Link 
            to="/shop" 
            className="relative z-10 bg-white text-neutral-900 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95"
          >
            Keep Exploring
          </Link>
          <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
        </div>
      </main>

      <footer className="py-10 text-center text-neutral-400 text-xs font-medium uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Zalldi Delivery — Butwal's Fastest.
      </footer>
    </div>
  );
}

