import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { calculateOrderTotal } from '@/utils/calculations'
import { Trash2, Zap, ShieldCheck, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [showClearModal, setShowClearModal] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  
  // Calculate totals assuming 'standard' delivery for Butwal logic
  const orderTotals = calculateOrderTotal(items, 'standard', 0)
  
  const handleRemoveItem = (itemId) => {
    removeItem(itemId)
    toast.error('Item removed', {
      position: 'bottom-center',
      style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: '800' }
    })
  }
  
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }
    updateQuantity(itemId, newQuantity)
  }
  
  const handleClearCart = async () => {
    setIsClearing(true)
    try {
      await clearCart()
      toast.success('Cart cleared')
      setShowClearModal(false)
    } catch (error) {
      toast.error('Failed to clear cart')
    } finally {
      setIsClearing(false)
    }
  }
  
  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout')
      return
    }
    navigate('/checkout')
  }
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-lg font-black text-neutral-900 tracking-tighter uppercase">
                Items In Basket
              </h2>
              <button
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            <div className="p-2 sm:p-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-2 last:mb-0"
                  >
                    <CartItem
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick-Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest text-neutral-900 mb-1">Superfast Delivery</p>
                <p className="text-[10px] font-bold text-neutral-400 leading-relaxed uppercase tracking-tight">
                  Your order will be delivered within 60 minutes or it's on us.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest text-neutral-900 mb-1">Quality Guaranteed</p>
                <p className="text-[10px] font-bold text-neutral-400 leading-relaxed uppercase tracking-tight">
                  Hand-picked fresh items from Butwal's best local stores.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-[100px]">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-900/5 border border-neutral-100 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-50">
               <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                  <Clock className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-black text-sm uppercase tracking-tighter">Order Summary</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Estimated delivery: 12:45 PM</p>
               </div>
            </div>

            <CartSummary
              items={items}
              totals={orderTotals}
              onCheckout={handleCheckout}
              showCheckout={true}
            />

            <div className="pt-4">
              <p className="text-[9px] text-center font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                By proceeding, you agree to Zalldi's <br/>
                <span className="text-orange-500 cursor-pointer">Terms of Service</span> & <span className="text-orange-500 cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Empty Basket?"
      >
        <div className="space-y-6 p-2">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
             <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center">
            <h3 className="font-black text-xl text-neutral-900 tracking-tighter uppercase mb-2">Clear Your Cart?</h3>
            <p className="text-sm font-bold text-neutral-400 leading-relaxed">
              Are you sure you want to remove all items? You'll lose all your hand-picked selections.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowClearModal(false)}
              disabled={isClearing}
              className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest h-12"
            >
              No, Keep It
            </Button>
            <Button
              onClick={handleClearCart}
              disabled={isClearing}
              loading={isClearing}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 border-none"
            >
              Yes, Clear All
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

