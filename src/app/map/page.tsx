'use client'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'

const MapClient = dynamic(() => import('@/components/map/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex-grow flex items-center justify-center h-[calc(100vh-140px)]">
      <div className="spinner"></div>
    </div>
  )
})

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center h-[calc(100vh-140px)]">
          <div className="spinner"></div>
        </div>
      }
    >
      <MapClient />
    </Suspense>
  )
}
