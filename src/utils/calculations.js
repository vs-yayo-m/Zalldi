// src/utils/calculations.js

import { DELIVERY } from './constants'

export const calculateItemTotal = (price, quantity) => {
  const numPrice = Number(price) || 0
  const numQuantity = Number(quantity) || 0
  return numPrice * numQuantity
}

export const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items)) return 0
  
  return items.reduce((total, item) => {
    return total + calculateItemTotal(item.price, item.quantity)
  }, 0)
}

export const calculateDeliveryFee = (subtotal, deliveryType = 'standard') => {
  if (subtotal >= DELIVERY.freeThreshold && DELIVERY.freeThreshold > 0) {
    return 0
  }
  
  return deliveryType === 'express' ? DELIVERY.expressFee : DELIVERY.standardFee
}

export const calculateDiscount = (subtotal, discountPercentage = 0, maxDiscount = null) => {
  const discount = (subtotal * discountPercentage) / 100
  
  if (maxDiscount && discount > maxDiscount) {
    return maxDiscount
  }
  
  return discount
}

export const calculateTotal = (subtotal, deliveryFee, discount = 0) => {
  const total = subtotal + deliveryFee - discount
  return Math.max(0, total)
}

export const calculateOrderTotal = (items, deliveryType = 'standard', discountPercentage = 0) => {
  const subtotal = calculateSubtotal(items)
  const deliveryFee = calculateDeliveryFee(subtotal, deliveryType)
  const discount = calculateDiscount(subtotal, discountPercentage)
  const total = calculateTotal(subtotal, deliveryFee, discount)
  
  return {
    subtotal,
    deliveryFee,
    discount,
    total
  }
}

export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  const numPrice = Number(originalPrice) || 0
  const numDiscount = Number(discountPercentage) || 0
  
  const discountAmount = (numPrice * numDiscount) / 100
  return Math.max(0, numPrice - discountAmount)
}

export const calculateSavings = (originalPrice, discountedPrice) => {
  const numOriginal = Number(originalPrice) || 0
  const numDiscounted = Number(discountedPrice) || 0
  
  return Math.max(0, numOriginal - numDiscounted)
}

export const calculatePercentageChange = (oldValue, newValue) => {
  const numOld = Number(oldValue) || 0
  const numNew = Number(newValue) || 0
  
  if (numOld === 0) return 0
  
  return ((numNew - numOld) / numOld) * 100
}

export const calculateAverageRating = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return 0
  }
  
  const sum = reviews.reduce((total, review) => {
    return total + (Number(review.rating) || 0)
  }, 0)
  
  return sum / reviews.length
}

export const calculateRatingDistribution = (reviews) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  if (!reviews || !Array.isArray(reviews)) {
    return distribution
  }
  
  reviews.forEach(review => {
    const rating = Number(review.rating)
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++
    }
  })
  
  return distribution
}

export const calculateEstimatedDeliveryTime = (orderTime, deliveryType = 'standard') => {
  const orderDate = orderTime instanceof Date ? orderTime : new Date(orderTime)
  const minutes = deliveryType === 'express' ? DELIVERY.expressTime : DELIVERY.standardTime
  
  return new Date(orderDate.getTime() + minutes * 60000)
}

export const calculateTax = (amount, taxRate = 0) => {
  const numAmount = Number(amount) || 0
  const numRate = Number(taxRate) || 0
  
  return (numAmount * numRate) / 100
}

export const calculateCommission = (amount, commissionRate = 10) => {
  const numAmount = Number(amount) || 0
  const numRate = Number(commissionRate) || 0
  
  return (numAmount * numRate) / 100
}

export const calculateSupplierPayout = (orderTotal, commissionRate = 10) => {
  const commission = calculateCommission(orderTotal, commissionRate)
  return orderTotal - commission
}

export const calculateCartItemCount = (items) => {
  if (!items || !Array.isArray(items)) return 0
  
  return items.reduce((count, item) => {
    return count + (Number(item.quantity) || 0)
  }, 0)
}

export const calculatePaginationRange = (currentPage, totalPages, maxVisible = 5) => {
  const halfVisible = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, currentPage - halfVisible)
  let end = Math.min(totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export const calculateTimeSlots = (openTime = '06:00', closeTime = '23:00', slotDuration = 60) => {
  const slots = []
  const [openHour, openMin] = openTime.split(':').map(Number)
  const [closeHour, closeMin] = closeTime.split(':').map(Number)
  
  let currentMinutes = openHour * 60 + openMin
  const closeMinutes = closeHour * 60 + closeMin
  
  while (currentMinutes < closeMinutes) {
    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60
    
    const nextMinutes = currentMinutes + slotDuration
    const nextHours = Math.floor(nextMinutes / 60)
    const nextMins = nextMinutes % 60
    
    slots.push({
      start: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      end: `${String(nextHours).padStart(2, '0')}:${String(nextMins).padStart(2, '0')}`,
      value: currentMinutes
    })
    
    currentMinutes = nextMinutes
  }
  
  return slots
}

export const calculateStockValue = (products) => {
  if (!products || !Array.isArray(products)) return 0
  
  return products.reduce((total, product) => {
    const price = Number(product.price) || 0
    const stock = Number(product.stock) || 0
    return total + (price * stock)
  }, 0)
}

export const calculateRevenue = (orders) => {
  if (!orders || !Array.isArray(orders)) return 0
  
  return orders
    .filter(order => order.status === 'delivered')
    .reduce((total, order) => {
      return total + (Number(order.total) || 0)
    }, 0)
}

export const calculateConversionRate = (visitors, orders) => {
  const numVisitors = Number(visitors) || 0
  const numOrders = Number(orders) || 0
  
  if (numVisitors === 0) return 0
  
  return (numOrders / numVisitors) * 100
}

export const calculateAverageOrderValue = (orders) => {
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return 0
  }
  
  const totalRevenue = calculateRevenue(orders)
  return totalRevenue / orders.length
}

export const calculateGrowthRate = (currentValue, previousValue) => {
  const current = Number(currentValue) || 0
  const previous = Number(previousValue) || 0
  
  if (previous === 0) return current > 0 ? 100 : 0
  
  return ((current - previous) / previous) * 100
}

export const roundToTwo = (num) => {
  return Math.round((Number(num) || 0) * 100) / 100
}

export const roundToNearest = (num, nearest = 5) => {
  return Math.round((Number(num) || 0) / nearest) * nearest
}