// src/pages/admin/Products.jsx

import { Suspense } from 'react'
import ProductManagement from '@components/admin/ProductManagement'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Products() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ProductManagement />
    </Suspense>
  )
}