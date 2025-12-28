// src/components/admin/ExecutiveMetrics.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency } from '@utils/formatters'
import Card from '@components/ui/Card'
import Tabs from '@components/ui/Tabs'
import { Calendar, TrendingUp, Users, Package } from 'lucide-react'

export default function ExecutiveMetrics({ metrics }) {
  const [chartData, setChartData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [activeTab, setActiveTab] = useState('revenue')
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChartData()
  }, [timeRange])

  const loadChartData = async () => {
    try {
      setLoading(true)
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const dateArray = []
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        dateArray.push(date)
      }

      const ordersSnap = await getDocs(
        query(
          collection(db, 'orders'),
          where('createdAt', '>=', dateArray[0]),
          orderBy('createdAt', 'asc')
        )
      )

      const dataByDate = {}
      dateArray.forEach(date => {
        const key = date.toISOString().split('T')[0]
        dataByDate[key] = {
          date: key,
          revenue: 0,
          orders: 0,
          customers: new Set()
        }
      })

      ordersSnap.docs.forEach(doc => {
        const order = doc.data()
        const orderDate = order.createdAt.toDate()
        const key = orderDate.toISOString().split('T')[0]
        
        if (dataByDate[key]) {
          dataByDate[key].revenue += order.total || 0
          dataByDate[key].orders += 1
          dataByDate[key].customers.add(order.customerId)
        }
      })

      const formattedData = Object.values(dataByDate).map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(day.revenue),
        orders: day.orders,
        customers: day.customers.size
      }))

      setChartData(formattedData)

      const productsSnap = await getDocs(collection(db, 'products'))
      const categoryStats = {}
      
      productsSnap.docs.forEach(doc => {
        const product = doc.data()
        const category = product.category || 'Other'
        
        if (!categoryStats[category]) {
          categoryStats[category] = {
            name: category,
            products: 0,
            value: 0
          }
        }
        
        categoryStats[category].products += 1
        categoryStats[category].value += (product.stock || 0) * (product.price || 0)
      })

      setCategoryData(Object.values(categoryStats).slice(0, 8))
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users }
  ]

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-neutral-600">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name}:
            </span>{' '}
            {activeTab === 'revenue' ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-xl font-display font-bold text-neutral-800">
            Performance Analytics
          </h2>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neutral-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        <div className="h-80 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'revenue' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `Rs. ${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              </AreaChart>
            ) : activeTab === 'orders' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="orders" 
                  fill="#3B82F6" 
                  radius={[8, 8, 0, 0]}
                  name="Orders"
                />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Customers"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Product Categories
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                  width={100}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload) return null
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-800 mb-1">
                          {payload[0]?.payload.name}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Products: {payload[0]?.value}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Value: {formatCurrency(payload[0]?.payload.value)}
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar 
                  dataKey="products" 
                  fill="#F59E0B" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}