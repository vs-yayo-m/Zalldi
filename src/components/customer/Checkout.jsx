// src/components/customer/Checkout.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, CreditCard, MapPin, Clock, AlertCircle } from 'lucide-react'
import CheckoutStepper from './CheckoutStepper'
import AddressList from './AddressList'
import AddressForm from './AddressForm'
import CartSummary from './CartSummary'
import Button from '@components/ui/Button'
import { useAuth } from '@hooks/useAuth'
import { useCart } from '@hooks/useCart'
import { orderService } from '@services/order.service'
import { notificationService } from '@services/notification.service'
import { ROUTES, PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '@utils/constants'
import { formatCurrency } from '@utils/formatters'
import { calculateOrderTotal } from '@utils/calculations'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, clearCart } = useCart()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD)
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const orderTotals = calculateOrderTotal(items, 'standard', 0)

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0]
      setSelectedAddress(defaultAddress)
    }
  }, [user])

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setShowAddressForm(false)
  }

  const handleAddressAdded = (newAddress) => {
    setSelectedAddress(newAddress)
    setShowAddressForm(false)
    setCurrentStep(2)
  }

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }
    setCurrentStep(2)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        customerId: user.uid,
        customerName: user.displayName,
        customerPhone: user.phoneNumber,
        customerEmail: user.email,
        items: items.map(item => ({
          productId: item.id,
          supplierId: item.supplierId,
          name: item.name,
          image: item.images?.[0] || '',
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        subtotal: orderTotals.subtotal,
        deliveryFee: orderTotals.deliveryFee,
        discount: orderTotals.discount,
        total: orderTotals.total,
        deliveryAddress: selectedAddress,
        deliveryType: 'standard',
        paymentMethod,
        paymentStatus: 'pending',
        notes
      }

      const order = await orderService.createOrder(orderData)

      await notificationService.notifyOrderPlaced(order)

      clearCart()

      toast.success('Order placed successfully!')
      navigate(`/order-success/${order.id}`)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-card p-6 lg:p-8"
        >
          <h1 className="text-display font-display font-bold text-neutral-800 mb-6">
            Checkout
          </h1>

          <CheckoutStepper currentStep={currentStep} />

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <h2 className="text-heading font-semibold text-neutral-800">
                        Delivery Address
                      </h2>
                    </div>
                    {!showAddressForm && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowAddressForm(true)}
                      >
                        Add New Address
                      </Button>
                    )}
                  </div>

                  {showAddressForm ? (
                    <AddressForm
                      onSuccess={handleAddressAdded}
                      onCancel={() => setShowAddressForm(false)}
                    />
                  ) : (
                    <AddressList
                      selectedAddress={selectedAddress}
                      onSelectAddress={handleAddressSelect}
                    />
                  )}

                  {!showAddressForm && (
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleContinueToPayment}
                        disabled={!selectedAddress}
                        className="min-w-[200px]"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-heading font-semibold text-neutral-800">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                      <motion.button
                        key={key}
                        onClick={() => setPaymentMethod(key)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`
                          w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${paymentMethod === key 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-neutral-200 hover:border-orange-200'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${paymentMethod === key ? 'border-orange-500' : 'border-neutral-300'}
                            `}>
                              {paymentMethod === key && (
                                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                              )}
                            </div>
                            <span className="font-medium text-neutral-800">{label}</span>
                          </div>
                          {key === PAYMENT_METHODS.COD && (
                            <span className="text-caption text-green-600 font-medium">
                              Available
                            </span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <p className="text-body-sm text-neutral-700">
                      Your order will be delivered within <strong className="text-orange-600">1 hour</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="min-w-[200px]"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Order Information</h3>
              <ul className="space-y-2 text-body-sm text-neutral-600">
                <li>• All products are quality checked before delivery</li>
                <li>• Delivery within 1 hour or it's free</li>
                <li>• Cash on Delivery available for all orders</li>
                <li>• 100% satisfaction guaranteed</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="lg:sticky lg:top-24 h-fit"
      >
        <CartSummary
          items={items}
          showCheckoutButton={false}
        />
      </motion.div>
    </div>
  )
}