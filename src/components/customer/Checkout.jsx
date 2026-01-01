// src/components/customer/Checkout.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import CheckoutStepper from './CheckoutStepper'
import AddressList from './AddressList'
import AddressForm from './AddressForm'
import CartSummary from './CartSummary'
import Button from '@components/ui/Button'
import Alert from '@components/ui/Alert'
import { createOrder } from '@services/order.service'
import { PAYMENT_METHODS } from '@utils/constants'
import { calculateOrderTotal } from '@utils/calculations'
import toast from 'react-hot-toast'
import { MapPin, CreditCard, Package, Plus } from 'lucide-react'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD)
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const orderTotals = calculateOrderTotal(items, 'standard', 0)

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setShowAddressForm(false)
    setError(null)
  }

  const handleAddressCreated = (address) => {
    setSelectedAddress(address)
    setShowAddressForm(false)
    setCurrentStep(2)
    toast.success('Address added successfully')
  }

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      setError('Please select a delivery address')
      return
    }
    setCurrentStep(2)
    setError(null)
  }

  const handleContinueToReview = () => {
    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }
    setCurrentStep(3)
    setError(null)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
      setError('Please complete all required fields')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const orderData = {
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerPhone: user.phoneNumber || '',
        customerEmail: user.email,
        items: items.map(item => ({
          productId: item.id,
          supplierId: item.supplierId || 'default_supplier',
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
        deliveryAddress: {
          ward: selectedAddress.ward,
          area: selectedAddress.area,
          street: selectedAddress.street,
          landmark: selectedAddress.landmark || '',
          coordinates: selectedAddress.coordinates || null
        },
        paymentMethod,
        notes: deliveryNotes || null,
        deliveryType: 'standard',
        status: 'pending',
        paymentStatus: 'pending'
      }

      const order = await createOrder(orderData)
      
      await clearCart()
      
      toast.success('Order placed successfully!')
      
      navigate(`/order-success/${order.id}`, { replace: true })
    } catch (err) {
      console.error('Order placement error:', err)
      setError(err.message || 'Failed to place order. Please try again.')
      toast.error('Failed to place order')
    } finally {
      setIsProcessing(false)
    }
  }

  const steps = [
    { number: 1, label: 'Address', icon: MapPin },
    { number: 2, label: 'Payment', icon: CreditCard },
    { number: 3, label: 'Review', icon: Package }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <CheckoutStepper steps={steps} currentStep={currentStep} />

        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-neutral-900">
                  Delivery Address
                </h2>
                {!showAddressForm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddressForm(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add New
                  </Button>
                )}
              </div>

              {showAddressForm ? (
                <AddressForm
                  onSuccess={handleAddressCreated}
                  onCancel={() => setShowAddressForm(false)}
                />
              ) : (
                <>
                  <AddressList
                    selectedId={selectedAddress?.id}
                    onSelect={handleAddressSelect}
                  />
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleContinueToPayment}
                      disabled={!selectedAddress}
                      size="lg"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-neutral-200 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value={PAYMENT_METHODS.COD}
                    checked={paymentMethod === PAYMENT_METHODS.COD}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary-500 focus:ring-primary-500"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-neutral-900">Cash on Delivery</p>
                    <p className="text-sm text-neutral-600">Pay when you receive your order</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-neutral-200 rounded-xl cursor-not-allowed opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-5 h-5"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-neutral-900">eSewa</p>
                    <p className="text-sm text-neutral-600">Coming soon</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-neutral-200 rounded-xl cursor-not-allowed opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-5 h-5"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-neutral-900">Khalti</p>
                    <p className="text-sm text-neutral-600">Coming soon</p>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  size="lg"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinueToReview}
                  disabled={!paymentMethod}
                  size="lg"
                  className="flex-1"
                >
                  Continue to Review
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
                  Review Order
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Delivery Address</h3>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <p className="text-neutral-900">{selectedAddress?.street}</p>
                      <p className="text-neutral-600">{selectedAddress?.area}, Ward {selectedAddress?.ward}</p>
                      {selectedAddress?.landmark && (
                        <p className="text-neutral-600 text-sm mt-1">Near {selectedAddress.landmark}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Payment Method</h3>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <p className="text-neutral-900">Cash on Delivery</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Delivery Notes (Optional)</h3>
                    <textarea
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    size="lg"
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    loading={isProcessing}
                    size="lg"
                    className="flex-1"
                  >
                    {isProcessing ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartSummary
            items={items}
            totals={orderTotals}
            showCheckout={false}
          />
        </div>
      </div>
    </div>
  )
}