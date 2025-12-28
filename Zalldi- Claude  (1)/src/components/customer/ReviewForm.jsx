// src/components/customer/ReviewForm.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Alert from '@components/ui/Alert'
import { validateRequired, validateRating } from '@utils/validators'
import { createReview } from '@services/product.service'
import toast from 'react-hot-toast'
import { Star } from 'lucide-react'

export default function ReviewForm({ productId, orderId, onSuccess, onCancel }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    setError(null)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    const validationErrors = {}
    
    const ratingError = validateRating(formData.rating)
    if (ratingError) validationErrors.rating = ratingError
    
    const titleError = validateRequired(formData.title, 'Review title')
    if (titleError) validationErrors.title = titleError
    
    const commentError = validateRequired(formData.comment, 'Review comment')
    if (commentError) validationErrors.comment = commentError
    
    if (formData.comment && formData.comment.length < 10) {
      validationErrors.comment = 'Review must be at least 10 characters'
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await createReview({
        productId,
        orderId,
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerPhoto: user.photoURL || null,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        verified: true
      })
      
      toast.success('Review submitted successfully')
      onSuccess?.()
    } catch (err) {
      console.error('Review submission error:', err)
      setError(err.message || 'Failed to submit review')
      toast.error('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div>
        <label className="block text-sm font-semibold text-neutral-900 mb-3">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChange('rating', rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  rating <= (hoveredRating || formData.rating)
                    ? 'fill-primary-500 text-primary-500'
                    : 'text-neutral-300'
                }`}
              />
            </motion.button>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-2 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      <Input
        label="Review Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Sum up your experience"
        error={errors.title}
        required
      />

      <div>
        <label className="block text-sm font-semibold text-neutral-900 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={5}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
            errors.comment ? 'border-red-300' : 'border-neutral-200'
          }`}
        />
        {errors.comment && (
          <p className="mt-2 text-sm text-red-600">{errors.comment}</p>
        )}
        <p className="mt-2 text-sm text-neutral-500">
          Minimum 10 characters
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </motion.form>
  )
}