// src/components/ui/Select.jsx

import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'px-4 py-3 pr-10 rounded-xl border bg-white text-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed appearance-none cursor-pointer'
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const selectClasses = `${baseClasses} ${errorClasses} ${widthClass} ${className}`
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          <ChevronDown size={20} />
        </div>
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

Select.displayName = 'Select'

export default Select