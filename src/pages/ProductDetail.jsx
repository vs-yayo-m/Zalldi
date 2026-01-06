// src/pages/ProductDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ChevronRight, ChevronDown, Heart, Share2,
  Clock, ShieldCheck, Zap, Star, Info, Package
} from 'lucide-react';
import { useProductBySlug } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import ProductGrid from '@/components/customer/ProductGrid';
import Header from '@/components/layout/Header';
import LoadingScreen from '@/components/shared/LoadingScreen';
import productService from '@/services/product.service';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProductBySlug(slug);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [boughtTogether, setBoughtTogether] = useState([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  useEffect(() => {
    if (product) {
      loadRecommendations();
    }
  }, [product]);
  
  const loadRecommendations = async () => {
    try {
      const [related, recommended, together] = await Promise.all([
        productService.getRelated(product.id, product.category, 8),
        productService.getTrending(8),
        productService.getBoughtTogether(product.id, 4)
      ]);
      setRelatedProducts(related);
      setRecommendedProducts(recommended);
      setBoughtTogether(together);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  };

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    toast.success('Added to cart!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Zalldi`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (loading) return <LoadingScreen />;
  if (!product) return navigate('/shop');

  const images = product.images || [product.image];
  const discount = product.comparePrice ? 
    Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="sticky top-16 z-40 bg-white border-b border-neutral-100 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => toggleWishlist(product)} className="p-2">
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            <div className="relative">
              <div className="aspect-square bg-neutral-50 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {discount}% OFF
                  </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button onClick={handleShare} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => toggleWishlist(product)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-orange-500 scale-105' : 'border-neutral-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 lg:py-8">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  21 MINS
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-black text-neutral-900 mb-2 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-neutral-500 mb-4">{product.unit}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-neutral-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-lg text-neutral-400 line-through font-medium">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg">
                    <Star className="w-4 h-4 fill-green-600 text-green-600" />
                    <span className="text-sm font-bold text-green-700">{product.rating}</span>
                  </div>
                  <span className="text-sm text-neutral-500">
                    {product.reviewCount || 0} ratings
                  </span>
                </div>
              )}

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full py-4 text-left font-bold text-green-600 hover:text-green-700 transition-colors"
              >
                <span>View product details</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="py-4 space-y-4 text-sm text-neutral-600 border-t border-neutral-100">
                      <div>
                        <h4 className="font-bold text-neutral-900 mb-2">Product Details</h4>
                        <p className="leading-relaxed">{product.description}</p>
                      </div>
                      
                      {product.features && (
                        <div>
                          <h4 className="font-bold text-neutral-900 mb-2">Key Features</h4>
                          <ul className="space-y-1">
                            {product.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                          <ShieldCheck className="w-5 h-5 text-green-600" />
                          <span className="text-xs font-bold">Quality Assured</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                          <Zap className="w-5 h-5 text-orange-500" />
                          <span className="text-xs font-bold">Fast Delivery</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {boughtTogether.length > 0 && (
          <RecommendationSection
            title="People also bought"
            products={boughtTogether}
            icon="🛒"
          />
        )}

        {relatedProducts.length > 0 && (
          <RecommendationSection
            title="Top products in this category"
            products={relatedProducts}
            icon="🔥"
            viewAllLink={`/category/${product.category}`}
          />
        )}

        {recommendedProducts.length > 0 && (
          <RecommendationSection
            title="Recommended for you"
            products={recommendedProducts}
            icon="✨"
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 font-bold text-neutral-600 hover:bg-neutral-50"
            >
              −
            </button>
            <span className="px-4 py-3 font-bold text-neutral-900 border-x border-neutral-200">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-3 font-bold text-neutral-600 hover:bg-neutral-50"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationSection({ title, products, icon, viewAllLink }) {
  const navigate = useNavigate();
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h2>
        {viewAllLink && (
          <button
            onClick={() => navigate(viewAllLink)}
            className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            See all
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 w-36 snap-start bg-white rounded-2xl border border-neutral-100 overflow-hidden"
    >
      <button
        onClick={() => navigate(`/product/${product.slug}`)}
        className="block"
      >
        <div className="aspect-square bg-neutral-50 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="text-xs font-bold text-neutral-900 line-clamp-2 mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 mb-2">{product.unit}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-neutral-900">
              {formatCurrency(product.price)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
                toast.success('Added!');
              }}
              className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg"
            >
              ADD
            </button>
          </div>
        </div>
      </button>
    </motion.div>
  );
}