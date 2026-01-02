import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import Cart from '@/components/customer/Cart'
import EmptyState from '@/components/shared/EmptyState'
import Button from '@/components/ui/Button'
import { ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react'
import Header from '@/components/layout/Header'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, cartCount } = useCart()
  
  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-20">
      <Header />
      
      {/* Sub-Header for Context */}
      <div className="bg-white border-b border-neutral-100 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-400 hover:text-orange-500 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-black text-sm uppercase tracking-tighter text-neutral-900">Checkout Basket</h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'} Selected
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center">
             <ShoppingBag className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-neutral-100"
          >
            <EmptyState
              icon={ShoppingCart}
              title="Your basket is empty"
              description="Looks like you haven't added anything to your cart yet. Let's find some fresh deals for you!"
              actionLabel="Start Shopping"
              onAction={() => navigate('/shop')}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Cart />
          </motion.div>
        )}
      </div>
    </div>
  )
}

