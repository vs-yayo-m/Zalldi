// src/components/shared/EmptyState.jsx

import React from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Search, Heart, FileText, Inbox } from 'lucide-react'
import Button from '@components/ui/Button'

const icons = {
  package: Package,
  cart: ShoppingCart,
  search: Search,
  heart: Heart,
  file: FileText,
  inbox: Inbox
}

const EmptyState = ({
  icon = 'inbox',
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  const Icon = icons[icon] || Inbox
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-6"
      >
        <Icon size={48} className="text-neutral-400" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-neutral-600 max-w-md mb-6">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState