// src/components/ui/Dropdown.jsx

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const selectedOption = options.find(opt => opt.value === value)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
  }
  
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg text-left transition-colors ${
          disabled
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-white border-neutral-300 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
        }`}
      >
        <span className={selectedOption ? 'text-neutral-800' : 'text-neutral-400'}>
          {selectedOption?.label || placeholder}
        </span>
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-orange-50 transition-colors ${
                  option.value === value ? 'bg-orange-50 text-orange-600' : 'text-neutral-800'
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-5 h-5 text-orange-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DropdownMenu({ trigger, items, align = 'left', className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-50 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg min-w-48 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                    item.disabled
                      ? 'text-neutral-400 cursor-not-allowed'
                      : 'text-neutral-700 hover:bg-orange-50 hover:text-orange-600'
                  } ${item.danger ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''}`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}