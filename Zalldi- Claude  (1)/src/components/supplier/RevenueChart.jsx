// src/components/supplier/RevenueChart.jsx

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@utils/formatters'

export default function RevenueChart({ orders }) {
  const chartData = useMemo(() => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        orderDate.setHours(0, 0, 0, 0)
        return orderDate.getTime() === date.getTime() && order.status === 'delivered'
      })
      
      const revenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue
      })
    }
    
    return last7Days
  }, [orders])
  
  const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0)
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="mb-6">
        <h3 className="font-display text-xl font-bold text-neutral-900 mb-1">
          Revenue Overview
        </h3>
        <p className="text-sm text-neutral-600">Last 7 days</p>
        <p className="text-2xl font-bold text-primary-600 mt-2">
          {formatCurrency(totalRevenue)}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `Rs ${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            formatter={(value) => [formatCurrency(value), 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#FF6B35"
            strokeWidth={3}
            dot={{ fill: '#FF6B35', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}