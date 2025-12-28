// src/services/supplier.service.js

import { db } from '@config/firebase'
import { collection, doc, getDoc, getDocs, updateDoc, query, where, orderBy, limit } from 'firebase/firestore'

export const supplierService = {
  async getSupplier(supplierId) {
    try {
      const supplierDoc = await getDoc(doc(db, 'users', supplierId))
      if (supplierDoc.exists() && supplierDoc.data().role === 'supplier') {
        return { id: supplierDoc.id, ...supplierDoc.data() }
      }
      return null
    } catch (error) {
      throw error
    }
  },
  
  async updateSupplier(supplierId, data) {
    try {
      const supplierRef = doc(db, 'users', supplierId)
      await updateDoc(supplierRef, {
        ...data,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async updateBusinessInfo(supplierId, businessData) {
    try {
      const supplierRef = doc(db, 'users', supplierId)
      await updateDoc(supplierRef, {
        businessName: businessData.businessName,
        businessAddress: businessData.businessAddress,
        businessPhone: businessData.businessPhone,
        businessEmail: businessData.businessEmail,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async getAllSuppliers(filters = {}) {
    try {
      let q = query(collection(db, 'users'), where('role', '==', 'supplier'))
      
      if (filters.verified !== undefined) {
        q = query(q, where('verified', '==', filters.verified))
      }
      
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
  
  async verifySupplier(supplierId, verified = true) {
    try {
      const supplierRef = doc(db, 'users', supplierId)
      await updateDoc(supplierRef, {
        verified,
        verifiedAt: verified ? new Date() : null,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async getSupplierStats(supplierId) {
    try {
      const productsRef = collection(db, 'products')
      const productsQuery = query(productsRef, where('supplierId', '==', supplierId))
      const productsSnapshot = await getDocs(productsQuery)
      
      const ordersRef = collection(db, 'orders')
      const ordersQuery = query(ordersRef)
      const ordersSnapshot = await getDocs(ordersQuery)
      
      const supplierOrders = ordersSnapshot.docs.filter(doc => {
        const items = doc.data().items || []
        return items.some(item => item.supplierId === supplierId)
      })
      
      const totalRevenue = supplierOrders
        .filter(doc => doc.data().status === 'delivered')
        .reduce((sum, doc) => {
          const items = doc.data().items.filter(item => item.supplierId === supplierId)
          return sum + items.reduce((itemSum, item) => itemSum + item.total, 0)
        }, 0)
      
      const activeProducts = productsSnapshot.docs.filter(doc => doc.data().active).length
      const totalProducts = productsSnapshot.size
      const totalOrders = supplierOrders.length
      
      const completedOrders = supplierOrders.filter(doc =>
        doc.data().status === 'delivered'
      ).length
      
      return {
        totalProducts,
        activeProducts,
        totalOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue: completedOrders > 0 ? totalRevenue / completedOrders : 0,
        fulfillmentRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
      }
    } catch (error) {
      throw error
    }
  },
  
  async getSupplierPerformance(supplierId, period = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - period)
      
      const ordersRef = collection(db, 'orders')
      const ordersQuery = query(
        ordersRef,
        where('createdAt', '>=', startDate)
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      
      const supplierOrders = ordersSnapshot.docs.filter(doc => {
        const items = doc.data().items || []
        return items.some(item => item.supplierId === supplierId)
      })
      
      const onTimeDeliveries = supplierOrders.filter(doc => {
        const data = doc.data()
        if (data.status !== 'delivered') return false
        
        const estimated = data.estimatedDelivery?.toDate()
        const actual = data.actualDelivery?.toDate()
        
        return actual && estimated && actual <= estimated
      }).length
      
      const totalDelivered = supplierOrders.filter(doc =>
        doc.data().status === 'delivered'
      ).length
      
      const reviewsRef = collection(db, 'reviews')
      const reviewsQuery = query(reviewsRef)
      const reviewsSnapshot = await getDocs(reviewsQuery)
      
      const supplierReviews = reviewsSnapshot.docs.filter(doc => {
        const productId = doc.data().productId
        const productsRef = collection(db, 'products')
        return true
      })
      
      const averageRating = supplierReviews.length > 0 ?
        supplierReviews.reduce((sum, doc) => sum + doc.data().rating, 0) / supplierReviews.length :
        0
      
      return {
        onTimeDeliveryRate: totalDelivered > 0 ? (onTimeDeliveries / totalDelivered) * 100 : 0,
        totalOrders: supplierOrders.length,
        deliveredOrders: totalDelivered,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: supplierReviews.length
      }
    } catch (error) {
      throw error
    }
  },
  
  async searchSuppliers(searchTerm) {
    try {
      const suppliersRef = collection(db, 'users')
      const q = query(
        suppliersRef,
        where('role', '==', 'supplier'),
        orderBy('businessName')
      )
      
      const snapshot = await getDocs(q)
      const suppliers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return suppliers.filter(supplier =>
        supplier.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } catch (error) {
      throw error
    }
  },
  
  async updateSupplierRating(supplierId) {
    try {
      const reviewsRef = collection(db, 'reviews')
      const productsRef = collection(db, 'products')
      const productsQuery = query(productsRef, where('supplierId', '==', supplierId))
      const productsSnapshot = await getDocs(productsQuery)
      
      const productIds = productsSnapshot.docs.map(doc => doc.id)
      
      if (productIds.length === 0) {
        return { success: true, rating: 0 }
      }
      
      const reviewsQuery = query(reviewsRef)
      const reviewsSnapshot = await getDocs(reviewsQuery)
      
      const supplierReviews = reviewsSnapshot.docs.filter(doc =>
        productIds.includes(doc.data().productId)
      )
      
      const totalRating = supplierReviews.reduce((sum, doc) => sum + doc.data().rating, 0)
      const averageRating = supplierReviews.length > 0 ? totalRating / supplierReviews.length : 0
      
      await updateDoc(doc(db, 'users', supplierId), {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: supplierReviews.length,
        updatedAt: new Date()
      })
      
      return { success: true, rating: averageRating }
    } catch (error) {
      throw error
    }
  }
}