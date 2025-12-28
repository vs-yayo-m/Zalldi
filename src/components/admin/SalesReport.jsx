// src/components/admin/SalesReport.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency } from '@utils/formatters'
import Card from '@components/ui/Card'
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react'

export default function SalesReport({ timeRange }) {
  const [report, setReport] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topCategory: '',
    topProduct: ''
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadReport()
  }, [timeRange])
  
  const loadReport = async () => {
    try {
      setLoading(true)
      
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const ordersSnap = await getDocs(
        query(
          collection(db, 'orders'),
          where('createdAt', '>=', startDate),
          where('status', '==', 'delivered')
        )
      )
      
      const orders = ordersSnap.docs.map(doc => doc.data())
      const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0)
      const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0
      
      const categoryCount = {}
      const productCount = {}
      
      orders.forEach(order => {
        order.items?.forEach(item => {
          const cat = item.category || 'Other'
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
          
          const prod = item.name
          productCount[prod] = (productCount[prod] || 0) + item.quantity
        })
      })
      
      const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
      const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
      
      setReport({
        totalSales,
        totalOrders: orders.length,
        avgOrderValue,
        topCategory,
        topProduct
      })
    } catch (error) {
      console.error('Error loading sales report:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-6">
          Sales Performance Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-green-700">Total Sales</span>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {formatCurrency(report.totalSales)}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-blue-700">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {report.totalOrders}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-purple-700">Avg Order Value</span>
            </div>
            <p className="text-2xl font-bold text-purple-800">
              {formatCurrency(report.avgOrderValue)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-600">Top Category</span>
            </div>
            <p className="text-lg font-semibold text-neutral-800">
              {report.topCategory}
            </p>
          </div>

          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-600">Top Product</span>
            </div>
            <p className="text-lg font-semibold text-neutral-800 truncate">
              {report.topProduct}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}