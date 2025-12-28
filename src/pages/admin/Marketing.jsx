// src/pages/admin/Marketing.jsx

import { Suspense } from 'react'
import MarketingTools from '@components/admin/MarketingTools'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Marketing() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <MarketingTools />
    </Suspense>
  )
}