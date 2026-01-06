// src/contexts/CartContext.jsx

import React, { createContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { calculateSubtotal, calculateDeliveryFee, calculateTotal } from '@/utils/calculations'
import { MAX_CART_ITEMS } from '@/utils/constants'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('zalldi_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [])
  
  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('zalldi_cart', JSON.stringify(items))
  }, [items])
  
  // Add item to cart
  const addItem = (product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        
        if (newQuantity > product.stock) {
          toast.error('Not enough stock available')
          return prevItems
        }
        
        if (newQuantity > product.maxOrder) {
          toast.error(`Maximum order quantity is ${product.maxOrder}`)
          return prevItems
        }
        
        return prevItems.map(item =>
          item.id === product.id ?
          { ...item, quantity: newQuantity } :
          item
        )
      }
      
      if (prevItems.length >= MAX_CART_ITEMS) {
        toast.error(`Cart limit reached (${MAX_CART_ITEMS} items)`)
        return prevItems
      }
      
      if (quantity > product.stock) {
        toast.error('Not enough stock available')
        return prevItems
      }
      
      toast.success('Added to cart')
      return [...prevItems, { ...product, quantity }]
    })
  }
  
  // Remove item from cart
  const removeItem = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
    toast.success('Removed from cart')
  }
  
  // Update quantity for an item
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          if (quantity > item.stock) {
            toast.error('Not enough stock available')
            return item
          }
          
          if (quantity > item.maxOrder) {
            toast.error(`Maximum order quantity is ${item.maxOrder}`)
            return item
          }
          
          return { ...item, quantity }
        }
        return item
      })
    )
  }
  
  // Convenience functions
  const increaseQuantity = (productId) => {
    const item = items.find(i => i.id === productId)
    if (item) updateQuantity(productId, item.quantity + 1)
  }
  
  const decreaseQuantity = (productId) => {
    const item = items.find(i => i.id === productId)
    if (item) updateQuantity(productId, item.quantity - 1)
  }
  
  const clearCart = () => {
    setItems([])
    toast.success('Cart cleared')
  }
  
  // ✅ NEW FUNCTION: get quantity of a specific item
  const getItemQuantity = (productId) => {
    const item = items.find(i => i.id === productId)
    return item ? item.quantity : 0
  }
  
  // Get total item count in cart
  const getItemCount = () => items.reduce((total, item) => total + item.quantity, 0)
  
  // Get total price of cart items
  const getTotalPrice = () => items.reduce((total, item) => {
    const price = item.discountPrice || item.price
    return total + (price * item.quantity)
  }, 0)
  
  const hasItem = (productId) => items.some(item => item.id === productId)
  const getItem = (productId) => items.find(item => item.id === productId)
  
  // Drawer open/close
  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)
  
  // Calculated totals
  const subtotal = calculateSubtotal(items)
  const deliveryFee = calculateDeliveryFee(subtotal)
  const total = calculateTotal(subtotal, deliveryFee)
  
  // Context value
  const value = {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getItemCount,
    getItemQuantity, // ✅ Added here
    getTotalPrice,
    hasItem,
    getItem,
    openDrawer,
    closeDrawer,
    subtotal,
    deliveryFee,
    total,
    isEmpty: items.length === 0
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}