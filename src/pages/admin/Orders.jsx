// src/pages/admin/Orders.jsx

import { Suspense } from 'react'
import OrderManagement from '@components/admin/OrderManagement'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Orders() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OrderManagement />
    </Suspense>
  )
}