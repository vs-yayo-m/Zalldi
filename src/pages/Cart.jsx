// src/pages/Cart.jsx (Enhanced Enterprise-Grade)

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import { 
  ArrowLeft, MapPin, ChevronRight, Clock, User, Phone,
  ShieldCheck, Package, AlertCircle, CreditCard, Check
} from 'lucide-react'
import CartItemCompact from '@components/customer/CartItemCompact'
import ProductSuggestions from '@components/customer/ProductSuggestions'
import ServicePreferences from '@components/customer/ServicePreferences'
import BillSummary from '@components/customer/BillSummary'
import AddressSelector from '@components/customer/AddressSelector'
import RecipientDetails from '@components/customer/RecipientDetails'
import PaymentSelector from '@components/customer/PaymentSelector'
import { formatCurrency } from '@utils/formatters'
import { createOrder } from '@services/order.service'
import toast from 'react-hot-toast'

export default function CartPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, clearCart } = useCart()
  
  // Address & Recipient
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  
  // Service Preferences
  const [deliveryType, setDeliveryType] = useState('standard')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [giftPackaging, setGiftPackaging] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [tipAmount, setTipAmount] = useState(0)
  const [instructions, setInstructions] = useState([])
  const [customInstruction, setCustomInstruction] = useState('')
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod')
  
  // State
  const [isProcessing, setIsProcessing] = useState(false)
  const [storeOpen, setStoreOpen] = useState(true)

  // Load saved data on mount
  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`zalldi_recipient_${user.uid}`)
      if (savedData) {
        const { name, phone, address } = JSON.parse(savedData)
        setRecipientName(name || '')
        setRecipientPhone(phone || '')
        if (address) setSelectedAddress(address)
      }
    }
  }, [user])

  // Save data when changed
  useEffect(() => {
    if (user && (recipientName || recipientPhone || selectedAddress)) {
      localStorage.setItem(`zalldi_recipient_${user.uid}`, JSON.stringify({
        name: recipientName,
        phone: recipientPhone,
        address: selectedAddress
      }))
    }
  }, [user, recipientName, recipientPhone, selectedAddress])

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

  useEffect(() => {
    const hour = new Date().getHours()
    setStoreOpen(hour >= 6 && hour < 23)
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop')
    }
  }, [items, navigate])

  const validateOrder = () => {
    if (!user) {
      navigate('/login?redirect=/cart')
      return false
    }

    if (!selectedAddress) {
      setShowAddressModal(true)
      toast.error('Please select delivery address')
      return false
    }

    if (!recipientName.trim()) {
      toast.error('Please enter recipient name')
      return false
    }

    if (!recipientPhone.trim()) {
      toast.error('Please enter recipient phone number')
      return false
    }

    if (!storeOpen) {
      toast.error('Store is currently closed (6 AM - 11 PM)')
      return false
    }

    const outOfStock = items.find(item => item.stock < 1)
    if (outOfStock) {
      toast.error(`${outOfStock.name} is out of stock`)
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateOrder()) return

    setIsProcessing(true)

    try {
      const orderData = {
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerPhone: user.phoneNumber || '',
        customerEmail: user.email,
        
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
        status: 'pending'
      }

      const order = await createOrder(orderData)
      await clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate(`/order-success/${order.id}`)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-3 py-2.5 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          
          <div className="flex-1 ml-3">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
              Checkout Cart
            </div>
            <div className="text-xs font-black text-neutral-900">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-500 bg-orange-50 px-2 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>60 min</span>
          </div>
        </div>
      </div>

      {/* Main Content - Add padding for mobile nav */}
      <div className="max-w-2xl mx-auto pb-[180px] md:pb-32">
        
        {/* Cart Items */}
        <div className="mx-3 mt-3 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="px-4 py-3 border-b border-neutral-100">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Order Items
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

        {/* Address Selection */}
        <div className="mx-3 mt-4">
          <h3 className="text-xs font-black text-neutral-700 uppercase tracking-wide mb-3 px-1">
            Delivery Address
          </h3>
          
          <button
            onClick={() => setShowAddressModal(true)}
            className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
              selectedAddress
                ? 'border-green-500 bg-green-50'
                : 'border-orange-500 bg-orange-50 animate-pulse'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 flex-shrink-0 ${selectedAddress ? 'text-green-600' : 'text-orange-600'}`} />
              <div className="flex-1 min-w-0">
                {selectedAddress ? (
                  <>
                    <div className="text-xs font-black text-neutral-900 mb-1">
                      {selectedAddress.area}, Ward {selectedAddress.ward}
                    </div>
                    <div className="text-[10px] text-neutral-600">
                      {selectedAddress.street}
                      {selectedAddress.landmark && ` • Near ${selectedAddress.landmark}`}
                    </div>
                  </>
                ) : (
                  <div className="text-sm font-bold text-orange-700">
                    Tap to add delivery address
                  </div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            </div>
          </button>
        </div>

        {/* Recipient Details */}
        <RecipientDetails
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          recipientPhone={recipientPhone}
          setRecipientPhone={setRecipientPhone}
        />

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

        {/* Payment Method */}
        <PaymentSelector
          selectedMethod={paymentMethod}
          onSelect={setPaymentMethod}
        />

        {/* Bill Summary */}
        <BillSummary pricing={pricing} />

        {/* Trust Indicators */}
        <div className="mx-3 mt-4 grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-bold text-neutral-700">100% Secure</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600" />
            <span className="text-[10px] font-bold text-neutral-700">Quality Assured</span>
          </div>
        </div>

        {/* Policy */}
        <div className="mx-3 mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
          <p className="text-[9px] text-neutral-500 leading-relaxed text-center">
            <span className="font-bold">Cancellation policy:</span> Orders are non-refundable once placed. Please verify all details before confirming.
          </p>
        </div>
      </div>

      {/* Sticky Bottom CTA - Above mobile nav */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-2xl">
        <div className="max-w-2xl mx-auto px-3 py-3">
          {/* Warnings */}
          {!storeOpen && (
            <div className="mb-2 p-2 bg-red-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-[11px] font-bold text-red-700">Store closed • Opens at 6:00 AM</span>
            </div>
          )}
          
          {!selectedAddress && (
            <div className="mb-2 p-2 bg-orange-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="text-[11px] font-bold text-orange-700">Add delivery address to continue</span>
            </div>
          )}

          {(!recipientName || !recipientPhone) && (
            <div className="mb-2 p-2 bg-orange-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="text-[11px] font-bold text-orange-700">Fill recipient details to continue</span>
            </div>
          )}

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || !selectedAddress || !storeOpen || !recipientName || !recipientPhone}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-neutral-300 disabled:to-neutral-400 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg disabled:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
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

      {/* Modals */}
      <AddressSelector
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedAddress}
        onSelect={setSelectedAddress}
      />
    </div>
  )
}