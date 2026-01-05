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



// New CATEGORIES 

export const CATEGORIES = [
  // Grocery & Kitchen
  { id: 'vegetables-fruits', name: 'Vegetables & Fruits', icon: 'Carrot', color: '#10B981', parent: 'grocery-kitchen' },
  { id: 'atta-rice-dal', name: 'Atta, Rice & Dal', icon: 'Wheat', color: '#F59E0B', parent: 'grocery-kitchen' },
  { id: 'oil-ghee-masala', name: 'Oil, Ghee & Masala', icon: 'Droplet', color: '#F97316', parent: 'grocery-kitchen' },
  { id: 'dairy-bread-eggs', name: 'Dairy, Bread & Eggs', icon: 'Milk', color: '#3B82F6', parent: 'grocery-kitchen' },
  { id: 'bakery-biscuits', name: 'Bakery & Biscuits', icon: 'Cookie', color: '#EC4899', parent: 'grocery-kitchen' },
  { id: 'dry-fruits-cereals', name: 'Dry Fruits & Cereals', icon: 'Apple', color: '#8B5CF6', parent: 'grocery-kitchen' },
  { id: 'chicken-meat-fish', name: 'Chicken, Meat & Fish', icon: 'Fish', color: '#EF4444', parent: 'grocery-kitchen' },
  { id: 'kitchenware-appliances', name: 'Kitchenware & Appliances', icon: 'UtensilsCrossed', color: '#6B7280', parent: 'grocery-kitchen' },
  
  // Snacks & Drinks
  { id: 'chips-namkeen', name: 'Chips & Namkeen', icon: 'Package', color: '#F59E0B', parent: 'snacks-drinks' },
  { id: 'sweets-chocolates', name: 'Sweets & Chocolates', icon: 'Candy', color: '#EC4899', parent: 'snacks-drinks' },
  { id: 'drinks-juices', name: 'Drinks & Juices', icon: 'GlassWater', color: '#3B82F6', parent: 'snacks-drinks' },
  { id: 'tea-coffee-milk', name: 'Tea, Coffee & Milk Drinks', icon: 'Coffee', color: '#78350F', parent: 'snacks-drinks' },
  { id: 'instant-food', name: 'Instant Food', icon: 'Utensils', color: '#F97316', parent: 'snacks-drinks' },
  { id: 'sauces-spreads', name: 'Sauces & Spreads', icon: 'Cherry', color: '#DC2626', parent: 'snacks-drinks' },
  { id: 'paan-corner', name: 'Paan Corner', icon: 'Leaf', color: '#059669', parent: 'snacks-drinks' },
  { id: 'ice-creams-more', name: 'Ice Creams & More', icon: 'IceCream', color: '#06B6D4', parent: 'snacks-drinks' },
  
  // Beauty & Personal Care
  { id: 'bath-body', name: 'Bath & Body', icon: 'Droplets', color: '#3B82F6', parent: 'beauty-personal-care' },
  { id: 'hair-care', name: 'Hair', icon: 'Sparkles', color: '#8B5CF6', parent: 'beauty-personal-care' },
  { id: 'skin-face', name: 'Skin & Face', icon: 'Heart', color: '#EC4899', parent: 'beauty-personal-care' },
  { id: 'beauty-cosmetics', name: 'Beauty & Cosmetics', icon: 'Palette', color: '#F43F5E', parent: 'beauty-personal-care' },
  { id: 'feminine-hygiene', name: 'Feminine Hygiene', icon: 'Shield', color: '#DB2777', parent: 'beauty-personal-care' },
  { id: 'baby-care', name: 'Baby Care', icon: 'Baby', color: '#06B6D4', parent: 'beauty-personal-care' },
  { id: 'health-pharma', name: 'Health & Pharma', icon: 'Plus', color: '#DC2626', parent: 'beauty-personal-care' },
  { id: 'sexual-wellness', name: 'Sexual Wellness', icon: 'Heart', color: '#BE123C', parent: 'beauty-personal-care' },
  
  // Household Essentials
  { id: 'home-lifestyle', name: 'Home & Lifestyle', icon: 'Home', color: '#6B7280', parent: 'household-essentials' },
  { id: 'cleaners-repellents', name: 'Cleaners & Repellents', icon: 'Spray', color: '#10B981', parent: 'household-essentials' },
  { id: 'electronics', name: 'Electronics', icon: 'Zap', color: '#3B82F6', parent: 'household-essentials' },
  { id: 'stationery-games', name: 'Stationery & Games', icon: 'Pencil', color: '#F59E0B', parent: 'household-essentials' },
  
  // Shop by Store
  { id: 'spiritual-store', name: 'Spiritual Store', icon: 'Flame', color: '#F97316', parent: 'shop-by-store' },
  { id: 'pharma-store', name: 'Pharma Store', icon: 'Pill', color: '#DC2626', parent: 'shop-by-store' },
  { id: 'egifts-store', name: 'E-Gifts', icon: 'Gift', color: '#EC4899', parent: 'shop-by-store' },
  { id: 'pet-store', name: 'Pet Store', icon: 'Dog', color: '#F59E0B', parent: 'shop-by-store' },
  { id: 'sports-store', name: 'Sports', icon: 'Dumbbell', color: '#10B981', parent: 'shop-by-store' },
  { id: 'fashion-basics', name: 'Fashion Basics Store', icon: 'Shirt', color: '#8B5CF6', parent: 'shop-by-store' },
  { id: 'toy-store', name: 'Toy Store', icon: 'Gamepad2', color: '#F43F5E', parent: 'shop-by-store' },
  { id: 'book-store', name: 'Book Store', icon: 'BookOpen', color: '#6366F1', parent: 'shop-by-store' }
];

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