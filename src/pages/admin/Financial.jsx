// src/pages/admin/Financial.jsx

import { Suspense } from 'react'
import FinancialDashboard from '@components/admin/FinancialDashboard'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Financial() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <FinancialDashboard />
    </Suspense>
  )
}