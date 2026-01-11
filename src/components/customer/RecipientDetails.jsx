// src/components/customer/RecipientDetails.jsx

import { User, Phone, AlertCircle } from 'lucide-react'

export default function RecipientDetails({
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone
}) {
  return (
    <div className="mx-3 mt-4">
      <div className="flex items-center gap-2 mb-3 px-1">
        <h3 className="text-xs font-black text-neutral-700 uppercase tracking-wide">
          Recipient Details
        </h3>
        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black rounded uppercase">
          Required
        </span>
      </div>

      <div className="bg-white rounded-2xl border-2 border-neutral-200 p-4 space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-2">
            Receiver Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Who will receive this order?"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all outline-none text-sm font-medium ${
                recipientName
                  ? 'border-green-500 bg-green-50/30'
                  : 'border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'
              }`}
              required
            />
          </div>
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="98xxxxxxxx"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all outline-none text-sm font-medium ${
                recipientPhone
                  ? 'border-green-500 bg-green-50/30'
                  : 'border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'
              }`}
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 leading-relaxed">
            <span className="font-bold">Saved for future:</span> These details will be auto-filled in your next order. You can change them anytime.
          </p>
        </div>
      </div>
    </div>
  )
}