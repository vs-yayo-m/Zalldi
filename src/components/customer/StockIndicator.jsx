// src/components/customer/StockIndicator.jsx

import React from 'react'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function StockIndicator({ stock, className = '' }) {
  const getStockStatus = () => {
    if (stock === 0) {
      return {
        icon: XCircle,
        text: 'Out of Stock',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200'
      }
    }
    
    if (stock < 10) {
      return {
        icon: AlertCircle,
        text: `Only ${stock} left in stock`,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200'
      }
    }
    
    return {
      icon: CheckCircle,
      text: 'In Stock',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    }
  }
  
  const status = getStockStatus()
  const Icon = status.icon
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${status.bg} border ${status.border} rounded-lg ${className}`}>
      <Icon className={`w-4 h-4 ${status.color}`} />
      <span className={`text-sm font-medium ${status.color}`}>
        {status.text}
      </span>
    </div>
  )
}