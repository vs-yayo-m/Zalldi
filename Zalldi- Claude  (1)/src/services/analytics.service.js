// src/services/analytics.service.js

import { db } from '@config/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from 'date-fns'

export const analyticsService = {
  async getOverviewStats(period = 'month') {
    try {
      const { startDate, endDate } = this.getPeriodRange(period)
      
      const ordersRef = collection(db, 'orders')
      const ordersQuery = query(
        ordersRef,
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate)
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      
      const orders = ordersSnapshot.docs.map(doc => doc.data())
      
      const totalOrders = orders.length
      const completedOrders = orders.filter(o => o.status === 'delivered').length
      const pendingOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length
      const cancelledOrders = orders.filter(o => o.status === 'cancelled').length
      
      const totalRevenue = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + (order.total || 0), 0)
      
      const usersRef = collection(db, 'users')
      const customersQuery = query(
        usersRef,
        where('role', '==', 'customer'),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate)
      )
      const customersSnapshot = await getDocs(customersQuery)
      const newCustomers = customersSnapshot.size
      
      const productsRef = collection(db, 'products')
      const productsSnapshot = await getDocs(productsRef)
      const totalProducts = productsSnapshot.size
      
      return {
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        averageOrderValue: completedOrders > 0 ? totalRevenue / completedOrders : 0,
        newCustomers,
        totalProducts,
        conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
      }
    } catch (error) {
      throw error
    }
  },
  
  async getRevenueChart(period = 'month') {
    try {
      const { startDate, endDate } = this.getPeriodRange(period)
      
      const ordersRef = collection(db, 'orders')
      const ordersQuery = query(
        ordersRef,
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        where('status', '==', 'delivered')
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      
      const dataPoints = this.groupOrdersByDate(ordersSnapshot.docs, period)
      
      return dataPoints
    } catch (error) {
      throw error
    }
  },
  
  async getCategoryPerformance() {
    try {
      const productsRef = collection(db, 'products')
      const productsSnapshot = await getDocs(productsRef)
      
      const categoryData = {}
      
      productsSnapshot.docs.forEach(doc => {
        const product = doc.data()
        const category = product.category || 'Uncategorized'
        
        if (!categoryData[category]) {
          categoryData[category] = {
            category,
            totalProducts: 0,
            totalSales: 0,
            revenue: 0
          }
        }
        
        categoryData[category].totalProducts++
        categoryData[category].totalSales += product.soldCount || 0
        categoryData[category].revenue += (product.soldCount || 0) * (product.price || 0)
      })
      
      return Object.values(categoryData).sort((a, b) => b.revenue - a.revenue)
    } catch (error) {
      throw error
    }
  },
  
  async getTopProducts(limit = 10) {
    try {
      const productsRef = collection(db, 'products')
      const productsSnapshot = await getDocs(productsRef)
      
      const products = productsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
        .slice(0, limit)
      
      return products
    } catch (error) {
      throw error
    }
  },
  
  async getTopCustomers(limit = 10) {
    try {
      const usersRef = collection(db, 'users')
      const customersQuery = query(usersRef, where('role', '==', 'customer'))
      const customersSnapshot = await getDocs(customersQuery)
      
      const customers = customersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
        .slice(0, limit)
      
      return customers
    } catch (error) {
      throw error
    }
  },
  
  async getSupplierPerformance() {
    try {
      const usersRef = collection(db, 'users')
      const suppliersQuery = query(usersRef, where('role', '==', 'supplier'))
      const suppliersSnapshot = await getDocs(suppliersQuery)
      
      const performanceData = []
      
      for (const supplierDoc of suppliersSnapshot.docs) {
        const supplier = supplierDoc.data()
        
        const productsRef = collection(db, 'products')
        const productsQuery = query(productsRef, where('supplierId', '==', supplierDoc.id))
        const productsSnapshot = await getDocs(productsQuery)
        
        const totalProducts = productsSnapshot.size
        const activeProducts = productsSnapshot.docs.filter(doc => doc.data().active).length
        
        performanceData.push({
          id: supplierDoc.id,
          name: supplier.businessName || supplier.displayName,
          totalProducts,
          activeProducts,
          rating: supplier.rating || 0,
          verified: supplier.verified || false
        })
      }
      
      return performanceData.sort((a, b) => b.rating - a.rating)
    } catch (error) {
      throw error
    }
  },
  
  async getOrderStatusDistribution() {
    try {
      const ordersRef = collection(db, 'orders')
      const ordersSnapshot = await getDocs(ordersRef)
      
      const distribution = {
        pending: 0,
        confirmed: 0,
        picking: 0,
        packing: 0,
        out_for_delivery: 0,
        delivered: 0,
        cancelled: 0
      }
      
      ordersSnapshot.docs.forEach(doc => {
        const status = doc.data().status
        if (distribution[status] !== undefined) {
          distribution[status]++
        }
      })
      
      return distribution
    } catch (error) {
      throw error
    }
  },
  
  getPeriodRange(period) {
    const now = new Date()
    
    switch (period) {
      case 'today':
        return {
          startDate: startOfDay(now),
            endDate: endOfDay(now)
        }
      case 'week':
        return {
          startDate: startOfWeek(now),
            endDate: endOfWeek(now)
        }
      case 'month':
        return {
          startDate: startOfMonth(now),
            endDate: endOfMonth(now)
        }
      case 'last7days':
        return {
          startDate: subDays(now, 7),
            endDate: now
        }
      case 'last30days':
        return {
          startDate: subDays(now, 30),
            endDate: now
        }
      default:
        return {
          startDate: startOfMonth(now),
            endDate: endOfMonth(now)
        }
    }
  },
  
  groupOrdersByDate(orders, period) {
    const dataMap = {}
    
    orders.forEach(doc => {
      const order = doc.data()
      const date = order.createdAt?.toDate()
      
      if (!date) return
      
      let key
      if (period === 'today' || period === 'last7days') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else if (period === 'month' || period === 'last30days') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' })
      }
      
      if (!dataMap[key]) {
        dataMap[key] = {
          date: key,
          revenue: 0,
          orders: 0
        }
      }
      
      dataMap[key].revenue += order.total || 0
      dataMap[key].orders += 1
    })
    
    return Object.values(dataMap)
  }
}