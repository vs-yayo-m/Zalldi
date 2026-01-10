// src/components/customer/ServicePreferences.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Gift, Heart, MessageSquare, Check, ChevronDown } from 'lucide-react'

export default function ServicePreferences({
  deliveryType,
  setDeliveryType,
  selectedTimeSlot,
  setSelectedTimeSlot,
  giftPackaging,
  setGiftPackaging,
  giftMessage,
  setGiftMessage,
  tipAmount,
  setTipAmount,
  instructions,
  setInstructions,
  customInstruction,
  setCustomInstruction
}) {
  const [showTimeSlots, setShowTimeSlots] = useState(false)
  const [showGiftInput, setShowGiftInput] = useState(false)
  const [showCustomTip, setShowCustomTip] = useState(false)
  const [customTipValue, setCustomTipValue] = useState('')

  const timeSlots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM'
  ]

  const instructionOptions = [
    { id: 'door', label: 'Leave at door', icon: '🚪' },
    { id: 'call', label: 'Avoid calling', icon: '📵' },
    { id: 'ring', label: 'Avoid ringing bell', icon: '🔕' },
    { id: 'security', label: 'Leave with security', icon: '🛡️' }
  ]

  const handleInstructionToggle = (id) => {
    setInstructions(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleCustomTipSubmit = () => {
    const value = parseFloat(customTipValue)
    if (!isNaN(value) && value > 0) {
      setTipAmount(value)
      setShowCustomTip(false)
      setCustomTipValue('')
    }
  }

  return (
    <div className="mx-3 mt-3 space-y-2">
      <h2 className="text-xs font-black text-neutral-700 uppercase tracking-wide px-1">
        Preferences
      </h2>

      {/* Delivery Type */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3">
        <div className="text-[10px] font-black text-neutral-500 uppercase tracking-wider mb-2">
          Delivery Type
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => {
              setDeliveryType('standard')
              setSelectedTimeSlot(null)
            }}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              deliveryType === 'standard'
                ? 'border-orange-500 bg-orange-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <div>
                  <div className="text-xs font-bold text-neutral-900">Standard (60 min)</div>
                  <div className="text-[10px] text-neutral-500">As fast as possible</div>
                </div>
              </div>
              {deliveryType === 'standard' && (
                <Check className="w-4 h-4 text-orange-600" />
              )}
            </div>
          </button>

          <button
            onClick={() => {
              setDeliveryType('custom')
              setShowTimeSlots(!showTimeSlots)
            }}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              deliveryType === 'custom'
                ? 'border-orange-500 bg-orange-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <div>
                  <div className="text-xs font-bold text-neutral-900">Select Time Slot</div>
                  {selectedTimeSlot && (
                    <div className="text-[10px] text-orange-600 font-bold">{selectedTimeSlot}</div>
                  )}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTimeSlots ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {showTimeSlots && deliveryType === 'custom' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedTimeSlot(slot)
                        setShowTimeSlots(false)
                      }}
                      className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-orange-500 bg-orange-50 text-orange-900'
                          : 'border-neutral-200 hover:border-orange-300 text-neutral-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Gift Packaging */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3">
        <button
          onClick={() => {
            setGiftPackaging(!giftPackaging)
            if (!giftPackaging) setShowGiftInput(true)
          }}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-orange-600" />
            <div className="text-left">
              <div className="text-xs font-bold text-neutral-900">Gift Packaging</div>
              <div className="text-[10px] text-neutral-500">Special wrapping for Rs. 99</div>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-full transition-colors ${giftPackaging ? 'bg-orange-500' : 'bg-neutral-300'}`}>
            <div className={`w-5 h-5 mt-0.5 bg-white rounded-full shadow-sm transition-transform ${giftPackaging ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
        </button>

        <AnimatePresence>
          {giftPackaging && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Add a personal message (optional)"
                className="w-full mt-3 p-2 border border-neutral-200 rounded-lg text-xs resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                rows={2}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tip */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-orange-600" />
          <div>
            <div className="text-xs font-bold text-neutral-900">Tip your delivery partner</div>
            <div className="text-[10px] text-neutral-500">100% goes to them</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[30, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => setTipAmount(amount)}
              className={`p-2 rounded-lg border-2 text-xs font-bold transition-all ${
                tipAmount === amount
                  ? 'border-orange-500 bg-orange-50 text-orange-900'
                  : 'border-neutral-200 hover:border-orange-300 text-neutral-700'
              }`}
            >
              Rs. {amount}
            </button>
          ))}
          <button
            onClick={() => setShowCustomTip(true)}
            className={`p-2 rounded-lg border-2 text-xs font-bold transition-all ${
              tipAmount > 0 && ![30, 50, 100].includes(tipAmount)
                ? 'border-orange-500 bg-orange-50 text-orange-900'
                : 'border-neutral-200 hover:border-orange-300 text-neutral-700'
            }`}
          >
            {tipAmount > 0 && ![30, 50, 100].includes(tipAmount) ? `Rs. ${tipAmount}` : 'Custom'}
          </button>
        </div>

        <AnimatePresence>
          {showCustomTip && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customTipValue}
                  onChange={(e) => setCustomTipValue(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 p-2 border border-neutral-200 rounded-lg text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                />
                <button
                  onClick={handleCustomTipSubmit}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
                >
                  Set
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {tipAmount === 0 && (
          <button
            onClick={() => setTipAmount(30)}
            className="w-full mt-2 text-[10px] text-orange-600 font-bold hover:underline"
          >
            Skip tip
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-orange-600" />
          <div className="text-xs font-bold text-neutral-900">Delivery Instructions</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {instructionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleInstructionToggle(option.id)}
              className={`p-2 rounded-lg border-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                instructions.includes(option.id)
                  ? 'border-orange-500 bg-orange-50 text-orange-900'
                  : 'border-neutral-200 hover:border-orange-300 text-neutral-700'
              }`}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={customInstruction}
          onChange={(e) => setCustomInstruction(e.target.value)}
          placeholder="Add any special instructions..."
          className="w-full p-2 border border-neutral-200 rounded-lg text-xs resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
          rows={2}
        />
      </div>
    </div>
  )
}