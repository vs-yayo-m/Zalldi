// src/components/supplier/OrdersChart.jsx

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function OrdersChart({ orders }) {
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
        return orderDate.getTime() === date.getTime()
      })
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pending: dayOrders.filter(o => ['pending', 'confirmed'].includes(o.status)).length,
        completed: dayOrders.filter(o => o.status === 'delivered').length,
        cancelled: dayOrders.filter(o => o.status === 'cancelled').length
      })
    }
    
    return last7Days
  }, [orders])
  
  const totalOrders = chartData.reduce((sum, day) =>
    sum + day.pending + day.completed + day.cancelled, 0
  )
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="mb-6">
        <h3 className="font-display text-xl font-bold text-neutral-900 mb-1">
          Orders Overview
        </h3>
        <p className="text-sm text-neutral-600">Last 7 days</p>
        <p className="text-2xl font-bold text-neutral-900 mt-2">
          {totalOrders} Orders
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Bar 
            dataKey="completed" 
            fill="#10B981" 
            name="Completed"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="pending" 
            fill="#F59E0B" 
            name="Pending"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="cancelled" 
            fill="#EF4444" 
            name="Cancelled"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}