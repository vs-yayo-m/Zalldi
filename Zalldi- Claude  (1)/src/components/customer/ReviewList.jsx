// src/components/customer/ReviewList.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReviewCard from './ReviewCard'
import Button from '@components/ui/Button'
import EmptyState from '@components/shared/EmptyState'
import { getProductReviews } from '@services/product.service'
import { MessageSquare } from 'lucide-react'

export default function ReviewList({ productId, limit = null }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(limit || 5)
  
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const fetchedReviews = await getProductReviews(productId)
        setReviews(fetchedReviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (productId) {
      fetchReviews()
    }
  }, [productId])
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral-100 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3" />
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }
  
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        description="Be the first to review this product"
      />
    )
  }
  
  const displayedReviews = limit ? reviews.slice(0, displayCount) : reviews
  const hasMore = reviews.length > displayCount
  
  return (
    <div className="space-y-4">
      {displayedReviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ReviewCard review={review} />
        </motion.div>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setDisplayCount(prev => prev + 5)}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  )
}