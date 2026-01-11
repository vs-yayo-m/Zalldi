// src/components/customer/OrderCard.jsx (NEW - REUSABLE)

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ChevronRight } from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/utils/formatters'
import { ORDER_STATUS_LABELS } from '@/utils/constants'

export default function OrderCard({ order, index = 0 }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      picking: 'bg-purple-100 text-purple-700',
      packing: 'bg-indigo-100 text-indigo-700',
      out_for_delivery: 'bg-orange-100 text-orange-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-neutral-100 text-neutral-700'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/customer/orders/${order.id}`}
        className="block bg-white rounded-2xl p-6 hover:shadow-md transition-all border border-neutral-100 hover:border-orange-200 group"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-neutral-500 mb-1">
              Order #{order.orderNumber}
            </p>
            <p className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(order.createdAt)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {order.items?.slice(0, 3).map((item, idx) => (
            <div key={idx} className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
          {order.items?.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-black text-neutral-900">
              {formatCurrency(order.total)}
            </p>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}