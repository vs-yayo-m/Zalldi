// src/utils/formatters.js

import { format, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns'

export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === undefined || amount === null) return showSymbol ? 'Rs. 0' : '0'
  
  const numAmount = Number(amount)
  if (isNaN(numAmount)) return showSymbol ? 'Rs. 0' : '0'
  
  const formatted = numAmount.toLocaleString('en-NP', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
  
  return showSymbol ? `Rs. ${formatted}` : formatted
}

export const formatPhone = (phone) => {
  if (!phone) return ''
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return ''
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    return format(dateObj, formatStr)
  } catch {
    return ''
  }
}

export const formatDateTime = (date) => {
  return formatDate(date, 'PPP p')
}

export const formatTime = (date) => {
  return formatDate(date, 'p')
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch {
    return ''
  }
}

export const formatTimeRemaining = (targetDate) => {
  if (!targetDate) return ''
  
  try {
    const target = targetDate instanceof Date ? targetDate : new Date(targetDate)
    const now = new Date()
    
    const minutes = differenceInMinutes(target, now)
    
    if (minutes < 0) return 'Overdue'
    if (minutes === 0) return 'Now'
    if (minutes < 60) return `${minutes} min`
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours < 24) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
    
    const days = Math.floor(hours / 24)
    return `${days}d`
  } catch {
    return ''
  }
}

export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return ''
  return orderNumber.toUpperCase()
}

export const formatPercentage = (value, decimals = 0) => {
  if (value === undefined || value === null) return '0%'
  
  const numValue = Number(value)
  if (isNaN(numValue)) return '0%'
  
  return `${numValue.toFixed(decimals)}%`
}

export const formatWeight = (weight, unit = 'kg') => {
  if (weight === undefined || weight === null) return ''
  
  const numWeight = Number(weight)
  if (isNaN(numWeight)) return ''
  
  return `${numWeight} ${unit}`
}

export const formatQuantity = (quantity, unit = 'pc') => {
  if (quantity === undefined || quantity === null) return ''
  
  const numQuantity = Number(quantity)
  if (isNaN(numQuantity)) return ''
  
  if (unit === 'pc' && numQuantity === 1) return '1 piece'
  if (unit === 'pc' && numQuantity > 1) return `${numQuantity} pieces`
  
  return `${numQuantity} ${unit}`
}

export const formatAddress = (address) => {
  if (!address) return ''
  
  const parts = [
    address.street,
    address.area,
    address.ward ? `Ward ${address.ward}` : null,
    address.landmark ? `Near ${address.landmark}` : null
  ].filter(Boolean)
  
  return parts.join(', ')
}

export const formatShortAddress = (address) => {
  if (!address) return ''
  
  const parts = [
    address.area,
    address.ward ? `Ward ${address.ward}` : null
  ].filter(Boolean)
  
  return parts.join(', ')
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const formatRating = (rating) => {
  if (rating === undefined || rating === null) return '0.0'
  
  const numRating = Number(rating)
  if (isNaN(numRating)) return '0.0'
  
  return numRating.toFixed(1)
}

export const formatReviewCount = (count) => {
  if (!count) return 'No reviews'
  if (count === 1) return '1 review'
  return `${count.toLocaleString()} reviews`
}

export const formatStock = (stock) => {
  if (stock === undefined || stock === null) return 'Out of stock'
  
  const numStock = Number(stock)
  if (isNaN(numStock) || numStock <= 0) return 'Out of stock'
  
  if (numStock < 10) return `Only ${numStock} left`
  return 'In stock'
}

export const formatDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return null
  
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
  return Math.round(discount)
}

export const formatSlug = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const formatName = (firstName, lastName) => {
  const parts = [firstName, lastName].filter(Boolean)
  return parts.join(' ')
}

export const formatInitials = (name) => {
  if (!name) return ''
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return `${text.slice(0, maxLength).trim()}...`
}

export const formatSearchQuery = (query) => {
  if (!query) return ''
  return query.trim().replace(/\s+/g, ' ')
}

export const formatCardNumber = (number) => {
  if (!number) return ''
  
  const cleaned = number.replace(/\s/g, '')
  const groups = cleaned.match(/.{1,4}/g) || []
  
  return groups.join(' ')
}

export const capitalizeFirst = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const capitalizeWords = (text) => {
  if (!text) return ''
  return text.split(' ').map(capitalizeFirst).join(' ')
}