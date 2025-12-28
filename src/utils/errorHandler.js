// src/utils/errorHandler.js

import toast from 'react-hot-toast'

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
  }
}

export const errorHandler = {
  handle(error, showToast = true) {
    const errorInfo = this.parse(error)
    
    if (showToast) {
      this.showErrorToast(errorInfo.message)
    }
    
    this.log(errorInfo)
    
    return errorInfo
  },
  
  parse(error) {
    if (error instanceof AppError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      }
    }
    
    if (error?.code) {
      return this.parseFirebaseError(error)
    }
    
    if (error?.response) {
      return this.parseAPIError(error)
    }
    
    return {
      message: error?.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    }
  },
  
  parseFirebaseError(error) {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/operation-not-allowed': 'This operation is not allowed',
      'auth/invalid-credential': 'Invalid credentials provided',
      'permission-denied': 'You do not have permission to perform this action',
      'not-found': 'The requested resource was not found',
      'already-exists': 'This resource already exists',
      'failed-precondition': 'Operation failed. Please try again',
      'aborted': 'Operation was aborted',
      'unavailable': 'Service is currently unavailable'
    }
    
    return {
      message: errorMessages[error.code] || error.message || 'An error occurred',
      code: error.code,
      statusCode: 400
    }
  },
  
  parseAPIError(error) {
    const status = error.response?.status || 500
    const message = error.response?.data?.message || error.message
    
    return {
      message,
      code: `API_ERROR_${status}`,
      statusCode: status
    }
  },
  
  showErrorToast(message) {
    toast.error(message, {
      duration: 4000,
      position: 'top-center'
    })
  },
  
  log(errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Error:', errorInfo)
    }
  },
  
  getErrorMessage(error) {
    return this.parse(error).message
  },
  
  isNetworkError(error) {
    return error?.code === 'auth/network-request-failed' ||
      error?.message?.includes('network') ||
      error?.message?.includes('fetch')
  },
  
  isAuthError(error) {
    return error?.code?.startsWith('auth/')
  },
  
  isPermissionError(error) {
    return error?.code === 'permission-denied'
  }
}

export function handleAsyncError(promise, showToast = true) {
  return promise
    .then(data => [data, null])
    .catch(error => {
      const errorInfo = errorHandler.handle(error, showToast)
      return [null, errorInfo]
    })
}

export function withErrorHandling(fn, showToast = true) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      errorHandler.handle(error, showToast)
      throw error
    }
  }
}