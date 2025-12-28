// src/components/customer/OrderTimeline.jsx

import { motion } from 'framer-motion'
import { formatDateTime } from '@utils/formatters'
import { ORDER_STATUS_LABELS } from '@utils/constants'
import {
  ShoppingCart,
  CheckCircle,
  Package,
  PackageCheck,
  Truck,
  Home,
  XCircle
} from 'lucide-react'

const statusIcons = {
  pending: ShoppingCart,
  confirmed: CheckCircle,
  picking: Package,
  packing: PackageCheck,
  out_for_delivery: Truck,
  delivered: Home,
  cancelled: XCircle
}

const statusColors = {
  pending: 'bg-blue-100 text-blue-600',
  confirmed: 'bg-green-100 text-green-600',
  picking: 'bg-orange-100 text-orange-600',
  packing: 'bg-purple-100 text-purple-600',
  out_for_delivery: 'bg-primary-100 text-primary-600',
  delivered: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-600'
}

const statusOrder = [
  'pending',
  'confirmed',
  'picking',
  'packing',
  'out_for_delivery',
  'delivered'
]

export default function OrderTimeline({ order }) {
  const currentStatusIndex = statusOrder.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  
  const getStepStatus = (index) => {
    if (isCancelled) {
      return index === 0 ? 'completed' : 'cancelled'
    }
    if (index < currentStatusIndex) return 'completed'
    if (index === currentStatusIndex) return 'current'
    return 'upcoming'
  }
  
  const getHistoryForStatus = (status) => {
    return order.statusHistory?.find(h => h.status === status)
  }
  
  const steps = isCancelled ?
    [
      { status: 'pending', label: ORDER_STATUS_LABELS.pending },
      { status: 'cancelled', label: ORDER_STATUS_LABELS.cancelled }
    ] :
    statusOrder.map(status => ({
      status,
      label: ORDER_STATUS_LABELS[status]
    }))
  
  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(index)
        const Icon = statusIcons[step.status]
        const history = getHistoryForStatus(step.status)
        const isLast = index === steps.length - 1

        return (
          <div key={step.status} className="relative">
            {!isLast && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-neutral-200">
                {stepStatus === 'completed' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full bg-green-500"
                  />
                )}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: index * 0.1 }}
                className={`
                  relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${stepStatus === 'completed' ? 'bg-green-500 text-white' : ''}
                  ${stepStatus === 'current' ? statusColors[step.status] : ''}
                  ${stepStatus === 'upcoming' ? 'bg-neutral-200 text-neutral-400' : ''}
                  ${stepStatus === 'cancelled' ? 'bg-red-500 text-white' : ''}
                `}
              >
                <Icon className="w-5 h-5" />
                
                {stepStatus === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary-200"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                  <p className={`
                    font-semibold
                    ${stepStatus === 'completed' || stepStatus === 'current' ? 'text-neutral-900' : 'text-neutral-500'}
                    ${stepStatus === 'cancelled' ? 'text-red-600' : ''}
                  `}>
                    {step.label}
                  </p>
                  {history && (
                    <span className="text-sm text-neutral-500">
                      {formatDateTime(history.timestamp.toDate())}
                    </span>
                  )}
                </div>
                
                {history?.note && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {history.note}
                  </p>
                )}

                {stepStatus === 'current' && !isCancelled && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-full bg-primary-500"
                        />
                      </div>
                      <span className="text-xs text-primary-600 font-medium">
                        In Progress
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}