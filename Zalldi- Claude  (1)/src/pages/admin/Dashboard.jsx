// src/pages/admin/Dashboard.jsx

import { Suspense } from 'react'
import AdminDashboard from '@components/admin/AdminDashboard'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AdminDashboard />
    </Suspense>
  )
}