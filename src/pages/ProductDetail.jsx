// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductBySlug } from '@/hooks/useProducts';
import ProductDetail from '@/components/customer/ProductDetail';
import ProductGrid from '@/components/customer/ProductGrid';
import Header from '@/components/layout/Header';
import LoadingScreen from '@/components/shared/LoadingScreen';
import EmptyState from '@/components/shared/EmptyState';
import { Package, ArrowLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';
import productService from '@/services/product.service';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductBySlug(slug);
  
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);
  
  useEffect(() => {
    if (product) {
      loadSuggestions();
    }
  }, [product]);
  
  const loadSuggestions = async () => {
    try {
      setDataLoading(true);
      // Fetch products in same category first
      const sameCategory = await productService.getRelated(product.id, product.category, 4);
      setCategoryProducts(sameCategory);
      
      // Fetch global trending/other products for "Keep Busy" discovery
      const others = await productService.getTrending(8);
      setOtherProducts(others.filter(p => p.id !== product.id).slice(0, 8));
    } catch (err) {
      console.error('Error loading suggestions:', err);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Order now, delivered before your tea cools down..." />;
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <EmptyState
          icon={<Package className="w-16 h-16 text-neutral-200" />}
          title="Product Missing"
          description="We couldn't find this item. Try our latest arrivals instead."
          action={{ label: "Go to Shop", onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* ACTION BAR: Clean & Minimal */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-orange-600 transition-colors uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50">
              <ArrowLeft size={14} />
            </div>
            Back
          </button>
        </div>

        {/* 1. PRIMARY PRODUCT FOCUS */}
        <section className="mb-24">
          <ProductDetail product={product} />
        </section>

        {/* 2. CATEGORY SUGGESTIONS (Priority 1) */}
        {categoryProducts.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1">More from this category</p>
                <h2 className="text-3xl font-black text-neutral-900 tracking-tighter">You might also like</h2>
              </div>
              <Link 
                to={`/category/${product.category}`}
                className="flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-orange-600 transition-colors uppercase tracking-widest"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <ProductGrid products={categoryProducts} columns={4} />
          </section>
        )}

        {/* 3. GLOBAL DISCOVERY (Priority 2 - Keep them busy) */}
        {otherProducts.length > 0 && (
          <section className="mb-24 py-16 border-t border-neutral-100">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={12} className="text-orange-400" />
                Trending in Butwal
              </div>
              <h2 className="text-4xl font-black text-neutral-900 tracking-tighter italic">Keep Exploring</h2>
            </div>
            <ProductGrid products={otherProducts} columns={4} />
          </section>
        )}

        {/* FAST DELIVERY FOOTER CARD */}
        <div className="bg-neutral-50 rounded-[2.5rem] p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <Zap className="text-orange-500 fill-orange-500" size={32} />
          </div>
          <h3 className="text-2xl font-black text-neutral-900 tracking-tight italic mb-2">
            Order Now, Delivered Before Your Tea Cools Down.
          </h3>
          <p className="text-neutral-500 font-medium max-w-md text-sm">
            Experience the fastest delivery in Nepal. Our partners are ready to move the moment you checkout.
          </p>
        </div>
      </main>
    </div>
  );
}

