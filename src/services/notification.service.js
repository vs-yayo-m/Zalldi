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

export const createAdminNotification = async (order) => {
  try {
    const notification = {
      type: 'new_order',
      orderId: order.id,
      orderNumber: order.orderNumber,
      title: `New Order: ${order.orderNumber}`,
      message: `${order.customerName} placed an order for ${formatCurrency(order.total)}`,
      data: {
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        total: order.total,
        itemCount: order.items?.length || 0,
        deliveryAddress: order.deliveryAddress,
        location: order.location || null
      },
      read: false,
      priority: 'high',
      createdAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, 'notifications'), notification)
    return docRef.id
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

export const generateOrderShareText = (order) => {
  const itemsList = order.items
    ?.map((item, idx) => `${idx + 1}. ${item.name} (x${item.quantity}) - ${formatCurrency(item.total)}`)
    .join('\n') || ''

  const locationLink = order.location
    ? `\n📍 Location: ${generateGoogleMapsLink(order.location.latitude, order.location.longitude)}`
    : ''

  const preferences = []
  if (order.deliveryType === 'custom' && order.timeSlot) {
    preferences.push(`⏰ Time Slot: ${order.timeSlot}`)
  }
  if (order.giftPackaging) {
    preferences.push('🎁 Gift Packaging Requested')
  }
  if (order.tip > 0) {
    preferences.push(`💝 Tip: ${formatCurrency(order.tip)}`)
  }
  if (order.instructions?.length > 0) {
    preferences.push(`📝 Instructions: ${order.instructions.join(', ')}`)
  }

  const preferencesText = preferences.length > 0
    ? `\n\n🔔 Customer Preferences:\n${preferences.join('\n')}`
    : ''

  return `
🧡 ZALLDI NEW ORDER 🧡

📦 Order: ${order.orderNumber}
👤 Customer: ${order.customerName}
📞 Phone: ${order.customerPhone}

🛍️ Items (${order.items?.length || 0}):
${itemsList}

💰 Order Summary:
• Subtotal: ${formatCurrency(order.subtotal)}
• Delivery: ${order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
• Total: ${formatCurrency(order.total)}

📍 Delivery Address:
${order.deliveryAddress?.street}, ${order.deliveryAddress?.area}
Ward ${order.deliveryAddress?.ward}, Butwal
${order.deliveryAddress?.landmark ? `Near: ${order.deliveryAddress.landmark}` : ''}
${locationLink}
${preferencesText}

💳 Payment: ${order.paymentMethod?.toUpperCase() || 'COD'}
📅 Placed: ${formatDateTime(order.createdAt)}

⚡ Deliver within 60 minutes!
`.trim()
}

export const shareViaWhatsApp = (order, adminPhone = '+9779821072912') => {
  const text = generateOrderShareText(order)
  const encodedText = encodeURIComponent(text)
  const url = `https://wa.me/${adminPhone.replace(/\D/g, '')}?text=${encodedText}`
  window.open(url, '_blank')
}

export const shareViaEmail = (order, adminEmail = 'zalldi.vishalsharma@gmail.com') => {
  const subject = encodeURIComponent(`New Order: ${order.orderNumber}`)
  const body = encodeURIComponent(generateOrderShareText(order))
  const url = `mailto:${adminEmail}?subject=${subject}&body=${body}`
  window.location.href = url
}

export const copyOrderDetails = async (order) => {
  const text = generateOrderShareText(order)
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Copy failed:', error)
    return false
  }
}

export const shareOrderDetails = async (order) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Order ${order.orderNumber}`,
        text: generateOrderShareText(order),
      })
      return true
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
      return false
    }
  }
  return false
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