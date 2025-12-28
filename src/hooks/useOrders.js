// src/hooks/useOrders.js

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import {
  getOrdersByCustomer,
  getOrdersBySupplier,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder as cancelOrderService
} from '@services/order.service'
import { USER_ROLES } from '@utils/constants'

export const useOrders = (options = {}) => {
  const { user } = useAuth()
  const {
    orderId = null,
    autoFetch = true,
    limitCount = 50
  } = options

  const [orders, setOrders] = useState([])
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let fetchedOrders = []

      if (user.role === USER_ROLES.ADMIN) {
        fetchedOrders = await getAllOrders(limitCount)
      } else if (user.role === USER_ROLES.SUPPLIER) {
        fetchedOrders = await getOrdersBySupplier(user.uid, limitCount)
      } else {
        fetchedOrders = await getOrdersByCustomer(user.uid, limitCount)
      }

      setOrders(fetchedOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [user, limitCount])

  const fetchOrder = useCallback(async (id) => {
    setLoading(true)
    setError(null)

    try {
      const fetchedOrder = await getOrderById(id)
      setOrder(fetchedOrder)
      return fetchedOrder
    } catch (err) {
      console.error('Error fetching order:', err)
      setError(err.message || 'Failed to fetch order')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id, newStatus, note = null) => {
    try {
      const updatedOrder = await updateOrderStatus(id, newStatus, note)
      
      setOrders(prev =>
        prev.map(o => (o.id === id ? updatedOrder : o))
      )
      
      if (order?.id === id) {
        setOrder(updatedOrder)
      }
      
      return updatedOrder
    } catch (err) {
      console.error('Error updating order status:', err)
      throw err
    }
  }, [order])

  const cancelOrder = useCallback(async (id, reason) => {
    try {
      const cancelledOrder = await cancelOrderService(id, reason)
      
      setOrders(prev =>
        prev.map(o => (o.id === id ? cancelledOrder : o))
      )
      
      if (order?.id === id) {
        setOrder(cancelledOrder)
      }
      
      return cancelledOrder
    } catch (err) {
      console.error('Error cancelling order:', err)
      throw err
    }
  }, [order])

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    if (autoFetch && !orderId) {
      fetchOrders()
    }
  }, [autoFetch, orderId, fetchOrders, refreshTrigger])

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    }
  }, [orderId, fetchOrder])

  const getOrdersByStatus = useCallback((status) => {
    return orders.filter(o => o.status === status)
  }, [orders])

  const getPendingOrders = useCallback(() => {
    return getOrdersByStatus('pending')
  }, [getOrdersByStatus])

  const getActiveOrders = useCallback(() => {
    return orders.filter(o =>
      ['pending', 'confirmed', 'picking', 'packing', 'out_for_delivery'].includes(o.status)
    )
  }, [orders])

  const getCompletedOrders = useCallback(() => {
    return getOrdersByStatus('delivered')
  }, [getOrdersByStatus])

  const getCancelledOrders = useCallback(() => {
    return getOrdersByStatus('cancelled')
  }, [getOrdersByStatus])

  return {
    orders,
    order,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    updateStatus,
    cancelOrder,
    refresh,
    getOrdersByStatus,
    getPendingOrders,
    getActiveOrders,
    getCompletedOrders,
    getCancelledOrders
  }
}