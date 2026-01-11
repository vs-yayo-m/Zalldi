// src/hooks/useOrders.js (REFACTORED - ENTERPRISE GRADE)

import { useState, useEffect, useCallback, useMemo } from 'react'
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from './useAuth'

export function useOrders(options = {}) {
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
    let unsubscribe

    try {
      const ordersRef = collection(db, 'orders')
      let q

      if (user.role === 'customer') {
        q = query(
          ordersRef,
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
      } else if (user.role === 'supplier') {
        q = query(
          ordersRef,
          where('supplierId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
      } else {
        q = query(ordersRef, orderBy('createdAt', 'desc'))
      }

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const ordersData = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
              estimatedDelivery: data.estimatedDelivery?.toDate ? data.estimatedDelivery.toDate() : null,
              actualDelivery: data.actualDelivery?.toDate ? data.actualDelivery.toDate() : null
            }
          })

          setOrders(ordersData)
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('Orders fetch error:', err)
          setError(err.message)
          setLoading(false)
        }
      )
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }

    return () => unsubscribe?.()
  }, [user])

  const activeOrders = useMemo(() => 
    orders.filter(o => ['pending', 'confirmed', 'picking', 'packing', 'out_for_delivery'].includes(o.status))
  , [orders])

  const completedOrders = useMemo(() =>
    orders.filter(o => o.status === 'delivered')
  , [orders])

  const getOrderById = useCallback(async (orderId) => {
    try {
      const docRef = doc(db, 'orders', orderId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          estimatedDelivery: data.estimatedDelivery?.toDate(),
          actualDelivery: data.actualDelivery?.toDate()
        }
      }
      return null
    } catch (err) {
      console.error('Get order error:', err)
      throw err
    }
  }, [])

  return {
    orders,
    activeOrders,
    completedOrders,
    loading,
    error,
    getOrderById,
    totalOrders: orders.length,
    activeCount: activeOrders.length,
    completedCount: completedOrders.length
  }
}