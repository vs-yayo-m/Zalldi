// src/pages/Cart.jsx (With Recipient Details & Payment Options)

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import { 
  ArrowLeft, MapPin, ChevronRight, Clock, Gift, 
  MessageSquare, Zap, ShieldCheck, User, Phone,
  Package, CreditCard, AlertCircle, CheckCircle
} from 'lucide-react'
import CartItemCompact from '@components/customer/CartItemCompact'
import ProductSuggestions from '@components/customer/ProductSuggestions'
import ServicePreferences from '@components/customer/ServicePreferences'
import BillSummary from '@components/customer/BillSummary'
import AddressSelector from '@components/customer/AddressSelector'
import { calculateOrderTotal } from '@utils/calculations'
import { formatCurrency } from '@utils/formatters'
import { createOrder } from '@services/order.service'
import { getCurrentLocation } from '@services/location.service'
import { createAdminNotification } from '@services/notification.service'
import toast from 'react-hot-toast'

export default function CartPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, clearCart } = useCart()
  
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  
  // Recipient Details
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('cod')
  
  const [deliveryType, setDeliveryType] = useState('standard')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [giftPackaging, setGiftPackaging] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [tipAmount, setTipAmount] = useState(0)
  const [instructions, setInstructions] = useState([])
  const [customInstruction, setCustomInstruction] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [storeOpen, setStoreOpen] = useState(true)

  const pricing = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.discountPrice || item.price
      return sum + (price * item.quantity)
    }, 0)
    
    const mrpTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discount = mrpTotal - subtotal
    const discountPercent = mrpTotal > 0 ? ((discount / mrpTotal) * 100).toFixed(0) : 0
    
    const fulfillmentFee = 10
    const deliveryFee = subtotal >= 599 ? 0 : 59
    const giftFee = giftPackaging ? 99 : 0
    const tip = tipAmount
    
    const total = subtotal + fulfillmentFee + deliveryFee + giftFee + tip
    
    return {
      mrpTotal,
      subtotal,
      discount,
      discountPercent,
      fulfillmentFee,
      deliveryFee,
      giftFee,
      tip,
      total,
      savings: discount
    }
  }, [items, giftPackaging, tipAmount])

  // Load saved recipient details
  useEffect(() => {
    const savedRecipient = localStorage.getItem('zalldi_recipient_details')
    if (savedRecipient) {
      try {
        const data = JSON.parse(savedRecipient)
        setRecipientName(data.name || '')
        setRecipientPhone(data.phone || '')
      } catch (error) {
        console.error('Error loading recipient details:', error)
      }
    }
  }, [])

  // Save recipient details whenever they change
  useEffect(() => {
    if (recipientName || recipientPhone) {
      localStorage.setItem('zalldi_recipient_details', JSON.stringify({
        name: recipientName,
        phone: recipientPhone
      }))
    }
  }, [recipientName, recipientPhone])

  useEffect(() => {
    const hour = new Date().getHours()
    setStoreOpen(hour >= 6 && hour < 23)
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop')
    }
  }, [items, navigate])

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login?redirect=/cart')
      return
    }

    if (!selectedAddress) {
      setShowAddressModal(true)
      toast.error('Please select delivery address')
      return
    }

    if (!recipientName.trim()) {
      toast.error('Please enter recipient name')
      document.getElementById('recipient-name')?.focus()
      return
    }

    if (!recipientPhone.trim()) {
      toast.error('Please enter recipient phone number')
      document.getElementById('recipient-phone')?.focus()
      return
    }

    if (!storeOpen) {
      toast.error('Store is currently closed')
      return
    }

    const outOfStock = items.find(item => item.stock < 1)
    if (outOfStock) {
      toast.error(`${outOfStock.name} is out of stock`)
      return
    }

    setIsProcessing(true)

    try {
      let location = null
      try {
        location = await getCurrentLocation()
      } catch (error) {
        console.warn('Could not capture location:', error)
      }

      const orderData = {
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerPhone: user.phoneNumber || '',
        customerEmail: user.email,
        
        // Recipient Details
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          image: item.images?.[0] || '',
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          total: (item.discountPrice || item.price) * item.quantity
        })),
        subtotal: pricing.subtotal,
        deliveryFee: pricing.deliveryFee,
        fulfillmentFee: pricing.fulfillmentFee,
        giftFee: pricing.giftFee,
        tip: pricing.tip,
        discount: pricing.discount,
        total: pricing.total,
        deliveryAddress: selectedAddress,
        deliveryType,
        timeSlot: selectedTimeSlot,
        giftPackaging,
        giftMessage,
        instructions: [...instructions, customInstruction].filter(Boolean),
        paymentMethod,
        status: 'pending',
        location: location || null
      }

      const order = await createOrder(orderData)
      
      try {
        await createAdminNotification(order)
      } catch (notifError) {
        console.error('Error creating admin notification:', notifError)
      }

      await clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${order.id}`)
    } catch (error) {
      toast.error('Failed to place order')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Compact Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-3 py-2.5 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          
          <div className="flex-1 ml-3">
            <button
              onClick={() => setShowAddressModal(true)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-2">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                  Delivering to
                </div>
                {!selectedAddress && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded uppercase">
                    Select
                  </span>
                )}
              </div>
              {selectedAddress ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-neutral-900 truncate">
                    {selectedAddress.area}, Ward {selectedAddress.ward}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                </div>
              ) : (
                <div className="text-xs text-orange-600 font-bold mt-0.5">
                  Tap to add address
                </div>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            <span>~60 min</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto pb-44">
        {/* ETA Banner */}
        <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-black text-orange-900">Zalldi is coming in ~60 minutes</div>
              <div className="text-[10px] font-bold text-orange-700">Fresh delivery to your doorstep</div>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="mx-3 mt-3 bg-white rounded-xl border border-neutral-200">
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Your Items ({items.length})
            </h2>
          </div>
          
          <div className="divide-y divide-neutral-100">
            {items.map((item) => (
              <CartItemCompact key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Product Suggestions */}
        <ProductSuggestions currentItems={items} />

        {/* Recipient Details - MANDATORY */}
        <div className="mx-3 mt-3 bg-white rounded-xl border-2 border-orange-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-orange-600" />
            <div className="flex-1">
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
                Recipient Details
              </h3>
              <p className="text-[10px] font-bold text-orange-600 uppercase">Mandatory</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="recipient-name" className="block text-xs font-bold text-neutral-700 mb-1.5">
                Receiver Name *
              </label>
              <input
                id="recipient-name"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Who will receive this order?"
                className="w-full px-3 py-2.5 border-2 border-neutral-200 rounded-lg text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="recipient-phone" className="block text-xs font-bold text-neutral-700 mb-1.5">
                Phone Number *
              </label>
              <input
                id="recipient-phone"
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className="w-full px-3 py-2.5 border-2 border-neutral-200 rounded-lg text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                required
              />
            </div>

            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 leading-relaxed">
                Your details are saved and will be auto-filled for future orders
              </p>
            </div>
          </div>
        </div>

        {/* Service Preferences */}
        <ServicePreferences
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          giftPackaging={giftPackaging}
          setGiftPackaging={setGiftPackaging}
          giftMessage={giftMessage}
          setGiftMessage={setGiftMessage}
          tipAmount={tipAmount}
          setTipAmount={setTipAmount}
          instructions={instructions}
          setInstructions={setInstructions}
          customInstruction={customInstruction}
          setCustomInstruction={setCustomInstruction}
        />

        {/* Payment Options */}
        <div className="mx-3 mt-3 bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Payment Method
            </h3>
          </div>

          <div className="space-y-2">
            {/* Cash on Delivery */}
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                paymentMethod === 'cod'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'border-orange-500' : 'border-neutral-300'
                }`}>
                  {paymentMethod === 'cod' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-neutral-900">Cash on Delivery</div>
                  <div className="text-[10px] text-neutral-500">Pay when you receive</div>
                </div>
                <Package className="w-5 h-5 text-neutral-400" />
              </div>
            </button>

            {/* eSewa - Coming Soon */}
            <div className="relative">
              <div className="w-full p-3 rounded-xl border-2 border-neutral-100 bg-neutral-50 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-neutral-700">eSewa</div>
                    <div className="text-[10px] text-orange-600 font-bold uppercase">Coming Soon</div>
                  </div>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.png" 
                    alt="eSewa" 
                    className="h-6 w-auto grayscale opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Khalti - Coming Soon */}
            <div className="relative">
              <div className="w-full p-3 rounded-xl border-2 border-neutral-100 bg-neutral-50 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-neutral-700">Khalti</div>
                    <div className="text-[10px] text-orange-600 font-bold uppercase">Coming Soon</div>
                  </div>
                  <div className="h-6 w-12 bg-purple-600 rounded opacity-50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <BillSummary pricing={pricing} />

        {/* Trust Indicators */}
        <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-bold text-neutral-700">Safe & Secure</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600" />
            <span className="text-[10px] font-bold text-neutral-700">Quality Checked</span>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mx-3 mt-3 mb-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
          <p className="text-[9px] text-neutral-500 leading-relaxed">
            <span className="font-bold">Cancellation policy:</span> Please double-check your order and address details. Orders are non-refundable once placed.
          </p>
        </div>
      </div>

      {/* Sticky Bottom CTA - Positioned above mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-2xl pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-3 py-3">
          {!storeOpen && (
            <div className="mb-2 p-2 bg-red-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-[11px] font-bold text-red-700">Store closed. Opens at 6:00 AM</span>
            </div>
          )}
          
          {!selectedAddress && (
            <div className="mb-2 p-2 bg-orange-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="text-[11px] font-bold text-orange-700">Select delivery address to continue</span>
            </div>
          )}

          {(!recipientName || !recipientPhone) && (
            <div className="mb-2 p-2 bg-orange-50 rounded-lg flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="text-[11px] font-bold text-orange-700">Please fill recipient details above</span>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || !selectedAddress || !storeOpen || !recipientName || !recipientPhone}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-neutral-300 disabled:to-neutral-400 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg disabled:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>Place Order</span>
                <span className="text-base">•</span>
                <span>{formatCurrency(pricing.total)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Address Modal */}
      <AddressSelector
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedAddress}
        onSelect={setSelectedAddress}
      />
    </div>
  )
}