// src/components/supplier/DashboardStats.jsx

import { motion } from 'framer-motion'
import { formatCurrency } from '@utils/formatters'
import { Package, TrendingUp, Clock, CheckCircle, DollarSign, ShoppingBag } from 'lucide-react'

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      color: 'bg-green-100 text-green-600',
      change: stats.todayRevenue > 0 ? `+${formatCurrency(stats.todayRevenue)} today` : null
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: stats.totalOrders,
      color: 'bg-blue-100 text-blue-600',
      change: stats.todayOrders > 0 ? `+${stats.todayOrders} today` : null
    },
    {
      icon: Clock,
      label: 'Pending Orders',
      value: stats.pendingOrders,
      color: 'bg-orange-100 text-orange-600',
      highlight: stats.pendingOrders > 0
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats.completedOrders,
      color: 'bg-primary-100 text-primary-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`
              bg-white rounded-2xl shadow-card p-6
              ${stat.highlight ? 'ring-2 ring-orange-500' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              {stat.highlight && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-orange-500 rounded-full"
                />
              )}
            </div>
            
            <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {stat.value}
            </p>
            
            {stat.change && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}