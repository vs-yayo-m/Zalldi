// src/services/user.service.js

import { db } from '@config/firebase'
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit,
  arrayUnion,
  arrayRemove,
  serverTimestamp } from 'firebase/firestore'

export const userService = {
  async getUser(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() }
      }
      return null
    } catch (error) {
      throw error
    }
  },
  
  async updateUser(userId, data) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        displayName: profileData.displayName,
        phoneNumber: profileData.phoneNumber,
        photoURL: profileData.photoURL,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async addAddress(userId, address) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      const addresses = userData.addresses || []
      
      const newAddress = {
        ...address,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      
      if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false)
      }
      
      addresses.push(newAddress)
      
      await updateDoc(doc(db, 'users', userId), {
        addresses,
        updatedAt: new Date()
      })
      
      return newAddress
    } catch (error) {
      throw error
    }
  },
  
  async updateAddress(userId, addressId, addressData) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      const addresses = userData.addresses || []
      
      const addressIndex = addresses.findIndex(addr => addr.id === addressId)
      if (addressIndex === -1) throw new Error('Address not found')
      
      if (addressData.isDefault) {
        addresses.forEach(addr => addr.isDefault = false)
      }
      
      addresses[addressIndex] = {
        ...addresses[addressIndex],
        ...addressData,
        updatedAt: new Date()
      }
      
      await updateDoc(doc(db, 'users', userId), {
        addresses,
        updatedAt: new Date()
      })
      
      return addresses[addressIndex]
    } catch (error) {
      throw error
    }
  },
  
  async deleteAddress(userId, addressId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      const addresses = userData.addresses || []
      
      const filteredAddresses = addresses.filter(addr => addr.id !== addressId)
      
      await updateDoc(doc(db, 'users', userId), {
        addresses: filteredAddresses,
        updatedAt: new Date()
      })
      
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async setDefaultAddress(userId, addressId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      const addresses = userData.addresses || []
      
      addresses.forEach(addr => {
        addr.isDefault = addr.id === addressId
      })
      
      await updateDoc(doc(db, 'users', userId), {
        addresses,
        updatedAt: new Date()
      })
      
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async updateNotificationSettings(userId, settings) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        notifications: settings,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async getAllCustomers(filters = {}) {
    try {
      let q = query(collection(db, 'users'), where('role', '==', 'customer'))
      
      if (filters.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.order || 'desc'))
      }
      
      if (filters.limit) {
        q = query(q, limit(filters.limit))
      }
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      throw error
    }
  },
  
  async searchCustomers(searchTerm) {
    try {
      const usersRef = collection(db, 'users')
      const q = query(
        usersRef,
        where('role', '==', 'customer'),
        orderBy('displayName')
      )
      
      const snapshot = await getDocs(q)
      const customers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return customers.filter(customer =>
        customer.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber?.includes(searchTerm)
      )
    } catch (error) {
      throw error
    }
  },
  
  async getCustomerStats(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      
      const ordersRef = collection(db, 'orders')
      const ordersQuery = query(
        ordersRef,
        where('customerId', '==', userId),
        where('status', '==', 'delivered')
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      
      const totalOrders = ordersSnapshot.size
      const totalSpent = ordersSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().total || 0)
      }, 0)
      
      return {
        totalOrders,
        totalSpent,
        averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
        joinedDate: userData.createdAt,
        lastOrderDate: userData.lastOrderDate
      }
    } catch (error) {
      throw error
    }
  },
  
  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId))
      return { success: true }
    } catch (error) {
      throw error
    }
  }
}

/**
 * Update user wishlist (ADD / REMOVE product)
 * Used by WishlistContext
 */
export const updateUserWishlist = async (userId, productId, action = 'add') => {
  if (!userId || !productId) return

  const userRef = doc(db, 'users', userId)

  const update =
    action === 'remove'
      ? {
          wishlist: arrayRemove(productId),
          updatedAt: serverTimestamp()
        }
      : {
          wishlist: arrayUnion(productId),
          updatedAt: serverTimestamp()
        }

  await updateDoc(userRef, update)

  return { success: true }
}
/**
 * Bulk update user addresses
 * ⚠️ SAFE: backward-compatible with existing imports
 * Used by Addresses.jsx and other legacy files
 */
export const updateUserAddresses = async (userId, addresses = []) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!Array.isArray(addresses)) {
      throw new Error('Addresses must be an array')
    }

    // Ensure only ONE default address
    let hasDefault = false
    const normalizedAddresses = addresses.map((addr, index) => {
      if (addr.isDefault && !hasDefault) {
        hasDefault = true
        return { ...addr }
      }

      if (addr.isDefault && hasDefault) {
        return { ...addr, isDefault: false }
      }

      return { ...addr }
    })

    // If no default exists, auto-assign first address
    if (!hasDefault && normalizedAddresses.length > 0) {
      normalizedAddresses[0].isDefault = true
    }

    const userRef = doc(db, 'users', userId)

    await updateDoc(userRef, {
      addresses: normalizedAddresses,
      updatedAt: new Date()
    })

    return { success: true }
  } catch (error) {
    console.error('updateUserAddresses error:', error)
    throw error
  }
}

/**
 * Backward-compatible profile updater
 * Used by legacy files (Profile.jsx etc.)
 */
export const updateUserProfile = async (userId, profileData = {}) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!profileData || typeof profileData !== 'object') {
      throw new Error('Invalid profile data')
    }

    return await userService.updateProfile(userId, profileData)
  } catch (error) {
    console.error('updateUserProfile error:', error)
    throw error
  }
}

/**
 * Backward-compatible user settings updater
 * Used by legacy Settings.jsx and others
 */
export const updateUserSettings = async (userId, settings = {}) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings data')
    }

    return await userService.updateSettings(userId, settings)
  } catch (error) {
    console.error('updateUserSettings error:', error)
    throw error
  }
}