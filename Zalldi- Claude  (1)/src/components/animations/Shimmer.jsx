// src/components/animations/Shimmer.jsx

import { motion } from 'framer-motion'

export default function Shimmer({ className = '', width = '100%', height = '100%', rounded = 'rounded-lg' }) {
  return (
    <div 
      className={`relative overflow-hidden bg-neutral-200 ${rounded} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

export function ShimmerText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          height="16px"
          width={i === lines - 1 ? '60%' : '100%'}
          rounded="rounded-md"
        />
      ))}
    </div>
  )
}

export function ShimmerCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card p-4 ${className}`}>
      <Shimmer height="200px" className="mb-4" />
      <Shimmer height="24px" width="80%" className="mb-2" />
      <Shimmer height="16px" width="60%" className="mb-4" />
      <div className="flex items-center justify-between">
        <Shimmer height="32px" width="80px" rounded="rounded-full" />
        <Shimmer height="40px" width="40px" rounded="rounded-full" />
      </div>
    </div>
  )
}

export function ShimmerProductCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <Shimmer height="240px" rounded="rounded-none" />
      <div className="p-4">
        <Shimmer height="20px" width="90%" className="mb-2" />
        <Shimmer height="16px" width="70%" className="mb-3" />
        <div className="flex items-center justify-between mb-3">
          <Shimmer height="24px" width="80px" />
          <Shimmer height="20px" width="60px" />
        </div>
        <Shimmer height="44px" rounded="rounded-xl" />
      </div>
    </div>
  )
}

export function ShimmerList({ items = 5, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Shimmer width="60px" height="60px" rounded="rounded-lg" />
          <div className="flex-1 space-y-2">
            <Shimmer height="20px" width="70%" />
            <Shimmer height="16px" width="50%" />
          </div>
        </div>
      ))}
    </div>
  )
}