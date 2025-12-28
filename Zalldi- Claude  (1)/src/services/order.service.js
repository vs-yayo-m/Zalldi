// src/services/order.service.js

import { db } from '@config/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { generateOrderNumber } from '@utils/helpers'
import { calculateEstimatedDeliveryTime } from '@utils/calculations'

const ORDERS_COLLECTION = 'orders'

export const createOrder = async (orderData) => {
  try {
    const orderNumber = generateOrderNumber()
    const now = new Date()
    const estimatedDelivery = calculateEstimatedDeliveryTime(now, orderData.deliveryType)

    const newOrder = {
      ...orderData,
      orderNumber,
      estimatedDelivery: Timestamp.fromDate(estimatedDelivery),
      actualDelivery: null,
      statusHistory: [
        {
          status: 'pending',
          timestamp: Timestamp.fromDate(now),
          note: 'Order placed'
        }
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder)
    
    return {
      id: docRef.id,
      ...newOrder,
      createdAt: now,
      updatedAt: now,
      estimatedDelivery
    }
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }
}

export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Order not found')
    }

    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      estimatedDelivery: data.estimatedDelivery?.toDate(),
      actualDelivery: data.actualDelivery?.toDate()
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Failed to fetch order')
  }
}

export const getOrdersByCustomer = async (customerId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const orders = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        estimatedDelivery: data.estimatedDelivery?.toDate(),
        actualDelivery: data.actualDelivery?.toDate()
      })
    })

    return orders
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

export const getOrdersBySupplier = async (supplierId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('items', 'array-contains-any', [{ supplierId }]),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const orders = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const supplierItems = data.items.filter(item => item.supplierId === supplierId)
      
      if (supplierItems.length > 0) {
        orders.push({
          id: doc.id,
          ...data,
          items: supplierItems,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          estimatedDelivery: data.estimatedDelivery?.toDate(),
          actualDelivery: data.actualDelivery?.toDate()
        })
      }
    })

    return orders
  } catch (error) {
    console.error('Error fetching supplier orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

export const getAllOrders = async (limitCount = 100) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const orders = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        estimatedDelivery: data.estimatedDelivery?.toDate(),
        actualDelivery: data.actualDelivery?.toDate()
      })
    })

    return orders
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

export const updateOrderStatus = async (orderId, newStatus, note = null) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Order not found')
    }

    const currentData = docSnap.data()
    const statusHistory = currentData.statusHistory || []

    const updateData = {
      status: newStatus,
      statusHistory: [
        ...statusHistory,
        {
          status: newStatus,
          timestamp: Timestamp.fromDate(new Date()),
          note: note || `Status updated to ${newStatus}`
        }
      ],
      updatedAt: serverTimestamp()
    }

    if (newStatus === 'delivered') {
      updateData.actualDelivery = serverTimestamp()
      updateData.paymentStatus = 'paid'
    }

    await updateDoc(docRef, updateData)

    return { id: orderId, ...currentData, ...updateData }
  } catch (error) {
    console.error('Error updating order status:', error)
    throw new Error('Failed to update order status')
  }
}

export const updateOrder = async (orderId, updateData) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId)
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    })

    return await getOrderById(orderId)
  } catch (error) {
    console.error('Error updating order:', error)
    throw new Error('Failed to update order')
  }
}

export const cancelOrder = async (orderId, reason) => {
  try {
    return await updateOrderStatus(orderId, 'cancelled', reason)
  } catch (error) {
    console.error('Error cancelling order:', error)
    throw new Error('Failed to cancel order')
  }
}

export const getOrdersByStatus = async (status, limitCount = 50) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const orders = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        estimatedDelivery: data.estimatedDelivery?.toDate(),
        actualDelivery: data.actualDelivery?.toDate()
      })
    })

    return orders
  } catch (error) {
    console.error('Error fetching orders by status:', error)
    throw new Error('Failed to fetch orders')
  }
}