// src/pages/admin/Customers.jsx

import { Suspense } from 'react'
import UserManagement from '@components/admin/UserManagement'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Customers() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <UserManagement userType="customer" />
    </Suspense>
  )
}