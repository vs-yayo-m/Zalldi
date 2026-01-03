import { USER_ROLES, ROUTES } from './constants'

export const getDashboardRoute = (userRole) => {
  const dashboardMap = {
    [USER_ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
    [USER_ROLES.SUPPLIER]: ROUTES.SUPPLIER_DASHBOARD,
    [USER_ROLES.CUSTOMER]: ROUTES.CUSTOMER_DASHBOARD
  }
  
  return dashboardMap[userRole] || ROUTES.HOME
}

export const getDefaultRoute = (userRole) => {
  // After login, where should user go?
  return getDashboardRoute(userRole)
}

export const getProfileRoute = (userRole) => {
  const profileMap = {
    [USER_ROLES.ADMIN]: ROUTES.ADMIN_SETTINGS,
    [USER_ROLES.SUPPLIER]: ROUTES.SUPPLIER_SETTINGS,
    [USER_ROLES.CUSTOMER]: ROUTES.CUSTOMER_PROFILE
  }
  
  return profileMap[userRole] || ROUTES.HOME
}

export const getOrdersRoute = (userRole) => {
  const ordersMap = {
    [USER_ROLES.ADMIN]: ROUTES.ADMIN_ORDERS,
    [USER_ROLES.SUPPLIER]: ROUTES.SUPPLIER_ORDERS,
    [USER_ROLES.CUSTOMER]: ROUTES.CUSTOMER_ORDERS
  }
  
  return ordersMap[userRole] || ROUTES.HOME
}

export const canAccessPublicShop = (userRole) => {
  // All roles can browse, but suppliers/admins might have different views
  return true
}

export const getNavigationItems = (userRole) => {
  const baseItems = [
    { label: 'Home', path: ROUTES.HOME, icon: 'Home' }
  ]
  
  if (userRole === USER_ROLES.CUSTOMER) {
    return [
      ...baseItems,
      { label: 'Shop', path: ROUTES.SHOP, icon: 'ShoppingBag' },
      { label: 'Categories', path: ROUTES.CATEGORIES, icon: 'Grid' },
      { label: 'My Orders', path: ROUTES.CUSTOMER_ORDERS, icon: 'Package' },
      { label: 'Wishlist', path: ROUTES.CUSTOMER_WISHLIST, icon: 'Heart' }
    ]
  }
  
  if (userRole === USER_ROLES.SUPPLIER) {
    return [
      ...baseItems,
      { label: 'Dashboard', path: ROUTES.SUPPLIER_DASHBOARD, icon: 'LayoutDashboard' },
      { label: 'Products', path: ROUTES.SUPPLIER_PRODUCTS, icon: 'Package' },
      { label: 'Orders', path: ROUTES.SUPPLIER_ORDERS, icon: 'ShoppingCart' },
      { label: 'Inventory', path: ROUTES.SUPPLIER_INVENTORY, icon: 'Database' },
      { label: 'Analytics', path: ROUTES.SUPPLIER_ANALYTICS, icon: 'BarChart3' }
    ]
  }
  
  if (userRole === USER_ROLES.ADMIN) {
    return [
      ...baseItems,
      { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'LayoutDashboard' },
      { label: 'Orders', path: ROUTES.ADMIN_ORDERS, icon: 'ShoppingCart' },
      { label: 'Products', path: ROUTES.ADMIN_PRODUCTS, icon: 'Package' },
      { label: 'Customers', path: ROUTES.ADMIN_CUSTOMERS, icon: 'Users' },
      { label: 'Suppliers', path: ROUTES.ADMIN_SUPPLIERS, icon: 'Store' },
      { label: 'Analytics', path: ROUTES.ADMIN_ANALYTICS, icon: 'TrendingUp' }
    ]
  }
  
  return baseItems
}