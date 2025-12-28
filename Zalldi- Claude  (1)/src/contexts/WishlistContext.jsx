// src/contexts/WishlistContext.jsx

import { createContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@hooks/useAuth'
import { getProductsByIds } from '@services/product.service'
import { updateUserWishlist } from '@services/user.service'

export const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  
  const fetchWishlistItems = useCallback(async () => {
    if (!user || !user.wishlist || user.wishlist.length === 0) {
      setItems([])
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const products = await getProductsByIds(user.wishlist)
      setItems(products)
    } catch (error) {
      console.error('Error fetching wishlist items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user])
  
  useEffect(() => {
    fetchWishlistItems()
  }, [fetchWishlistItems])
  
  const addToWishlist = async (productId) => {
    if (!user) {
      throw new Error('Please login to add items to wishlist')
    }
    
    const currentWishlist = user.wishlist || []
    
    if (currentWishlist.includes(productId)) {
      return
    }
    
    const updatedWishlist = [...currentWishlist, productId]
    
    try {
      await updateUserWishlist(user.uid, updatedWishlist)
      await fetchWishlistItems()
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }
  }
  
  const removeFromWishlist = async (productId) => {
    if (!user) {
      throw new Error('Please login to manage wishlist')
    }
    
    const currentWishlist = user.wishlist || []
    const updatedWishlist = currentWishlist.filter(id => id !== productId)
    
    try {
      await updateUserWishlist(user.uid, updatedWishlist)
      setItems(prevItems => prevItems.filter(item => item.id !== productId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }
  }
  
  const isInWishlist = useCallback((productId) => {
    if (!user || !user.wishlist) return false
    return user.wishlist.includes(productId)
  }, [user])
  
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }
  
  const clearWishlist = async () => {
    if (!user) {
      throw new Error('Please login to clear wishlist')
    }
    
    try {
      await updateUserWishlist(user.uid, [])
      setItems([])
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      throw error
    }
  }
  
  const value = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    refresh: fetchWishlistItems
  }
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}