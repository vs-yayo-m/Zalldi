// src/utils/validators.js

import { VALIDATION_RULES } from './constants'

export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!VALIDATION_RULES.email.pattern.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  
  const { minLength, maxLength, requireUppercase, requireLowercase, requireNumber } = VALIDATION_RULES.password
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`
  }
  
  if (password.length > maxLength) {
    return `Password must not exceed ${maxLength} characters`
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  
  if (requireNumber && !/\d/.test(password)) {
    return 'Password must contain at least one number'
  }
  
  return null
}

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required'
  
  const cleanPhone = phone.replace(/\s+/g, '')
  
  if (!VALIDATION_RULES.phone.pattern.test(cleanPhone)) {
    return 'Please enter a valid Nepali phone number'
  }
  
  return null
}

export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`
  
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`
  }
  
  if (name.trim().length > 100) {
    return `${fieldName} must not exceed 100 characters`
  }
  
  return null
}

export const validatePrice = (price, fieldName = 'Price') => {
  if (price === undefined || price === null || price === '') {
    return `${fieldName} is required`
  }
  
  const numPrice = Number(price)
  
  if (isNaN(numPrice)) {
    return `${fieldName} must be a valid number`
  }
  
  if (numPrice < 0) {
    return `${fieldName} cannot be negative`
  }
  
  if (numPrice > 1000000) {
    return `${fieldName} is too high`
  }
  
  return null
}

export const validateQuantity = (quantity, min = 1, max = 1000) => {
  if (quantity === undefined || quantity === null || quantity === '') {
    return 'Quantity is required'
  }
  
  const numQuantity = Number(quantity)
  
  if (isNaN(numQuantity) || !Number.isInteger(numQuantity)) {
    return 'Quantity must be a whole number'
  }
  
  if (numQuantity < min) {
    return `Minimum quantity is ${min}`
  }
  
  if (numQuantity > max) {
    return `Maximum quantity is ${max}`
  }
  
  return null
}

export const validateWard = (ward) => {
  if (!ward) return 'Ward is required'
  
  const numWard = Number(ward)
  
  if (isNaN(numWard) || !Number.isInteger(numWard)) {
    return 'Invalid ward number'
  }
  
  if (numWard < 1 || numWard > 19) {
    return 'Ward must be between 1 and 19'
  }
  
  return null
}

export const validateAddress = (address) => {
  const errors = {}
  
  // 🛡 HARD GUARD
  if (!address || typeof address !== 'object') {
    return {
      ward: 'Invalid address data',
      area: 'Invalid address data',
      street: 'Invalid address data'
    }
  }
  
  if (
    address.ward === undefined ||
    address.ward === null ||
    address.ward === ''
  ) {
    errors.ward = 'Ward is required'
  } else {
    const wardError = validateWard(address.ward)
    if (wardError) errors.ward = wardError
  }
  
  if (!address.area || address.area.trim().length < 2) {
    errors.area = 'Area is required'
  }
  
  if (!address.street || address.street.trim().length < 2) {
    errors.street = 'Street address is required'
  }
  
  return Object.keys(errors).length > 0 ? errors : null
}

export const validateImageFile = (file) => {
  const { maxSize, allowedTypes } = VALIDATION_RULES.image || {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }
  
  if (!file) return 'File is required'
  
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed'
  }
  
  if (file.size > maxSize) {
    return `File size must not exceed ${maxSize / (1024 * 1024)}MB`
  }
  
  return null
}

export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) return null
  
  try {
    new URL(url)
    return null
  } catch {
    return `${fieldName} must be a valid URL`
  }
}

export const validateRequired = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || value === '' ||
    (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`
  }
  return null
}

export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value) return null
  
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  
  return null
}

export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (!value) return null
  
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`
  }
  
  return null
}

export const validateRange = (value, min, max, fieldName = 'Value') => {
  const numValue = Number(value)
  
  if (isNaN(numValue)) {
    return `${fieldName} must be a number`
  }
  
  if (numValue < min || numValue > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  
  return null
}

export const validateRating = (rating) => {
  const ratingError = validateRange(rating, 1, 5, 'Rating')
  if (ratingError) return ratingError
  
  if (!Number.isInteger(Number(rating))) {
    return 'Rating must be a whole number'
  }
  
  return null
}

export const validateProductForm = (product) => {
  const errors = {}
  
  const nameError = validateName(product.name, 'Product name')
  if (nameError) errors.name = nameError
  
  const priceError = validatePrice(product.price, 'Price')
  if (priceError) errors.price = priceError
  
  if (!product.category) {
    errors.category = 'Category is required'
  }
  
  if (!product.description || product.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }
  
  const stockError = validateQuantity(product.stock, 0, 100000)
  if (stockError) errors.stock = stockError
  
  if (!product.unit) {
    errors.unit = 'Unit is required'
  }
  
  return Object.keys(errors).length > 0 ? errors : null
}

export const validateOrderForm = (order) => {
  const errors = {}
  
  if (!order.items || order.items.length === 0) {
    errors.items = 'Cart is empty'
  }
  
  const addressErrors = validateAddress(order.deliveryAddress || {})
  if (addressErrors) {
    errors.address = addressErrors
  }
  
  if (!order.paymentMethod) {
    errors.paymentMethod = 'Payment method is required'
  }
  
  return Object.keys(errors).length > 0 ? errors : null
}