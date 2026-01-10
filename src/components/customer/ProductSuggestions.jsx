// src/components/customer/ProductSuggestions.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { useCart } from '@hooks/useCart'
import { formatCurrency } from '@utils/formatters'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '@config/firebase'
import toast from 'react-hot-toast'

export default function ProductSuggestions({ currentItems }) {
  const { addItem, getItemQuantity } = useCart()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchSuggestions()
  }, [currentItems])
  
  const fetchSuggestions = async () => {
    if (currentItems.length === 0) {
      setLoading(false)
      return
    }
    
    try {
      const categories = [...new Set(currentItems.map(item => item.category))]
      const currentIds = currentItems.map(item => item.id)
      
      const q = query(
        collection(db, 'products'),
        where('category', 'in', categories.slice(0, 3)),
        where('active', '==', true),
        limit(8)
      )
      
      const snapshot = await getDocs(q)
      const products = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => !currentIds.includes(product.id) && product.stock > 0)
        .slice(0, 6)
      
      setSuggestions(products)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddItem = (product) => {
    addItem(product, 1)
    toast.success(`${product.name} added!`, {
      icon: '✨',
      duration: 2000
    })
  }
  
  if (loading || suggestions.length === 0) return null
  
  return (
    <div className="mx-3 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-orange-600" />
        <h3 className="text-xs font-black text-neutral-700 uppercase tracking-wide">
          You might also like
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {suggestions.map((product) => {
          const price = product.discountPrice || product.price
          const hasDiscount = product.discountPrice && product.discountPrice < product.price
          const inCart = getItemQuantity(product.id) > 0

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 w-32 bg-white rounded-xl border border-neutral-200 overflow-hidden"
            >
              <div className="relative aspect-square bg-neutral-100">
                <img
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded">
                    SALE
                  </div>
                )}
              </div>

              <div className="p-2">
                <h4 className="text-[11px] font-bold text-neutral-900 leading-tight line-clamp-2 mb-1">
                  {product.name}
                </h4>

                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs font-black text-orange-600">
                    {formatCurrency(price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[9px] text-neutral-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddItem(product)}
                  disabled={inCart}
                  className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                    inCart
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {inCart ? (
                    <>✓ Added</>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}