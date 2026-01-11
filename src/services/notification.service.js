// src/services/notification.service.js

import { db } from '@config/firebase'
import { collection, addDoc, query, where, getDocs, orderBy, limit, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { formatCurrency, formatDateTime } from '@utils/formatters'
import { generateGoogleMapsLink } from './location.service'

/**
 * ADMIN NOTIFICATION SERVICE
 * Sends real-time notifications to admin when orders are placed
 */

export const notifyAdminNewOrder = async (orderData) => {
  try {
    const notification = {
      type: 'new_order',
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      total: orderData.total,
      status: orderData.status,
      deliveryAddress: orderData.deliveryAddress,
      location: orderData.location || null,
      mapLink: orderData.location ?
        generateGoogleMapsLink(orderData.location.latitude, orderData.location.longitude, `Order ${orderData.orderNumber}`) :
        null,
      read: false,
      createdAt: serverTimestamp()
    }
    
    await addDoc(collection(db, 'admin_notifications'), notification)
    
    // --- CUSTOMER-SIDE WHATSAPP / window.open REMOVED ---
    // Now only Firestore notification, no browser interaction
    
    return notification
  } catch (error) {
    console.error('Error sending admin notification:', error)
    throw error
  }
}

/**
 * General notification service for customers and suppliers
 */
export const notificationService = {
  async createNotification(userId, notification) {
    try {
      const notificationData = {
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        read: false,
        actionUrl: notification.actionUrl || null,
        createdAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'notifications'), notificationData)
      return { id: docRef.id, ...notificationData }
    } catch (error) {
      throw error
    }
  },
  
  async getUserNotifications(userId, options = {}) {
    try {
      let q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      if (options.unreadOnly) {
        q = query(q, where('read', '==', false))
      }
      
      if (options.limit) {
        q = query(q, limit(options.limit))
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
  
  async markAsRead(notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: new Date()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async markAllAsRead(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      )
      
      const snapshot = await getDocs(q)
      const updatePromises = snapshot.docs.map(doc =>
        updateDoc(doc.ref, {
          read: true,
          readAt: new Date()
        })
      )
      
      await Promise.all(updatePromises)
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async getUnreadCount(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.size
    } catch (error) {
      throw error
    }
  },
  
  async notifyOrderPlaced(order) {
    try {
      await this.createNotification(order.customerId, {
        title: 'Order Placed',
        message: `Your order #${order.orderNumber} has been placed successfully.`,
        type: 'success',
        actionUrl: `/track/${order.id}`
      })
      
      // Notify suppliers
      const items = order.items || []
      const supplierIds = [...new Set(items.map(item => item.supplierId))]
      
      for (const supplierId of supplierIds) {
        await this.createNotification(supplierId, {
          title: 'New Order',
          message: `You have received a new order #${order.orderNumber}`,
          type: 'info',
          actionUrl: `/supplier/orders/${order.id}`
        })
      }
      
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Notification error:', error)
    }
  },
  
  async notifyOrderStatusChange(order, newStatus) {
    try {
      const statusMessages = {
        confirmed: 'Your order has been confirmed and is being prepared.',
        picking: 'Your order items are being picked.',
        packing: 'Your order is being packed.',
        out_for_delivery: 'Your order is out for delivery!',
        delivered: 'Your order has been delivered. Thank you!',
        cancelled: 'Your order has been cancelled.'
      }
      
      await this.createNotification(order.customerId, {
        title: `Order ${newStatus.replace('_', ' ').toUpperCase()}`,
        message: statusMessages[newStatus] || `Your order status has been updated.`,
        type: newStatus === 'cancelled' ? 'error' : newStatus === 'delivered' ? 'success' : 'info',
        actionUrl: `/track/${order.id}`
      })
      
      toast.success(`Order ${newStatus.replace('_', ' ')}`)
    } catch (error) {
      console.error('Notification error:', error)
    }
  },
  
  async notifyLowStock(supplierId, product) {
    try {
      await this.createNotification(supplierId, {
        title: 'Low Stock Alert',
        message: `${product.name} is running low on stock (${product.stock} remaining)`,
        type: 'warning',
        actionUrl: `/supplier/inventory`
      })
    } catch (error) {
      console.error('Notification error:', error)
    }
  },
  
  async notifyNewReview(supplierId, review, product) {
    try {
      await this.createNotification(supplierId, {
        title: 'New Review',
        message: `${product.name} received a ${review.rating}-star review`,
        type: 'info',
        actionUrl: `/supplier/products/${product.id}`
      })
    } catch (error) {
      console.error('Notification error:', error)
    }
  },
  
  showToast(type, message) {
    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'warning':
        toast(message, { icon: '⚠️' })
        break
      default:
        toast(message)
    }
  }
}