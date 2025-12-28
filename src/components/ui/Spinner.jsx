// src/components/ui/Spinner.jsx

import React from 'react'

const Spinner = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  const colors = {
    primary: 'border-primary-500',
    white: 'border-white',
    neutral: 'border-neutral-500'
  }
  
  const classes = `spinner ${sizes[size]} border-4 border-t-transparent ${colors[color]} ${className}`
  
  return (
    <div className={classes} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner