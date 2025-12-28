// src/pages/supplier/Analytics.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useOrders } from '@hooks/useOrders'
import { useProducts } from '@hooks/useProducts'
import SalesAnalytics from '@components/supplier/SalesAnalytics'
import PerformanceMetrics from '@components/supplier/PerformanceMetrics'
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Star,
  Calendar
} from 'lucide-react'
import {
  formatCurrency,
  formatPercentage
} from '@utils/formatters'
import {
  calculateRevenue,
  calculateAverageOrderValue,
  calculateGrowthRate
} from '@utils/calculations'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function SupplierAnalytics() {
  const { user } = useAuth()
  const { orders, loading: ordersLoading, fetchSupplierOrders } = useOrders()
  const { products, loading: productsLoading, fetchSupplierProducts } = useProducts()
  const [timeRange, setTimeRange] = useState('30')
  
  useEffect(() => {
    if (user?.uid) {
      fetchSupplierOrders(user.uid)
      fetchSupplierProducts(user.uid)
    }
  }, [user])
  
  const filterOrdersByDays = (days) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return orders.filter(order => new Date(order.createdAt) >= cutoffDate)
  }
  
  const currentOrders = filterOrdersByDays(parseInt(timeRange))
  const previousOrders = filterOrdersByDays(parseInt(timeRange) * 2).filter(
    order => new Date(order.createdAt) < new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
  )
  
  const stats = {
    revenue: calculateRevenue(currentOrders),
    previousRevenue: calculateRevenue(previousOrders),
    orders: currentOrders.filter(o => o.status === 'delivered').length,
    previousOrders: previousOrders.filter(o => o.status === 'delivered').length,
    avgOrderValue: calculateAverageOrderValue(currentOrders),
    previousAvgOrderValue: calculateAverageOrderValue(previousOrders),
    rating: products.reduce((sum, p) => sum + (p.rating || 0), 0) / (products.length || 1)
  }
  
  const revenueGrowth = calculateGrowthRate(stats.revenue, stats.previousRevenue)
  const ordersGrowth = calculateGrowthRate(stats.orders, stats.previousOrders)
  const aovGrowth = calculateGrowthRate(stats.avgOrderValue, stats.previousAvgOrderValue)
  
  if (ordersLoading || productsLoading) {
    return <LoadingScreen />
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-display font-display text-neutral-800">Analytics</h1>
              <p className="text-body text-neutral-600 mt-1">
                Track your business performance
              </p>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-body-sm font-medium ${
                revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-4 h-4" />
                {formatPercentage(Math.abs(revenueGrowth), 1)}
              </div>
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Total Revenue</p>
            <p className="text-display font-bold text-neutral-800">
              {formatCurrency(stats.revenue)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <div className={`flex items-center gap-1 text-body-sm font-medium ${
                ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-4 h-4" />
                {formatPercentage(Math.abs(ordersGrowth), 1)}
              </div>
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Orders Completed</p>
            <p className="text-display font-bold text-neutral-800">
              {stats.orders}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-body-sm font-medium ${
                aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-4 h-4" />
                {formatPercentage(Math.abs(aovGrowth), 1)}
              </div>
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Avg Order Value</p>
            <p className="text-heading font-bold text-neutral-800">
              {formatCurrency(stats.avgOrderValue)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-body-sm text-neutral-600 mb-1">Average Rating</p>
            <p className="text-display font-bold text-neutral-800">
              {stats.rating.toFixed(1)} ⭐
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesAnalytics orders={currentOrders} timeRange={timeRange} />
          <PerformanceMetrics 
            orders={currentOrders}
            products={products}
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  )
}