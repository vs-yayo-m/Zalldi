// src/components/ui/Alert.jsx

import React from 'react'
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react'

const Alert = ({
  variant = 'info',
  title,
  children,
  closable = false,
  onClose,
  className = ''
}) => {
  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: AlertCircle,
      iconColor: 'text-amber-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    }
  }
  
  const config = variants[variant]
  const Icon = config.icon
  
  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-4 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <Icon size={20} className={`${config.iconColor} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`${config.text} font-semibold mb-1`}>
              {title}
            </h4>
          )}
          {children && (
            <div className={`${config.text} text-sm`}>
              {children}
            </div>
          )}
        </div>
        
        {closable && (
          <button
            onClick={onClose}
            className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0 focus:outline-none`}
            aria-label="Close alert"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert