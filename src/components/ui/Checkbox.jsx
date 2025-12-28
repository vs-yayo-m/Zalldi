// src/components/ui/Checkbox.jsx

import React, { forwardRef } from 'react'
import { Check } from 'lucide-react'

const Checkbox = forwardRef(({
  label,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className="peer w-5 h-5 rounded-md border-2 border-neutral-300 bg-white transition-colors checked:bg-primary-500 checked:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-neutral-100 disabled:cursor-not-allowed appearance-none cursor-pointer"
            {...props}
          />
          <Check 
            size={16} 
            className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
            strokeWidth={3}
          />
        </div>
        
        {label && (
          <div className="flex-1 min-w-0">
            <span className={`text-sm ${disabled ? 'text-neutral-400' : 'text-neutral-700'}`}>
              {label}
            </span>
            {helperText && !error && (
              <p className="mt-0.5 text-xs text-neutral-500">
                {helperText}
              </p>
            )}
          </div>
        )}
      </label>
      
      {error && (
        <p className="mt-1 text-sm text-red-500 ml-8">
          {error}
        </p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox