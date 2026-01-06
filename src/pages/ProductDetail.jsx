// src/pages/ProductDetail.jsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/shared/LoadingScreen';
import ProductDetail from '@/components/customer/ProductDetail';
import ProductCard from '@/components/customer/ProductCard';
import { useProductBySlug } from '@/hooks/useProducts';
import productService from '@/services/product.service';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProductBySlug(slug);
  
  const [recommendations, setRecommendations] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRecommendations([]);
    setPage(1);
    setHasMore(true);
  }, [slug]);
  
  useEffect(() => {
    if (!product) return;
    fetchRecommendations(1);
  }, [product]);
  
  const fetchRecommendations = async (pageToLoad = 1) => {
    if (!product || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const PAGE_SIZE = 12;
      let items = await productService.getPersonalizedRecommendations({
        seedProductId: product.id,
        page: pageToLoad,
        size: PAGE_SIZE
      });
      
      if (!items?.length) {
        items = await productService.getRelated(product.id, product.category, PAGE_SIZE * pageToLoad);
      }
      
      const existingIds = new Set(recommendations.map(p => p.id));
      items = items.filter(p => !existingIds.has(p.id) && p.id !== product.id);
      
      setRecommendations(prev => [...prev, ...items]);
      setPage(pageToLoad);
      if (items.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };
  
  const sentinelRef = useCallback(
    node => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRecommendations(page + 1);
        }
      }, { rootMargin: '400px' });
      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore, page, recommendations]
  );
  
  if (loading) return <LoadingScreen />;
  if (!product) {
    navigate('/shop');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Back button */}
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl shadow-sm p-4 lg:p-8 mb-8">
          <ProductDetail product={product} />
        </div>

        {/* Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-neutral-900">You may also like</h2>
            <button
              onClick={() => navigate(`/category/${product.category}`)}
              className="flex items-center gap-1 text-orange-600 font-bold text-sm hover:gap-2 transition-all"
            >
              See all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {recommendations.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
            {loadingMore && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>

          <div ref={sentinelRef} className="h-1 w-full" />
        </section>
      </div>

      <Footer />
    </div>
  );
}