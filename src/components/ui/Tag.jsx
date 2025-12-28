// src/components/ui/Tag.jsx

import React from 'react'
import { X } from 'lucide-react'

const Tag = ({
  children,
  variant = 'default',
  closable = false,
  onClose,
  className = ''
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    success: 'bg-green-100 text-green-700 hover:bg-green-200',
    warning: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200'
  }
  
  const classes = `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${variants[variant]} ${className}`
  
  return (
    <span className={classes}>
      {children}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className="ml-1 hover:opacity-70 transition-opacity focus:outline-none"
          aria-label="Remove"
        >
          <X size={14} />
        </button>
      )}
    </span>
  )
}

export default Tag