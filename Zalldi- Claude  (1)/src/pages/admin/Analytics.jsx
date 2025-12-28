// src/pages/admin/Analytics.jsx

import { Suspense } from 'react'
import AnalyticsPanel from '@components/admin/AnalyticsPanel'
import LoadingScreen from '@components/shared/LoadingScreen'

export default function Analytics() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnalyticsPanel />
    </Suspense>
  )
}