// src/components/customer/PaymentSelector.jsx

import { CreditCard, Package, Check } from 'lucide-react'

export default function PaymentSelector({ selectedMethod, onSelect }) {
  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: Package,
      available: true,
      badge: null
    },
    {
      id: 'esewa',
      name: 'eSewa',
      description: 'Digital wallet payment',
      icon: CreditCard,
      available: false,
      badge: 'Coming Soon'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      description: 'Digital wallet payment',
      icon: CreditCard,
      available: false,
      badge: 'Coming Soon'
    }
  ]

  return (
    <div className="mx-3 mt-4">
      <h3 className="text-xs font-black text-neutral-700 uppercase tracking-wide mb-3 px-1">
        Payment Method
      </h3>

      <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id

          return (
            <button
              key={method.id}
              onClick={() => method.available && onSelect(method.id)}
              disabled={!method.available}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : method.available
                  ? 'border-neutral-200 hover:border-orange-300'
                  : 'border-neutral-100 bg-neutral-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'bg-orange-500'
                    : method.available
                    ? 'bg-neutral-100'
                    : 'bg-neutral-200'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isSelected
                      ? 'text-white'
                      : method.available
                      ? 'text-neutral-600'
                      : 'text-neutral-400'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-neutral-900">
                      {method.name}
                    </span>
                    {method.badge && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded uppercase">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-600">
                    {method.description}
                  </span>
                </div>

                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}

        {/* Info Note */}
        <div className="mt-4 p-3 bg-green-50 rounded-xl">
          <p className="text-[10px] text-green-700 leading-relaxed">
            <span className="font-bold">Currently accepting:</span> Cash payments only. Digital wallet options will be available soon for faster checkout!
          </p>
        </div>
      </div>
    </div>
  )
}