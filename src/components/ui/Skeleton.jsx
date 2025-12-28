// src/components/ui/Skeleton.jsx

import React from 'react'

const Skeleton = ({
  variant = 'text',
  width,
  height,
  circle = false,
  className = ''
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    button: 'h-12 rounded-xl',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 rounded-2xl',
    image: 'aspect-square rounded-xl'
  }
  
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]'
  
  const variantClass = variants[variant] || variants.text
  
  const circleClass = circle ? 'rounded-full' : ''
  
  const style = {
    ...(width && { width }),
    ...(height && { height })
  }
  
  return (
    <div 
      className={`${baseClasses} ${variantClass} ${circleClass} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          width={index === lines - 1 ? '80%' : '100%'} 
        />
      ))}
    </div>
  )
}

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      <Skeleton variant="image" className="mb-4" />
      <Skeleton variant="title" className="mb-3" />
      <SkeletonText lines={2} />
    </div>
  )
}

export const SkeletonProductCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden ${className}`}>
      <Skeleton variant="image" />
      <div className="p-4">
        <Skeleton variant="title" className="mb-2" />
        <Skeleton width="60%" className="mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton width="80px" height="24px" />
          <Skeleton width="100px" height="40px" className="rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default Skeleton