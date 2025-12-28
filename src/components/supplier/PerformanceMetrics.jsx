// src/components/supplier/PerformanceMetrics.jsx

import { motion } from 'framer-motion'
import {
  Clock,
  CheckCircle,
  TrendingUp,
  Package,
  Star,
  ThumbsUp
} from 'lucide-react'
import { formatPercentage } from '@utils/formatters'

export default function PerformanceMetrics({ orders, products, timeRange }) {
  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const cancelledOrders = orders.filter(o => o.status === 'cancelled')
  
  const metrics = {
    fulfillmentRate: deliveredOrders.length / (orders.length || 1) * 100,
    onTimeDelivery: deliveredOrders.filter(o => {
      if (!o.estimatedDelivery || !o.actualDelivery) return true
      return new Date(o.actualDelivery) <= new Date(o.estimatedDelivery)
    }).length / (deliveredOrders.length || 1) * 100,
    averageRating: products.reduce((sum, p) => sum + (p.rating || 0), 0) / (products.length || 1),
    totalReviews: products.reduce((sum, p) => sum + (p.reviewCount || 0), 0),
    cancellationRate: cancelledOrders.length / (orders.length || 1) * 100,
    topProducts: products
      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      .slice(0, 5)
  }
  
  const performanceScore = (
    (metrics.fulfillmentRate * 0.3) +
    (metrics.onTimeDelivery * 0.3) +
    (metrics.averageRating * 20 * 0.3) +
    ((100 - metrics.cancellationRate) * 0.1)
  )
  
  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }
  
  const getPerformanceLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Average'
    return 'Needs Improvement'
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="text-heading font-semibold text-neutral-800 mb-6">
        Performance Metrics
      </h3>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-body-sm text-neutral-600">Overall Performance</p>
            <p className={`text-display font-bold ${getPerformanceColor(performanceScore)}`}>
              {performanceScore.toFixed(1)}%
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${
            performanceScore >= 90 ? 'bg-green-100 text-green-700' :
            performanceScore >= 75 ? 'bg-blue-100 text-blue-700' :
            performanceScore >= 60 ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            <p className="text-body-sm font-semibold">
              {getPerformanceLabel(performanceScore)}
            </p>
          </div>
        </div>

        <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${performanceScore}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`absolute top-0 left-0 h-full ${
              performanceScore >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
              performanceScore >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              performanceScore >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
              'bg-gradient-to-r from-red-500 to-red-600'
            }`}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">Fulfillment Rate</p>
              <p className="text-body font-semibold text-neutral-800">
                {formatPercentage(metrics.fulfillmentRate, 1)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">On-Time Delivery</p>
              <p className="text-body font-semibold text-neutral-800">
                {formatPercentage(metrics.onTimeDelivery, 1)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">Average Rating</p>
              <p className="text-body font-semibold text-neutral-800">
                {metrics.averageRating.toFixed(1)} ⭐
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-body-sm text-neutral-600">
              {metrics.totalReviews} reviews
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600">Cancellation Rate</p>
              <p className="text-body font-semibold text-neutral-800">
                {formatPercentage(metrics.cancellationRate, 1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <h4 className="text-body font-semibold text-neutral-800 mb-4">
          Top Performing Products
        </h4>
        <div className="space-y-3">
          {metrics.topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-caption font-bold">
                {index + 1}
              </span>
              <div className="w-10 h-10 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.images?.[0] || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-neutral-800 truncate">
                  {product.name}
                </p>
                <p className="text-caption text-neutral-600">
                  {product.soldCount || 0} sold
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-body-sm font-medium text-neutral-700">
                  {(product.rating || 0).toFixed(1)}
                </span>
              </div>
            </div>
          ))}

          {metrics.topProducts.length === 0 && (
            <div className="text-center py-6">
              <Package className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="text-body-sm text-neutral-600">No sales data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}