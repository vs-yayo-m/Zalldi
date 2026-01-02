import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import CheckoutStepper from './CheckoutStepper'
import AddressList from './AddressList'
import AddressForm from './AddressForm'
import CartSummary from './CartSummary'
import Button from '@/components/ui/Button'
import { createOrder } from '@/services/order.service'
import { PAYMENT_METHODS } from '@/utils/constants'
import { calculateOrderTotal } from '@/utils/calculations'
import toast from 'react-hot-toast'
import { MapPin, CreditCard, Package, Plus, ChevronLeft, ShieldCheck, Zap } from 'lucide-react'

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
    toast.success('Address saved successfully!', { icon: '📍' })
  }

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return
    }
    setCurrentStep(2)
  }

  const handleContinueToReview = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) return

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
          name: item.name,
          image: item.image || '',
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        subtotal: orderTotals.subtotal,
        deliveryFee: orderTotals.deliveryFee,
        discount: orderTotals.discount,
        total: orderTotals.total,
        deliveryAddress: selectedAddress,
        paymentMethod,
        notes: deliveryNotes || null,
        deliveryType: 'standard',
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      const order = await createOrder(orderData)
      await clearCart()
      toast.success('Order placed successfully!', { duration: 5000 })
      navigate(`/order-success/${order.id}`, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
      toast.error('Order placement failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <div className="lg:col-span-8 space-y-6">
        
        {/* Step Indicator Header */}
        <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
            <CheckoutStepper currentStep={currentStep} />
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden"
            >
              <div className="px-8 py-6 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-black text-neutral-900 tracking-tighter uppercase">Delivery Destination</h2>
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Where should we bring your fresh items?</p>
                </div>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 text-orange-600 font-black text-[11px] uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-orange-100 hover:bg-orange-50 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                )}
              </div>

              <div className="p-8">
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
                    <div className="mt-10 pt-6 border-t border-neutral-50">
                      <Button
                        onClick={handleContinueToPayment}
                        disabled={!selectedAddress}
                        className="w-full h-14 rounded-2xl bg-neutral-900 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-neutral-800 disabled:bg-neutral-200"
                      >
                        Select & Continue to Payment
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden"
            >
               <div className="px-8 py-6 bg-neutral-50/50 border-b border-neutral-100">
                  <h2 className="text-xl font-black text-neutral-900 tracking-tighter uppercase">Choose Payment</h2>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Safe & Secure Transactions</p>
               </div>

              <div className="p-8 space-y-4">
                <label className={`flex items-center p-6 border-2 rounded-[2rem] cursor-pointer transition-all ${paymentMethod === PAYMENT_METHODS.COD ? 'border-orange-500 bg-orange-50/30' : 'border-neutral-100 hover:border-neutral-200'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={PAYMENT_METHODS.COD}
                    checked={paymentMethod === PAYMENT_METHODS.COD}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <div className="ml-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tighter text-neutral-900">Cash on Delivery</p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pay in person at your doorstep</p>
                    </div>
                  </div>
                </label>

                <div className="flex items-center p-6 border-2 border-neutral-50 bg-neutral-50/50 rounded-[2rem] opacity-50 cursor-not-allowed">
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-200" />
                  <div className="ml-6 flex items-center gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.png" className="h-10 w-10 object-contain grayscale" alt="esewa" />
                    <div>
                      <p className="font-black text-sm uppercase tracking-tighter text-neutral-900">Digital Wallets (eSewa / Khalti)</p>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Coming very soon</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-neutral-50 border-t border-neutral-100 flex items-center gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="h-14 px-8 rounded-2xl border-2 border-neutral-200 font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <Button
                  onClick={handleContinueToReview}
                  className="flex-1 h-14 rounded-2xl bg-neutral-900 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-neutral-800"
                >
                  Review Order
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
                <div className="px-8 py-6 bg-neutral-50/50 border-b border-neutral-100">
                    <h2 className="text-xl font-black text-neutral-900 tracking-tighter uppercase">Final Review</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Last step before we launch delivery</p>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Delivery To</h3>
                      <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                        <p className="font-black text-neutral-900 text-sm">{selectedAddress?.street}</p>
                        <p className="text-[11px] font-bold text-neutral-500 uppercase mt-1">
                          {selectedAddress?.area}, Ward {selectedAddress?.ward}
                        </p>
                        {selectedAddress?.landmark && (
                          <p className="text-[10px] font-bold text-orange-600 uppercase mt-2">Near: {selectedAddress.landmark}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Payment Summary</h3>
                      <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                        <p className="font-black text-neutral-900 text-sm">Cash on Delivery</p>
                        <p className="text-[11px] font-bold text-neutral-500 uppercase mt-1">Pay Rs {orderTotals.total} at door</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Delivery Notes</h3>
                    <textarea
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Leave at the black gate, please call when near..."
                      rows={3}
                      className="w-full px-6 py-4 bg-neutral-50 border-2 border-neutral-100 rounded-[1.5rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="p-8 bg-neutral-50 border-t border-neutral-100 flex items-center gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={isProcessing}
                    className="h-14 px-8 rounded-2xl border-2 border-neutral-200 font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    loading={isProcessing}
                    className="flex-1 h-14 rounded-2xl bg-green-700 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-green-800 disabled:bg-neutral-300"
                  >
                    {isProcessing ? 'Finalizing...' : 'Place Order Now'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Support Section */}
        <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-blue-900 uppercase tracking-tight">100% Secure Checkout</p>
            </div>
            <div className="p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0">
                    <Zap className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-orange-900 uppercase tracking-tight">Instant Confirmation</p>
            </div>
        </div>
      </div>

      {/* Right Rail: Cart Summary */}
      <div className="lg:col-span-4 lg:sticky lg:top-[100px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-900/5 border border-neutral-100 p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-50">
               <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                  <Package className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-black text-sm uppercase tracking-tighter">Your Order</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Verify items & totals</p>
               </div>
            </div>
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

