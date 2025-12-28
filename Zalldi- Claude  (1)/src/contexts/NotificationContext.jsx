// src/contexts/NotificationContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { notificationService } from '@services/notification.service'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (user) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [user])
  
  const fetchNotifications = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await notificationService.getUserNotifications(user.uid, { limit: 20 })
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchUnreadCount = async () => {
    if (!user) return
    try {
      const count = await notificationService.getUnreadCount(user.uid)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }
  
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }
  
  const markAllAsRead = async () => {
    if (!user) return
    try {
      await notificationService.markAllAsRead(user.uid)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}