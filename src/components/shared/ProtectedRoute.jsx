// src/components/shared/ProtectedRoute.jsx

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoadingScreen from './LoadingScreen'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export function RoleBasedRoute({ children, role }) {
  return (
    <ProtectedRoute allowedRoles={[role]}>
      {children}
    </ProtectedRoute>
  )
}