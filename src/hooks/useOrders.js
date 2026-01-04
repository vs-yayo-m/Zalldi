// src/hooks/useOrders.js

import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from './useAuth'

// The App ID is provided by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

export function useOrders(options = {}) {
  const { filterStatus = null, limitCount = null } = options
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null); // For single order fetching

  useEffect(() => {
    // RULE 3: Auth Before Queries
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      /**
       * RULE 1 & 2: 
       * 1. Use the strict path: /artifacts/{appId}/public/data/{collection}
       * 2. Fetch all and filter in JS memory (Avoid complex compound queries)
       */
      const ordersRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
      
      // We use a simple query to get all orders, then filter in memory to avoid index requirements
      const q = query(ordersRef);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))

          // ROLE-BASED FILTERING (In-Memory)
          if (user.role === 'customer') {
            ordersData = ordersData.filter(o => o.customerId === user.uid);
          } else if (user.role === 'supplier') {
            ordersData = ordersData.filter(o => o.supplierId === user.uid);
          }
          // Admin sees all

          // STATUS FILTERING (In-Memory)
          if (filterStatus) {
            if (filterStatus === 'active') {
              ordersData = ordersData.filter(order => 
                ['confirmed', 'picking', 'packing', 'out_for_delivery'].includes(order.status)
              )
            } else {
              ordersData = ordersData.filter(order => order.status === filterStatus)
            }
          }

          // SORTING (In-Memory)
          ordersData.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA;
          });

          // LIMITING (In-Memory)
          if (limitCount) {
            ordersData = ordersData.slice(0, limitCount);
          }

          setOrders(ordersData)
          setLoading(false)
          setError(null)
        },
        (err) => {
          console.error('Firestore Error:', err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [user, filterStatus, limitCount])

  // Helper for OrderDetail page
  const fetchOrder = async (orderId) => {
    if (!user || !orderId) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    order, // Used by OrderDetail
    loading,
    error,
    fetchOrder,
    getOrdersCount: () => orders.length,
    getTotalRevenue: () => orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  }
}