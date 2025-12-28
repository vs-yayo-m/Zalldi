// src/config/routes.js

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success/:orderId',
  ORDER_TRACKING: '/track/:orderId',
  SEARCH: '/search',
  CATEGORY: '/category/:categoryId',
  
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_ORDER_DETAIL: '/customer/orders/:orderId',
  CUSTOMER_ADDRESSES: '/customer/addresses',
  CUSTOMER_WISHLIST: '/customer/wishlist',
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_SETTINGS: '/customer/settings',
  CUSTOMER_SUPPORT: '/customer/support',
  
  SUPPLIER_DASHBOARD: '/supplier/dashboard',
  SUPPLIER_PRODUCTS: '/supplier/products',
  SUPPLIER_ADD_PRODUCT: '/supplier/products/add',
  SUPPLIER_EDIT_PRODUCT: '/supplier/products/edit/:productId',
  SUPPLIER_ORDERS: '/supplier/orders',
  SUPPLIER_ORDER_DETAIL: '/supplier/orders/:orderId',
  SUPPLIER_INVENTORY: '/supplier/inventory',
  SUPPLIER_ANALYTICS: '/supplier/analytics',
  SUPPLIER_REVIEWS: '/supplier/reviews',
  SUPPLIER_SETTINGS: '/supplier/settings',
  
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: '/admin/orders/:orderId',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_DETAIL: '/admin/products/:productId',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CUSTOMER_DETAIL: '/admin/customers/:customerId',
  ADMIN_SUPPLIERS: '/admin/suppliers',
  ADMIN_SUPPLIER_DETAIL: '/admin/suppliers/:supplierId',
  ADMIN_FINANCIAL: '/admin/financial',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_MARKETING: '/admin/marketing',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_REPORTS: '/admin/reports',
  
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-conditions',
  REFUND: '/refund-policy',
  FAQ: '/faq',
  HOW_IT_WORKS: '/how-it-works'
}

export const getRoute = (routeName, params = {}) => {
  let route = ROUTES[routeName]
  
  if (!route) {
    console.error(`Route ${routeName} not found`)
    return '/'
  }
  
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value)
  })
  
  return route
}

export const isPublicRoute = (pathname) => {
  const publicRoutes = [
    ROUTES.HOME,
    ROUTES.SHOP,
    ROUTES.SEARCH,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.PRIVACY,
    ROUTES.TERMS,
    ROUTES.REFUND,
    ROUTES.FAQ,
    ROUTES.HOW_IT_WORKS
  ]
  
  return publicRoutes.some(route => {
    const pattern = route.replace(/:[^/]+/g, '[^/]+')
    return new RegExp(`^${pattern}$`).test(pathname)
  }) || pathname.startsWith('/product/') || pathname.startsWith('/category/')
}

export const isAuthRoute = (pathname) => {
  const authRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.VERIFY_EMAIL
  ]
  
  return authRoutes.includes(pathname)
}

export const isCustomerRoute = (pathname) => {
  return pathname.startsWith('/customer/')
}

export const isSupplierRoute = (pathname) => {
  return pathname.startsWith('/supplier/')
}

export const isAdminRoute = (pathname) => {
  return pathname.startsWith('/admin/')
}

export const getDefaultRouteForRole = (role) => {
  const roleRoutes = {
    customer: ROUTES.CUSTOMER_DASHBOARD,
    supplier: ROUTES.SUPPLIER_DASHBOARD,
    admin: ROUTES.ADMIN_DASHBOARD
  }
  
  return roleRoutes[role] || ROUTES.HOME
}