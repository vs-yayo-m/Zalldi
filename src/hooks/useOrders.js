// src/hooks/useOrders.js

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from './useAuth'

export function useOrders(filterStatus = null) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)
    
    let ordersQuery

    if (user.role === 'customer') {
      ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
    } else if (user.role === 'supplier') {
      ordersQuery = query(
        collection(db, 'orders'),
        where('supplierId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
    } else if (user.role === 'admin') {
      ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      )
    } else {
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        let filteredOrders = ordersData
        if (filterStatus) {
          if (filterStatus === 'active') {
            filteredOrders = ordersData.filter(order => 
              ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
            )
          } else {
            filteredOrders = ordersData.filter(order => order.status === filterStatus)
          }
        }

        setOrders(filteredOrders)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Error fetching orders:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, filterStatus])

  const getOrderById = async (orderId) => {
    if (!user) return null
    
    try {
      const orderDoc = await getDocs(
        query(collection(db, 'orders'), where('__name__', '==', orderId))
      )
      
      if (!orderDoc.empty) {
        return {
          id: orderDoc.docs[0].id,
          ...orderDoc.docs[0].data()
        }
      }
      return null
    } catch (err) {
      console.error('Error fetching order:', err)
      return null
    }
  }

  const getOrdersByStatus = (status) => {
    if (status === 'active') {
      return orders.filter(order => 
        ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
      )
    }
    return orders.filter(order => order.status === status)
  }

  const getPendingOrders = () => {
    return orders.filter(order => order.status === 'pending')
  }

  const getDeliveredOrders = () => {
    return orders.filter(order => order.status === 'delivered')
  }

  const getActiveOrders = () => {
    return orders.filter(order => 
      ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
    )
  }

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + (order.total || 0), 0)
  }

  const getOrdersCount = () => {
    return orders.length
  }

  return {
    orders,
    loading,
    error,
    getOrderById,
    getOrdersByStatus,
    getPendingOrders,
    getDeliveredOrders,
    getActiveOrders,
    getTotalRevenue,
    getOrdersCount
  }
}