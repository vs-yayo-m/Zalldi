// src/components/ui/Switch.jsx

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

const Switch = forwardRef(({
  label,
  error,
  helperText,
  disabled = false,
  checked = false,
  onChange,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          
          <div className={`
            w-11 h-6 rounded-full transition-colors
            ${checked ? 'bg-primary-500' : 'bg-neutral-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2
          `}>
            <motion.div
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{
                x: checked ? 20 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          </div>
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
        <p className="mt-1 text-sm text-red-500 ml-14">
          {error}
        </p>
      )}
    </div>
  )
})

Switch.displayName = 'Switch'

export default Switch