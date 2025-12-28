// src/components/customer/ReviewCard.jsx

import { motion } from 'framer-motion'
import Badge from '@components/ui/Badge'
import RatingStars from './RatingStars'
import { formatRelativeTime } from '@utils/formatters'
import { CheckCircle } from 'lucide-react'

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {review.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-neutral-900">
                {review.customerName}
              </p>
              {review.verified && (
                <Badge variant="success" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Purchase
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-sm text-neutral-500">
                {formatRelativeTime(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-neutral-900 mb-2">
          {review.title}
        </h4>
        <p className="text-neutral-700 leading-relaxed">
          {review.comment}
        </p>
      </div>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100"
            >
              <img
                src={image}
                alt={`Review ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {review.response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-neutral-50 rounded-xl border-l-4 border-primary-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-semibold text-neutral-900">
              Seller Response
            </p>
            <span className="text-xs text-neutral-500">
              {formatRelativeTime(review.response.timestamp)}
            </span>
          </div>
          <p className="text-sm text-neutral-700">
            {review.response.comment}
          </p>
        </motion.div>
      )}
    </div>
  )
}