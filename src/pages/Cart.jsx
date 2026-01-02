// /src/pages/Cart.jsx
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { 
  ShoppingCart, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Clock,
  ChevronRight,
  Info
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/utils/constants'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart()
  
  // Quick-commerce delivery math
  const deliveryFee = cartTotal > 500 ? 0 : 25;
  const handlingFee = 5;
  const grandTotal = cartTotal + deliveryFee + handlingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-xl shadow-neutral-200"
        >
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">Your cart is empty</h1>
          <p className="text-neutral-500 font-bold text-sm mb-8 px-4">
            Looks like you haven't added anything to your cart yet. Let's find some essentials!
          </p>
          <Button
            onClick={() => navigate(ROUTES.SHOP)}
            className="w-full bg-neutral-900 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20"
          >
            Start Shopping
          </Button>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-32 pt-6">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-neutral-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tighter">My Cart</h1>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
              {items.length} {items.length === 1 ? 'Item' : 'Items'} • Delivery in 60 Mins
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-50">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-black text-neutral-800 tracking-tight">Delivery to Home - Butwal, Ward 9</span>
              </div>

              <div className="divide-y divide-neutral-50">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="py-6 flex gap-4"
                    >
                      <div className="w-20 h-20 bg-neutral-50 rounded-2xl p-2 flex-shrink-0 border border-neutral-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-black text-neutral-800 leading-tight uppercase tracking-tight mb-1">
                            {item.name}
                          </h3>
                          <p className="text-[10px] font-bold text-neutral-400">{item.weight || 'Standard Size'}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-black text-neutral-900 tracking-tighter">
                            Rs {item.price * (item.quantity || 1)}
                          </span>
                          
                          <div className="flex items-center bg-green-700 text-white rounded-xl p-1 gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              {item.quantity <= 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </button>
                            <span className="text-xs font-black min-w-[12px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-orange-900 uppercase tracking-widest">Coupons</h4>
                  <p className="text-[10px] font-bold text-orange-700/60">Apply to save more on this order</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </div>
          </div>

          {/* Right Side: Bill Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-6">Bill Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-neutral-500">
                  <span className="flex items-center gap-2 uppercase tracking-tighter">Item Total <span className="bg-neutral-100 text-neutral-400 px-1.5 rounded text-[8px]">{items.length}</span></span>
                  <span className="text-neutral-900">Rs {cartTotal}</span>
                </div>
                
                <div className="flex justify-between text-xs font-bold text-neutral-500">
                  <span className="uppercase tracking-tighter">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600 uppercase" : "text-neutral-900"}>
                    {deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-bold text-neutral-500">
                  <span className="uppercase tracking-tighter">Handling Charge</span>
                  <span className="text-neutral-900">Rs {handlingFee}</span>
                </div>

                <div className="pt-4 border-t border-neutral-50 flex justify-between items-center">
                  <span className="text-sm font-black text-neutral-900 uppercase tracking-widest">Grand Total</span>
                  <span className="text-xl font-black text-neutral-900 tracking-tighter">Rs {grandTotal}</span>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => navigate(ROUTES.CHECKOUT)}
                  className="w-full bg-green-700 text-white h-16 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 flex items-center justify-between px-8"
                >
                  Proceed to Pay
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Safety Trust Card */}
            <div className="bg-neutral-900 rounded-[2rem] p-6 text-white flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-orange-500" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">100% Safe Payments</h4>
                <p className="text-[10px] font-bold text-neutral-400 leading-tight">Your data is encrypted and secure with Zalldi.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

