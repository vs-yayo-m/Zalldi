// src/components/ui/Input.jsx

import React, { forwardRef } from 'react'

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'px-4 py-3 rounded-xl border bg-white text-neutral-800 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed'
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const inputClasses = `${baseClasses} ${errorClasses} ${widthClass} ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${className}`
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input