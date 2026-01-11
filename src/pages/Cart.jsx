import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import { getCurrentLocation, getLocationPermissionStatus } from '@services/location.service'
import { notifyAdminNewOrder } from '@services/notification.service'
import { createOrder } from '@services/order.service'
import toast from 'react-hot-toast'
import AddressSelector from '@components/customer/AddressSelector'
import { calculateOrderTotal } from '@utils/calculations'
import { formatCurrency } from '@utils/formatters'

export default function CartPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, clearCart } = useCart()
  
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt')
  const [showAddressModal, setShowAddressModal] = useState(false)
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
    const subtotal = items.reduce((sum, item) => sum + ((item.discountPrice || item.price) * item.quantity), 0)
    const deliveryFee = subtotal >= 599 ? 0 : 59
    const giftFee = giftPackaging ? 99 : 0
    const fulfillmentFee = 10
    const tip = tipAmount
    const total = subtotal + deliveryFee + giftFee + fulfillmentFee + tip
    return { subtotal, deliveryFee, giftFee, fulfillmentFee, tip, total }
  }, [items, giftPackaging, tipAmount])
  
  useEffect(() => {
    const hour = new Date().getHours()
    setStoreOpen(hour >= 6 && hour < 23)
    
    const checkLocationPermission = async () => {
      const status = await getLocationPermissionStatus()
      setLocationPermission(status)
    }
    
    checkLocationPermission()
  }, [])
  
  const requestLocation = async () => {
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
      toast.success('Location captured successfully!', { icon: '📍' })
    } catch (error) {
      toast.error(error.message || 'Could not get location')
    }
  }
  
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
      const orderData = {
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerPhone: user.phoneNumber || '',
        customerEmail: user.email,
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
        total: pricing.total,
        deliveryAddress: selectedAddress,
        location: userLocation || null,
        deliveryType,
        timeSlot: selectedTimeSlot,
        giftPackaging,
        giftMessage,
        instructions: [...instructions, customInstruction].filter(Boolean),
        paymentMethod: 'cod',
        status: 'pending'
      }
      
      const order = await createOrder(orderData)
      
      // --- ONLY FIRESTORE NOTIFICATION, NO WHATSAPP ---
      await notifyAdminNewOrder({ ...order, location: userLocation })
      
      await clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${order.id}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }
  
  if (items.length === 0) return null
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* --- UI COMPONENTS like AddressSelector, Cart Items, Bill Summary remain unchanged --- */}
      <AddressSelector
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedAddress}
        onSelect={setSelectedAddress}
      />

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-2xl">
        <div className="max-w-2xl mx-auto px-3 py-3">
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || !selectedAddress || !storeOpen}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-neutral-300 disabled:to-neutral-400 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg disabled:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? <span>Processing...</span> : <>
              <span>Place Order</span>
              <span className="text-base">•</span>
              <span>{formatCurrency(pricing.total)}</span>
            </>}
          </button>
        </div>
      </div>
    </div>
  )
}