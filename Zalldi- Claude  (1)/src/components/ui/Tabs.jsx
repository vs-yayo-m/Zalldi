// src/components/ui/Tabs.jsx

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Tabs({ tabs, defaultTab = 0, onChange, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  const handleTabChange = (index) => {
    setActiveTab(index)
    if (onChange) onChange(index)
  }
  
  return (
    <div className={`w-full ${className}`}>
      <div className="border-b border-neutral-200">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`relative py-4 px-1 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === index
                  ? 'text-orange-500'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              {tab.label}
              {activeTab === index && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tabs[activeTab]?.content}
        </motion.div>
      </div>
    </div>
  )
}

export function TabPanel({ children, className = '' }) {
  return <div className={className}>{children}</div>
}