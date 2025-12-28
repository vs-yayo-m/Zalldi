// src/components/customer/DeliveryBadge.jsx

import React from 'react'
import { Truck, Clock } from 'lucide-react'

export default function DeliveryBadge({ deliveryTime = 60, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
        <Truck className="w-5 h-5 text-orange-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-orange-700">
            {deliveryTime < 60 ? `${deliveryTime} min` : '1 hour'} Delivery
          </p>
          <p className="text-xs text-orange-600">
            Order now, get it fast
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-700">
            Available Now
          </p>
          <p className="text-xs text-green-600">
            Ready for delivery
          </p>
        </div>
      </div>
    </div>
  )
}