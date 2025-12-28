// src/utils/helpers.js

export const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  
  return `ZAL-${year}${month}${day}-${random}`
}

export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`
}

export const generateSKU = (category, name) => {
  const categoryCode = category.substring(0, 3).toUpperCase()
  const nameCode = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 5)
    .toUpperCase()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `${categoryCode}-${nameCode}-${random}`
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit = 500) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      document.body.removeChild(textArea)
      return false
    }
  }
}

export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

export const setQueryParams = (params) => {
  const searchParams = new URLSearchParams(window.location.search)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      searchParams.delete(key)
    } else {
      searchParams.set(key, value)
    }
  })
  
  const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
  window.history.pushState({}, '', newUrl)
}

export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({ top: 0, behavior })
}

export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const getDeviceType = () => {
  const width = window.innerWidth
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export const isMobile = () => {
  return getDeviceType() === 'mobile'
}

export const isTablet = () => {
  return getDeviceType() === 'tablet'
}

export const isDesktop = () => {
  return getDeviceType() === 'desktop'
}

export const getTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const getOS = () => {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  
  if (macosPlatforms.includes(platform)) return 'macos'
  if (iosPlatforms.includes(platform)) return 'ios'
  if (windowsPlatforms.includes(platform)) return 'windows'
  if (/Android/.test(userAgent)) return 'android'
  if (/Linux/.test(platform)) return 'linux'
  
  return 'unknown'
}

export const getBrowser = () => {
  const userAgent = navigator.userAgent
  
  if (userAgent.includes('Firefox')) return 'firefox'
  if (userAgent.includes('SamsungBrowser')) return 'samsung'
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'opera'
  if (userAgent.includes('Trident')) return 'ie'
  if (userAgent.includes('Edge')) return 'edge'
  if (userAgent.includes('Chrome')) return 'chrome'
  if (userAgent.includes('Safari')) return 'safari'
  
  return 'unknown'
}

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

export const unique = (array, key = null) => {
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
  }
  return [...new Set(array)]
}

export const chunk = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const shuffle = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomElement = (array) => {
  return array[random(0, array.length - 1)]
}

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const mergeDeep = (target, source) => {
  const output = { ...target }
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key]
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }
      } else {
        output[key] = source[key]
      }
    })
  }
  
  return output
}

export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export const wait = (condition, timeout = 5000, interval = 100) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = () => {
      if (condition()) {
        resolve(true)
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error('Timeout'))
      } else {
        setTimeout(check, interval)
      }
    }
    
    check()
  })
}

export const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      await sleep(delay * attempt)
    }
  }
}

/**
 * Backward-compatible slug formatter
 * Used by legacy ProductForm and others
 */
export const formatSlug = (value = '') => {
  if (!value || typeof value !== 'string') return ''

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')        // spaces to dashes
    .replace(/-+/g, '-')         // collapse multiple dashes
}