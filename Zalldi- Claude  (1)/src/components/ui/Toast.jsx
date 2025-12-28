// src/components/ui/Toast.jsx

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const Toast = ({
  isOpen,
  onClose,
  variant = 'info',
  title,
  message,
  duration = 3000,
  position = 'top-right',
  closable = true
}) => {
  const variants = {
    success: {
      bg: 'bg-green-500',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-500',
      icon: XCircle
    },
    warning: {
      bg: 'bg-amber-500',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-blue-500',
      icon: Info
    }
  }
  
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }
  
  const config = variants[variant]
  const Icon = config.icon
  
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed ${positions[position]} z-[1080] max-w-sm w-full mx-4`}
        >
          <div className={`${config.bg} text-white rounded-xl shadow-lg p-4`}>
            <div className="flex items-start gap-3">
              <Icon size={20} className="flex-shrink-0 mt-0.5" />
              
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="font-semibold mb-1">
                    {title}
                  </h4>
                )}
                {message && (
                  <p className="text-sm opacity-90">
                    {message}
                  </p>
                )}
              </div>
              
              {closable && (
                <button
                  onClick={onClose}
                  className="hover:opacity-70 transition-opacity flex-shrink-0 focus:outline-none"
                  aria-label="Close notification"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast