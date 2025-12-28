// src/components/admin/AnalyticsPanel.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency, formatPercentage } from '@utils/formatters'
import Card from '@components/ui/Card'
import Select from '@components/ui/Select'
import SalesReport from './SalesReport'
import UserReport from './UserReport'
import SupplierReport from './SupplierReport'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Users, Package, ShoppingCart, Calendar } from 'lucide-react'

export default function AnalyticsPanel() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    avgOrderValue: 0,
    conversionRate: 0
  })
  const [categoryData, setCategoryData] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)

      const [ordersSnap, customersSnap, productsSnap] = await Promise.all([
        getDocs(query(collection(db, 'orders'), where('createdAt', '>=', startDate))),
        getDocs(query(collection(db, 'users'), where('role', '==', 'customer'))),
        getDocs(collection(db, 'products'))
      ])

      const orders = ordersSnap.docs.map(doc => doc.data())
      const deliveredOrders = orders.filter(o => o.status === 'delivered')
      
      const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      const avgOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0
      
      const activeCustomers = customersSnap.docs.filter(doc => {
        const user = doc.data()
        return user.lastOrderDate?.toDate() >= startDate
      }).length

      const conversionRate = customersSnap.size > 0 
        ? (deliveredOrders.length / customersSnap.size) * 100 
        : 0

      setAnalytics({
        totalRevenue,
        totalOrders: ordersSnap.size,
        totalCustomers: activeCustomers,
        totalProducts: productsSnap.size,
        avgOrderValue,
        conversionRate
      })

      const categoryCounts = {}
      const productSales = {}

      deliveredOrders.forEach(order => {
        order.items?.forEach(item => {
          if (!categoryCounts[item.category || 'Other']) {
            categoryCounts[item.category || 'Other'] = 0
          }
          categoryCounts[item.category || 'Other'] += item.total

          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              name: item.name,
              sales: 0,
              quantity: 0
            }
          }
          productSales[item.productId].sales += item.total
          productSales[item.productId].quantity += item.quantity
        })
      })

      const categoryArray = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value: Math.round(value)
      })).sort((a, b) => b.value - a.value).slice(0, 6)

      const topProductsArray = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10)

      setCategoryData(categoryArray)
      setTopProducts(topProductsArray)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]

  const COLORS = ['#FF6B35', '#F7931E', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
              Analytics & Insights
            </h1>
            <p className="text-neutral-600">
              Comprehensive platform analytics and reports
            </p>
          </div>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
            icon={Calendar}
            className="min-w-[150px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Revenue',
              value: formatCurrency(analytics.totalRevenue),
              icon: TrendingUp,
              color: 'green'
            },
            {
              label: 'Total Orders',
              value: analytics.totalOrders,
              icon: ShoppingCart,
              color: 'blue'
            },
            {
              label: 'Active Customers',
              value: analytics.totalCustomers,
              icon: Users,
              color: 'purple'
            },
            {
              label: 'Total Products',
              value: analytics.totalProducts,
              icon: Package,
              color: 'orange'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <h3 className="text-neutral-600 text-sm font-medium mb-1">
                  {stat.label}
                </h3>
                <p className="text-2xl font-bold text-neutral-800">
                  {stat.value}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-6">
              Sales by Category
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-6">
              Top Selling Products
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '11px' }}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'sales' ? formatCurrency(value) : value,
                      name === 'sales' ? 'Sales' : 'Quantity'
                    ]}
                  />
                  <Bar dataKey="sales" fill="#FF6B35" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Key Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-700">Average Order Value</span>
                <span className="text-lg font-bold text-neutral-800">
                  {formatCurrency(analytics.avgOrderValue)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-700">Conversion Rate</span>
                <span className="text-lg font-bold text-green-600">
                  {formatPercentage(analytics.conversionRate, 1)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-700">Orders per Customer</span>
                <span className="text-lg font-bold text-blue-600">
                  {analytics.totalCustomers > 0 
                    ? (analytics.totalOrders / analytics.totalCustomers).toFixed(1)
                    : 0}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Category Performance
            </h3>
            <div className="space-y-3">
              {categoryData.map((category, index) => {
                const percentage = (category.value / analytics.totalRevenue) * 100
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        {category.name}
                      </span>
                      <span className="text-sm font-semibold text-neutral-800">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SalesReport timeRange={timeRange} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserReport timeRange={timeRange} />
            <SupplierReport timeRange={timeRange} />
          </div>
        </div>
      </div>
    </div>
  )
}