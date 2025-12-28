// src/components/shared/DatePicker.jsx

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns'
import { useClickOutside } from '@hooks/useClickOutside'

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date())
  const containerRef = useRef(null)
  
  useClickOutside(containerRef, () => setIsOpen(false))
  
  const handleDateSelect = (date) => {
    if (onChange) onChange(date)
    setIsOpen(false)
  }
  
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  
  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true
    if (maxDate && date > new Date(maxDate)) return true
    return false
  }
  
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border bg-white text-left
          flex items-center justify-between transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'}
          ${isOpen ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-neutral-300'}
        `}
      >
        <span className={value ? 'text-neutral-800' : 'text-neutral-400'}>
          {value ? format(new Date(value), 'PPP') : placeholder}
        </span>
        <Calendar className="w-5 h-5 text-neutral-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="font-semibold text-neutral-800">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={day}
                  className="text-caption text-neutral-500 text-center font-medium py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = value && isSameDay(day, new Date(value))
                const isCurrentDay = isToday(day)
                const disabled = isDateDisabled(day)

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !disabled && handleDateSelect(day)}
                    disabled={disabled}
                    className={`
                      p-2 text-body-sm rounded-lg transition-all duration-200
                      ${!isCurrentMonth ? 'text-neutral-300' : 'text-neutral-800'}
                      ${isSelected ? 'bg-orange-500 text-white font-semibold hover:bg-orange-600' : ''}
                      ${!isSelected && isCurrentDay ? 'bg-orange-50 text-orange-600 font-semibold' : ''}
                      ${!isSelected && !isCurrentDay ? 'hover:bg-neutral-100' : ''}
                      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  if (onChange) onChange(new Date())
                  setIsOpen(false)
                }}
                className="px-4 py-2 text-body-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onChange) onChange(null)
                  setIsOpen(false)
                }}
                className="px-4 py-2 text-body-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}