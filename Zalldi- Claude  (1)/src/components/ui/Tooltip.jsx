// src/components/ui/Tooltip.jsx

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)
  
  const positions = {
    top: {
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 }
    },
    bottom: {
      initial: { opacity: 0, y: -5 },
      animate: { opacity: 1, y: 0 }
    },
    left: {
      initial: { opacity: 0, x: 5 },
      animate: { opacity: 1, x: 0 }
    },
    right: {
      initial: { opacity: 0, x: -5 },
      animate: { opacity: 1, x: 0 }
    }
  }
  
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return
    
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    
    let x = 0
    let y = 0
    
    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.top - tooltipRect.height - 8
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.bottom + 8
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      case 'right':
        x = triggerRect.right + 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      default:
        break
    }
    
    setCoords({ x, y })
  }
  
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }
  
  useEffect(() => {
    if (isVisible) {
      updatePosition()
    }
  }, [isVisible])
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  if (!content) return <>{children}</>
  
  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={positions[position].initial}
            animate={positions[position].animate}
            exit={positions[position].initial}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              zIndex: 1070
            }}
            className={`bg-neutral-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap ${className}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Tooltip