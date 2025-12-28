// src/components/ui/Card.jsx

import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  hover = false,
  padding = 'md',
  shadow = 'card',
  className = '',
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const shadows = {
    none: '',
    card: 'shadow-card',
    cardHover: 'shadow-card-hover',
    lg: 'shadow-lg'
  }
  
  const baseClasses = `bg-white rounded-2xl transition-all duration-300 ${paddings[padding]} ${shadows[shadow]} ${className}`
  
  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={{ y: -8, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={baseClasses} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export default Card