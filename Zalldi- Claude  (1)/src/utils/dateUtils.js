// src/utils/dateUtils.js

import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatRelative,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  addMinutes,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isBefore,
  isAfter,
  isSameDay,
  parseISO
} from 'date-fns'

export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return ''
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr)
  } catch {
    return ''
  }
}

export const formatDateTime = (date, formatStr = 'PPP p') => {
  return formatDate(date, formatStr)
}

export const formatTime = (date, formatStr = 'p') => {
  return formatDate(date, formatStr)
}

export const formatShortDate = (date) => {
  return formatDate(date, 'MMM d, yyyy')
}

export const formatLongDate = (date) => {
  return formatDate(date, 'MMMM d, yyyy')
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch {
    return ''
  }
}

export const formatRelativeDate = (date) => {
  if (!date) return ''
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatRelative(dateObj, new Date())
  } catch {
    return ''
  }
}

export const formatTimeDistance = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
    return formatDistance(start, end)
  } catch {
    return ''
  }
}

export const getTimeDifference = (date1, date2, unit = 'minutes') => {
  if (!date1 || !date2) return 0
  
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
    
    switch (unit) {
      case 'minutes':
        return differenceInMinutes(d1, d2)
      case 'hours':
        return differenceInHours(d1, d2)
      case 'days':
        return differenceInDays(d1, d2)
      case 'weeks':
        return differenceInWeeks(d1, d2)
      case 'months':
        return differenceInMonths(d1, d2)
      default:
        return differenceInMinutes(d1, d2)
    }
  } catch {
    return 0
  }
}

export const addTime = (date, amount, unit = 'minutes') => {
  if (!date) return null
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    switch (unit) {
      case 'minutes':
        return addMinutes(dateObj, amount)
      case 'hours':
        return addHours(dateObj, amount)
      case 'days':
        return addDays(dateObj, amount)
      case 'weeks':
        return addWeeks(dateObj, amount)
      case 'months':
        return addMonths(dateObj, amount)
      default:
        return addMinutes(dateObj, amount)
    }
  } catch {
    return null
  }
}

export const getDateRange = (type = 'today') => {
  const now = new Date()
  
  switch (type) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) }
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) }
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) }
    default:
      return { start: startOfDay(now), end: endOfDay(now) }
  }
}

export const isDateToday = (date) => {
  if (!date) return false
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isToday(dateObj)
  } catch {
    return false
  }
}

export const isDateTomorrow = (date) => {
  if (!date) return false
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isTomorrow(dateObj)
  } catch {
    return false
  }
}

export const isDateYesterday = (date) => {
  if (!date) return false
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isYesterday(dateObj)
  } catch {
    return false
  }
}

export const isDateThisWeek = (date) => {
  if (!date) return false
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isThisWeek(dateObj)
  } catch {
    return false
  }
}

export const isDateThisMonth = (date) => {
  if (!date) return false
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isThisMonth(dateObj)
  } catch {
    return false
  }
}

export const isDateThisYear = (date) => {
  if (!date) return false
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isThisYear(dateObj)
  } catch {
    return false
  }
}

export const compareDates = (date1, date2, comparison = 'before') => {
  if (!date1 || !date2) return false
  
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
    
    switch (comparison) {
      case 'before':
        return isBefore(d1, d2)
      case 'after':
        return isAfter(d1, d2)
      case 'same':
        return isSameDay(d1, d2)
      default:
        return false
    }
  } catch {
    return false
  }
}

export const getReadableDate = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    if (isDateToday(dateObj)) return 'Today'
    if (isDateTomorrow(dateObj)) return 'Tomorrow'
    if (isDateYesterday(dateObj)) return 'Yesterday'
    if (isDateThisWeek(dateObj)) return format(dateObj, 'EEEE')
    if (isDateThisYear(dateObj)) return format(dateObj, 'MMM d')
    return format(dateObj, 'MMM d, yyyy')
  } catch {
    return ''
  }
}

export const getTimeAgo = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const minutes = differenceInMinutes(new Date(), dateObj)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks}w ago`
    
    return formatDate(dateObj, 'MMM d, yyyy')
  } catch {
    return ''
  }
}

export const parseDate = (dateString) => {
  if (!dateString) return null
  try {
    return parseISO(dateString)
  } catch {
    return null
  }
}

export const isValidDate = (date) => {
  if (!date) return false
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
  } catch {
    return false
  }
}

export const getCurrentTimestamp = () => {
  return new Date().toISOString()
}

export const getUnixTimestamp = (date = new Date()) => {
  return Math.floor(date.getTime() / 1000)
}

export const fromUnixTimestamp = (timestamp) => {
  return new Date(timestamp * 1000)
}