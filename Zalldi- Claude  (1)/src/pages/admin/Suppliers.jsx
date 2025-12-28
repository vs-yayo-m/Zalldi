// src/pages/admin/Suppliers.jsx

import { Suspense } from 'react'
import SupplierManagement from '@components/admin/SupplierManagement'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Suppliers() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SupplierManagement />
    </Suspense>
  )
}