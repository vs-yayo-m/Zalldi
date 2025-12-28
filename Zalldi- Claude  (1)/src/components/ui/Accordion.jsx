// src/components/ui/Accordion.jsx

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Accordion({ items, allowMultiple = false, className = '' }) {
  const [openItems, setOpenItems] = useState([])
  
  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index) ?
        prev.filter(i => i !== index) :
        [...prev, index]
      )
    } else {
      setOpenItems(prev =>
        prev.includes(index) ? [] : [index]
      )
    }
  }
  
  const isOpen = (index) => openItems.includes(index)
  
  return (
    <div className={`w-full space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-neutral-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
          >
            <span className="font-medium text-neutral-800">{item.title}</span>
            <motion.div
              animate={{ rotate: isOpen(index) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-neutral-600" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 pt-0 text-neutral-600">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
      >
        <span className="font-medium text-neutral-800">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-600" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 text-neutral-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}