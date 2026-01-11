// src/services/user.service.js (UPDATED - MERGED WITH EXISTING)

import { db } from '@config/firebase'
import { 
  collection, doc, getDoc, getDocs, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, limit, arrayUnion, arrayRemove, 
  serverTimestamp, Timestamp 
} from 'firebase/firestore'

const USERS_COLLECTION = 'users'

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
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId)
      const updateData = {}
      
      if (profileData.displayName !== undefined) updateData.displayName = profileData.displayName
      if (profileData.phoneNumber !== undefined) updateData.phoneNumber = profileData.phoneNumber
      if (profileData.photoURL !== undefined) updateData.photoURL = profileData.photoURL
      
      updateData.updatedAt = serverTimestamp()
      
      await updateDoc(userRef, updateData)
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
      const addresses = Array.isArray(userData.addresses) ? [...userData.addresses] : []
      
      const newAddress = {
        id: Date.now().toString(),
        type: address.type || 'home',
        ward: address.ward || '',
        area: address.area || '',
        street: address.street || '',
        landmark: address.landmark || '',
        isDefault: false,
        createdAt: Timestamp.now()
      }
      
      if (address.isDefault || addresses.length === 0) {
        addresses.forEach(addr => {
          if (addr && typeof addr === 'object') {
            addr.isDefault = false
          }
        })
        newAddress.isDefault = true
      }
      
      addresses.push(newAddress)
      
      await updateDoc(doc(db, 'users', userId), {
        addresses: addresses,
        updatedAt: serverTimestamp()
      })
      
      return newAddress
    } catch (error) {
      console.error('Error in addAddress:', error)
      throw error
    }
  },
  
  async updateAddress(userId, addressId, addressData) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      const addresses = Array.isArray(userData.addresses) ? [...userData.addresses] : []
      
      const addressIndex = addresses.findIndex(addr => addr && addr.id === addressId)
      if (addressIndex === -1) throw new Error('Address not found')
      
      if (addressData.isDefault) {
        addresses.forEach(addr => {
          if (addr && typeof addr === 'object') {
            addr.isDefault = false
          }
        })
      }
      
      addresses[addressIndex] = {
        ...addresses[addressIndex],
        ...addressData,
        updatedAt: Timestamp.now()
      }
      
      await updateDoc(doc(db, 'users', userId), {
        addresses: addresses,
        updatedAt: serverTimestamp()
      })
      
      return addresses[addressIndex]
    } catch (error) {
      console.error('Error in updateAddress:', error)
      throw error
    }
  },
  
  async deleteAddress(userId, addressId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      const addresses = Array.isArray(userData.addresses) ? [...userData.addresses] : []
      
      const filteredAddresses = addresses.filter(addr => addr && addr.id !== addressId)
      
      await updateDoc(doc(db, 'users', userId), {
        addresses: filteredAddresses,
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error in deleteAddress:', error)
      throw error
    }
  },
  
  async setDefaultAddress(userId, addressId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) throw new Error('User not found')
      
      const userData = userDoc.data()
      const addresses = Array.isArray(userData.addresses) ? [...userData.addresses] : []
      
      addresses.forEach(addr => {
        if (addr && typeof addr === 'object') {
          addr.isDefault = addr.id === addressId
        }
      })
      
      await updateDoc(doc(db, 'users', userId), {
        addresses: addresses,
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error in setDefaultAddress:', error)
      throw error
    }
  },
  
  async updateNotificationSettings(userId, settings) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        notifications: settings || {},
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async updateSettings(userId, settings) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        settings: settings || {},
        updatedAt: serverTimestamp()
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
      
      const term = (searchTerm || '').toLowerCase()
      
      return customers.filter(customer =>
        (customer.displayName || '').toLowerCase().includes(term) ||
        (customer.email || '').toLowerCase().includes(term) ||
        (customer.phoneNumber || '').includes(searchTerm)
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
        joinedDate: userData.createdAt || null,
        lastOrderDate: userData.lastOrderDate || null
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

// NEW: Create user profile
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    const userDoc = {
      ...userData,
      addresses: [],
      wishlist: [],
      orderCount: 0,
      totalSpent: 0,
      notifications: {
        email: true,
        push: true,
        sms: false,
        orderUpdates: true,
        promotions: true
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    await setDoc(userRef, userDoc)
    return userDoc
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw new Error('Failed to create user profile')
  }
}

// NEW: Get user profile
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      return null
    }
    
    return {
      uid,
      ...userSnap.data()
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
}

// NEW: Increment order statistics
export const incrementOrderCount = async (uid, amount = 0) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const currentData = userSnap.data()
      await updateDoc(userRef, {
        orderCount: (currentData.orderCount || 0) + 1,
        totalSpent: (currentData.totalSpent || 0) + amount,
        updatedAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error incrementing order count:', error)
    throw new Error('Failed to update order statistics')
  }
}

// BACKWARD COMPATIBLE: Wishlist updater (array operations)
export const updateUserWishlist = async (userId, productId, action = 'add') => {
  try {
    if (!userId || !productId) {
      throw new Error('User ID and Product ID are required')
    }

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
  } catch (error) {
    console.error('Error in updateUserWishlist:', error)
    throw error
  }
}

// BACKWARD COMPATIBLE: Bulk update addresses
export const updateUserAddresses = async (userId, addresses = []) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!Array.isArray(addresses)) {
      throw new Error('Addresses must be an array')
    }

    let hasDefault = false
    const normalizedAddresses = addresses.map((addr) => {
      if (!addr || typeof addr !== 'object') return null
      
      const normalizedAddr = {
        id: addr.id || Date.now().toString(),
        type: addr.type || 'home',
        ward: addr.ward || '',
        area: addr.area || '',
        street: addr.street || '',
        landmark: addr.landmark || '',
        isDefault: false
      }
      
      if (addr.isDefault && !hasDefault) {
        hasDefault = true
        normalizedAddr.isDefault = true
      }

      return normalizedAddr
    }).filter(Boolean)

    if (!hasDefault && normalizedAddresses.length > 0) {
      normalizedAddresses[0].isDefault = true
    }

    const userRef = doc(db, 'users', userId)

    await updateDoc(userRef, {
      addresses: normalizedAddresses,
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error in updateUserAddresses:', error)
    throw error
  }
}

// BACKWARD COMPATIBLE: Profile updater
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
    console.error('Error in updateUserProfile:', error)
    throw error
  }
}

// BACKWARD COMPATIBLE: Settings updater
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
    console.error('Error in updateUserSettings:', error)
    throw error
  }
}