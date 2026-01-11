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
/**
 * Send admin notification when new order is placed
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
        generateGoogleMapsLink(
          orderData.location.latitude,
          orderData.location.longitude,
          `Order ${orderData.orderNumber}`
        ) :
        null,
      read: false,
      createdAt: serverTimestamp()
    }
    
    await addDoc(collection(db, 'admin_notifications'), notification)
    
    // Browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Order Received! 🔔', {
        body: `Order ${orderData.orderNumber} - ${formatCurrency(orderData.total)} from ${orderData.customerName}`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: orderData.id,
        requireInteraction: true
      })
    }
    
    return notification
  } catch (error) {
    console.error('Error sending admin notification:', error)
    throw error
  }
}

/**
 * Generate WhatsApp message with order details
 */
export const generateWhatsAppMessage = (order) => {
  const items = order.items?.map(item =>
    `• ${item.name} x${item.quantity} - ${formatCurrency(item.total)}`
  ).join('\n') || ''
  
  const mapLink = order.location ?
    generateGoogleMapsLink(
      order.location.latitude,
      order.location.longitude,
      `Order ${order.orderNumber}`
    ) :
    'Location not provided'
  
  const message = `
🧡 *ZALLDI - NEW ORDER*

📦 *Order:* ${order.orderNumber}
💰 *Total:* ${formatCurrency(order.total)}
📅 *Date:* ${formatDateTime(order.createdAt)}

👤 *Customer Details:*
Name: ${order.customerName}
Phone: ${order.customerPhone}

🏠 *Delivery Address:*
${order.deliveryAddress?.street || ''}
${order.deliveryAddress?.area || ''}
Ward ${order.deliveryAddress?.ward || 'N/A'}
${order.deliveryAddress?.landmark ? `Near: ${order.deliveryAddress.landmark}` : ''}

📍 *Location:*
${mapLink}

🛍️ *Items Ordered:*
${items}

💳 *Payment:* ${order.paymentMethod?.toUpperCase() || 'COD'}
${order.tip > 0 ? `\n💝 *Tip:* ${formatCurrency(order.tip)}` : ''}
${order.giftPackaging ? '\n🎁 *Gift Packaging Requested*' : ''}
${order.instructions?.length > 0 ? `\n📝 *Instructions:* ${order.instructions.join(', ')}` : ''}

---
Zalldi - 1 Hour Delivery 🚀
  `.trim()
  
  return encodeURIComponent(message)
}

/**
 * Share order via WhatsApp
 */
export const shareOrderViaWhatsApp = (order, phoneNumber = null) => {
  const message = generateWhatsAppMessage(order)
  const url = phoneNumber ?
    `https://wa.me/${phoneNumber}?text=${message}` :
    `https://wa.me/?text=${message}`
  
  window.open(url, '_blank')
}

/**
 * Generate email body with order details
 */
export const generateEmailBody = (order) => {
  const items = order.items?.map(item =>
    `${item.name} x${item.quantity} - ${formatCurrency(item.total)}`
  ).join('\n') || ''
  
  const mapLink = order.location ?
    generateGoogleMapsLink(
      order.location.latitude,
      order.location.longitude,
      `Order ${order.orderNumber}`
    ) :
    'Location not provided'
  
  return `
Order: ${order.orderNumber}
Total: ${formatCurrency(order.total)}
Date: ${formatDateTime(order.createdAt)}

Customer: ${order.customerName}
Phone: ${order.customerPhone}

Delivery Address:
${order.deliveryAddress?.street || ''}
${order.deliveryAddress?.area || ''}
Ward ${order.deliveryAddress?.ward || 'N/A'}

Location Map: ${mapLink}

Items:
${items}

Payment: ${order.paymentMethod?.toUpperCase() || 'COD'}
  `.trim()
}

/**
 * Share order via Email
 */
export const shareOrderViaEmail = (order, recipientEmail = '') => {
  const subject = encodeURIComponent(`New Order: ${order.orderNumber}`)
  const body = encodeURIComponent(generateEmailBody(order))
  
  window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`
}

/**
 * Copy order details to clipboard
 */
export const copyOrderDetailsToClipboard = async (order) => {
  const text = generateEmailBody(order)
  
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported'
  }
  
  if (Notification.permission === 'granted') {
    return 'granted'
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission
  }
  
  return Notification.permission
}








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