// src/utils/constants.js  

export const APP_NAME = 'Zalldi'
export const APP_TAGLINE = 'Order now, delivered in 1 hour'
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://zalldi.com.np'

export const CONTACT = {
  support: import.meta.env.VITE_SUPPORT_EMAIL || 'support.zalldi@gmail.com',
  business: import.meta.env.VITE_BUSINESS_EMAIL || 'zalldi.vishalsharma@gmail.com',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '+9779821072912',
  phone: '+9779821072912'
}

export const SOCIAL_MEDIA = {
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/zalldi.com.np',
  founderInstagram: import.meta.env.VITE_FOUNDER_INSTAGRAM_URL || 'https://www.instagram.com/sharma_vishal_o',
  tiktok: '',
  youtube: '',
  facebook: ''
}

export const FOUNDER = {
  name: 'Vishal Sharma',
  email: 'zalldi.vishalsharma@gmail.com',
  instagram: 'https://www.instagram.com/sharma_vishal_o',
  message: 'At Zalldi, we\'re revolutionizing the way Butwal shops. Our mission is to deliver everything you need within an hour, combining cutting-edge technology with local expertise to create an unmatched shopping experience.'
}

export const BUSINESS_HOURS = {
  open: '6:00 AM',
  close: '11:00 PM',
  timezone: 'Asia/Kathmandu'
}

export const DELIVERY = {
  freeThreshold: 0,
  standardFee: 50,
  expressFeee: 100,
  standardTime: 60,
  expressTime: 30,
  coverage: 'All 19 wards of Butwal'
}

export const WARDS = Array.from({ length: 19 }, (_, i) => ({
  value: i + 1,
  label: `Ward ${i + 1}`
}))

export const CATEGORIES = [
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingBasket', color: '#10B981' },
  { id: 'vegetables', name: 'Vegetables', icon: 'Carrot', color: '#059669' },
  { id: 'fruits', name: 'Fruits', icon: 'Apple', color: '#F59E0B' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: 'Milk', color: '#3B82F6' },
  { id: 'meat', name: 'Meat & Fish', icon: 'Fish', color: '#EF4444' },
  { id: 'bakery', name: 'Bakery', icon: 'Croissant', color: '#F97316' },
  { id: 'beverages', name: 'Beverages', icon: 'Coffee', color: '#8B5CF6' },
  { id: 'snacks', name: 'Snacks', icon: 'Cookie', color: '#EC4899' },
  { id: 'household', name: 'Household', icon: 'Home', color: '#6366F1' },
  { id: 'personal-care', name: 'Personal Care', icon: 'Sparkles', color: '#14B8A6' },
  { id: 'baby', name: 'Baby Care', icon: 'Baby', color: '#F472B6' },
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', color: '#6B7280' }
]

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PICKING: 'picking',
  PACKING: 'packing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Order Placed',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PICKING]: 'Picking Items',
  [ORDER_STATUS.PACKING]: 'Packing',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled'
}

export const PAYMENT_METHODS = {
  COD: 'cod',
  ESEWA: 'esewa',
  KHALTI: 'khalti'
}

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: 'Cash on Delivery',
  [PAYMENT_METHODS.ESEWA]: 'eSewa',
  [PAYMENT_METHODS.KHALTI]: 'Khalti'
}

export const USER_ROLES = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  ADMIN: 'admin'
}

export const MAX_CART_ITEMS = 100
export const MIN_ORDER_VALUE = 0
export const MAX_ORDER_VALUE = 100000

export const PRODUCT_UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'l', label: 'Liter (L)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'pc', label: 'Piece (pc)' },
  { value: 'pack', label: 'Pack' },
  { value: 'dozen', label: 'Dozen' }
]

export const ADDRESS_TYPES = [
  { value: 'home', label: 'Home', icon: 'Home' },
  { value: 'work', label: 'Work', icon: 'Briefcase' },
  { value: 'other', label: 'Other', icon: 'MapPin' }
]

export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
}

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100
}

export const IMAGE_UPLOAD = {
  maxSize: 5 * 1024 * 1024,
  maxFiles: 5,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
}

export const VALIDATION_RULES = {
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
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
}

export const TOAST_DURATION = 3000
export const DEBOUNCE_DELAY = 300
export const THROTTLE_DELAY = 500

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success/:orderId',
  ORDER_TRACKING: '/track/:orderId',
  SEARCH: '/search',
  
  CATEGORIES: '/categories',
  CATEGORY: '/category/:categoryId',
  
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_ORDER_DETAIL: '/customer/orders/:orderId',
  CUSTOMER_ADDRESSES: '/customer/addresses',
  CUSTOMER_WISHLIST: '/customer/wishlist',
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_SETTINGS: '/customer/settings',
  
  SUPPLIER_DASHBOARD: '/supplier/dashboard',
  SUPPLIER_PRODUCTS: '/supplier/products',
  SUPPLIER_ADD_PRODUCT: '/supplier/products/add',
  SUPPLIER_EDIT_PRODUCT: '/supplier/products/edit/:productId',
  SUPPLIER_ORDERS: '/supplier/orders',
  SUPPLIER_ORDER_DETAIL: '/supplier/orders/:orderId',
  SUPPLIER_INVENTORY: '/supplier/inventory',
  SUPPLIER_ANALYTICS: '/supplier/analytics',
  
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SUPPLIERS: '/admin/suppliers',
  ADMIN_FINANCIAL: '/admin/financial',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_MARKETING: '/admin/marketing',
  ADMIN_SETTINGS: '/admin/settings',
  
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-conditions',
  REFUND: '/refund-policy',
  FAQ: '/faq',
  HOW_IT_WORKS: '/how-it-works'
}