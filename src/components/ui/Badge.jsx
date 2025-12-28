// src/components/ui/Badge.jsx

import React from 'react'

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className = ''
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-neutral-100 text-neutral-700'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  }
  
  const roundedSizes = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  
  const classes = `inline-flex items-center font-medium ${variants[variant]} ${sizes[size]} ${roundedSizes[rounded]} ${className}`
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}

export default Badge