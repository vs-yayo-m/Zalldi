// /src/pages/ProductDetail.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import LoadingScreen from '@/components/shared/LoadingScreen'
import ProductDetail from '@/components/customer/ProductDetail'
import ProductGrid from '@/components/customer/ProductGrid'
import { useProductBySlug } from '@/hooks/useProducts'
import productService from '@/services/product.service'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { product, loading } = useProductBySlug(slug)
  
  // ----------------- Recommendations -----------------
  const [recommendations, setRecommendations] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerRef = useRef(null)
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setRecommendations([])
    setPage(1)
    setHasMore(true)
  }, [slug])
  
  useEffect(() => {
    if (!product) return
    fetchRecommendations(1)
  }, [product])
  
  const fetchRecommendations = async (pageToLoad = 1) => {
    if (!product || loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const PAGE_SIZE = 12
      let items = await productService.getPersonalizedRecommendations({
        seedProductId: product.id,
        page: pageToLoad,
        size: PAGE_SIZE
      })
      
      if (!items || !items.length) {
        // fallback to related
        items = await productService.getRelated(product.id, product.category, PAGE_SIZE * pageToLoad)
      }
      
      // deduplicate
      const existingIds = new Set(recommendations.map(p => p.id))
      items = items.filter(p => !existingIds.has(p.id))
      
      setRecommendations(prev => [...prev, ...items])
      setPage(pageToLoad)
      if (items.length < PAGE_SIZE) setHasMore(false)
    } catch (err) {
      console.error(err)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }
  
  // IntersectionObserver for infinite scroll
  const sentinelRef = useCallback(
    node => {
      if (loadingMore) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRecommendations(page + 1)
        }
      }, { rootMargin: '400px' })
      if (node) observerRef.current.observe(node)
    },
    [loadingMore, hasMore, page, recommendations]
  )
  
  if (loading) return <LoadingScreen />
  if (!product) return navigate('/shop')
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="bg-white rounded-3xl shadow-sm p-4 lg:p-8">
          <ProductDetail product={product} />
        </div>

        {/* ---------------- Recommendations Grid ---------------- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-neutral-900">You may also like</h2>
            <button
              onClick={() => navigate(`/category/${product.category}`)}
              className="text-sm text-green-600 font-bold flex items-center gap-1"
            >
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendations.map(p => (
              <ProductGrid.Card key={p.id} product={p} />
            ))}
            {loadingMore &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 aspect-square animate-pulse" />
              ))}
          </div>

          {/* sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-1 w-full" />
        </section>
      </div>
    </div>
  )
}