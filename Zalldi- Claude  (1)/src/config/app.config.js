// src/config/app.config.js

export const appConfig = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Zalldi',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    url: import.meta.env.VITE_APP_URL || 'https://zalldi.com.np',
    environment: import.meta.env.MODE || 'production'
  },
  
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.zalldi.com.np',
    timeout: 30000
  },
  
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableErrorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
    enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true'
  },
  
  contact: {
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support.zalldi@gmail.com',
    businessEmail: import.meta.env.VITE_BUSINESS_EMAIL || 'zalldi.vishalsharma@gmail.com',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+9779821072912'
  },
  
  social: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/zalldi.com.np',
    founderInstagram: import.meta.env.VITE_FOUNDER_INSTAGRAM_URL || 'https://www.instagram.com/sharma_vishal_o',
    tiktok: '',
    youtube: '',
    facebook: ''
  },
  
  business: {
    location: 'Butwal, Nepal',
    wards: 19,
    operatingHours: {
      open: '06:00',
      close: '23:00',
      timezone: 'Asia/Kathmandu'
    },
    deliveryTime: {
      standard: 60,
      express: 30
    },
    deliveryFee: {
      standard: 50,
      express: 100,
      freeThreshold: 0
    }
  },
  
  limits: {
    maxCartItems: 100,
    minOrderValue: 0,
    maxOrderValue: 100000,
    maxImageSize: 5 * 1024 * 1024,
    maxImagesPerProduct: 5,
    itemsPerPage: 20,
    maxSearchResults: 50
  },
  
  cache: {
    productsCacheDuration: 5 * 60 * 1000,
    categoriesCacheDuration: 10 * 60 * 1000,
    userCacheDuration: 2 * 60 * 1000
  },
  
  validation: {
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true
    },
    phone: {
      pattern: /^(\+977)?[9][6-9]\d{8}$/,
      length: 10
    }
  },
  
  ui: {
    toastDuration: 3000,
    debounceDelay: 300,
    throttleDelay: 500,
    animationDuration: 300
  },
  
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}