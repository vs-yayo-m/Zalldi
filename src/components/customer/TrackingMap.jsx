// src/components/customer/TrackingMap.jsx (NEW - MAP PLACEHOLDER)

import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

export default function TrackingMap({ order }) {
  const address = order.deliveryAddress
  
  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-orange-600" />
            <path d="M0,60 Q25,40 50,60 T100,60" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-orange-600" />
          </svg>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-xl shadow-orange-200">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <p className="font-black text-neutral-900 text-lg">Delivery Location</p>
          <p className="text-neutral-600 text-sm mt-1">Ward {address.ward}, {address.area}</p>
        </motion.div>

        {order.status === 'out_for_delivery' && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-10 transform -translate-y-1/2"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Navigation className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <MapPin size={16} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-900 mb-1">Live Tracking</p>
          <p className="text-xs text-blue-700">
            {order.status === 'out_for_delivery' 
              ? 'Your order is on the way! Track your delivery in real-time.' 
              : 'Tracking will be available once your order is out for delivery.'}
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-neutral-500 pt-2">
        <p>Google Maps integration available in future update</p>
      </div>
    </div>
  )
}