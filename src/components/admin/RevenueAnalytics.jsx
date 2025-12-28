// src/components/admin/RevenueAnalytics.jsx

import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@utils/formatters'
import Card from '@components/ui/Card'
import Tabs from '@components/ui/Tabs'
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export default function RevenueAnalytics({ data, timeRange }) {
  const [activeChart, setActiveChart] = useState('revenue')
  
  const tabs = [
    { id: 'revenue', label: 'Revenue Trend', icon: DollarSign },
    { id: 'orders', label: 'Order Volume', icon: ShoppingCart },
    { id: 'comparison', label: 'Comparison', icon: TrendingUp }
  ]
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="text-sm text-neutral-600">{entry.name}:</span>
            <span className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name.includes('Revenue') ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-neutral-800">
            Revenue Analytics
          </h2>
          <div className="text-sm text-neutral-600">
            Period: {timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeChart}
          onChange={setActiveChart}
          className="mb-6"
        />

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'revenue' ? (
              <AreaChart data={data}>
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
                  name="Total Revenue"
                />
              </AreaChart>
            ) : activeChart === 'orders' ? (
              <BarChart data={data}>
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
              <LineChart data={data}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Total Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="platformRevenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Platform Revenue"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-200">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-neutral-800">
              {formatCurrency(data.reduce((sum, day) => sum + day.revenue, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Platform Revenue</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(data.reduce((sum, day) => sum + day.platformRevenue, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
            <p className="text-lg font-bold text-blue-600">
              {data.reduce((sum, day) => sum + day.orders, 0)}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}