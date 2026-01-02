// src/App.jsx

import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@contexts/AuthContext'
import { CartProvider } from '@contexts/CartContext'
import { WishlistProvider } from '@contexts/WishlistContext'
import { ThemeProvider } from '@contexts/ThemeContext'
import { NotificationProvider } from '@contexts/NotificationContext'
import { SearchProvider } from '@contexts/SearchContext'
import ErrorBoundary from '@components/shared/ErrorBoundary'
import LoadingScreen from '@components/shared/LoadingScreen'
import ProtectedRoute from '@components/shared/ProtectedRoute'
import ScrollToTop from '@components/layout/ScrollToTop'
import { ROUTES } from '@utils/constants'

const Home = lazy(() => import('@pages/Home'))
const Shop = lazy(() => import('@pages/Shop'))
const ProductDetail = lazy(() => import('@pages/ProductDetail'))
const Category = lazy(() => import('@pages/Category'))
const Search = lazy(() => import('@pages/Search'))
const Cart = lazy(() => import('@pages/Cart'))
const Checkout = lazy(() => import('@pages/Checkout'))
const OrderSuccess = lazy(() => import('@pages/OrderSuccess'))
const OrderTracking = lazy(() => import('@pages/OrderTracking'))

const Login = lazy(() => import('@pages/auth/Login'))
const Register = lazy(() => import('@pages/auth/Register'))
const ForgotPassword = lazy(() => import('@pages/auth/ForgotPassword'))

const CustomerDashboard = lazy(() => import('@pages/customer/Dashboard'))
const CustomerOrders = lazy(() => import('@pages/customer/Orders'))
const CustomerOrderDetail = lazy(() => import('@pages/customer/OrderDetail'))
const CustomerAddresses = lazy(() => import('@pages/customer/Addresses'))
const CustomerWishlist = lazy(() => import('@pages/customer/Wishlist'))
const CustomerProfile = lazy(() => import('@pages/customer/Profile'))
const CustomerSettings = lazy(() => import('@pages/customer/Settings'))

const SupplierDashboard = lazy(() => import('@pages/supplier/Dashboard'))
const SupplierProducts = lazy(() => import('@pages/supplier/Products'))
const SupplierAddProduct = lazy(() => import('@pages/supplier/AddProduct'))
const SupplierEditProduct = lazy(() => import('@pages/supplier/EditProduct'))
const SupplierOrders = lazy(() => import('@pages/supplier/Orders'))
const SupplierOrderDetail = lazy(() => import('@pages/supplier/OrderDetail'))
const SupplierInventory = lazy(() => import('@pages/supplier/Inventory'))
const SupplierAnalytics = lazy(() => import('@pages/supplier/Analytics'))

const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'))
const AdminOrders = lazy(() => import('@pages/admin/Orders'))
const AdminOrderDetail = lazy(() => import('@pages/admin/OrderDetail'))
const AdminProducts = lazy(() => import('@pages/admin/Products'))
const AdminCustomers = lazy(() => import('@pages/admin/Customers'))
const AdminSuppliers = lazy(() => import('@pages/admin/Suppliers'))
const AdminFinancial = lazy(() => import('@pages/admin/Financial'))
const AdminAnalytics = lazy(() => import('@pages/admin/Analytics'))
const AdminMarketing = lazy(() => import('@pages/admin/Marketing'))
const AdminSettings = lazy(() => import('@pages/admin/Settings'))

const About = lazy(() => import('@pages/static/About'))
const Contact = lazy(() => import('@pages/static/Contact'))
const PrivacyPolicy = lazy(() => import('@pages/static/PrivacyPolicy'))
const TermsConditions = lazy(() => import('@pages/static/TermsConditions'))
const FAQ = lazy(() => import('@pages/static/FAQ'))

const NotFound = lazy(() => import('@components/shared/NotFound'))

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <SearchProvider>
                    <ScrollToTop />
                    <Suspense fallback={<LoadingScreen />}>
                      <Routes>
                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path={ROUTES.SHOP} element={<Shop />} />
                        <Route path="/product/:slug" element={<ProductDetail />} />
                        <Route path="/category/:categoryId" element={<Category />} />
                        <Route path={ROUTES.SEARCH} element={<Search />} />
                        <Route path={ROUTES.CART} element={<Cart />} />
                        
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.REGISTER} element={<Register />} />
                        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

                        <Route path={ROUTES.CHECKOUT} element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        } />
                        <Route path="/order-success/:orderId" element={
                          <ProtectedRoute>
                            <OrderSuccess />
                          </ProtectedRoute>
                        } />
                        <Route path="/track/:orderId" element={<OrderTracking />} />

                        <Route path={ROUTES.CUSTOMER_DASHBOARD} element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.CUSTOMER_ORDERS} element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerOrders />
                          </ProtectedRoute>
                        } />
                        <Route path="/customer/orders/:orderId" element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerOrderDetail />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.CUSTOMER_ADDRESSES} element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerAddresses />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.CUSTOMER_WISHLIST} element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerWishlist />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.CUSTOMER_PROFILE} element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerProfile />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.CUSTOMER_SETTINGS} element={
                          <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerSettings />
                          </ProtectedRoute>
                        } />

                        <Route path={ROUTES.SUPPLIER_DASHBOARD} element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.SUPPLIER_PRODUCTS} element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierProducts />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.SUPPLIER_ADD_PRODUCT} element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierAddProduct />
                          </ProtectedRoute>
                        } />
                        <Route path="/supplier/products/edit/:productId" element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierEditProduct />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.SUPPLIER_ORDERS} element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierOrders />
                          </ProtectedRoute>
                        } />
                        <Route path="/supplier/orders/:orderId" element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierOrderDetail />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.SUPPLIER_INVENTORY} element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierInventory />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.SUPPLIER_ANALYTICS} element={
                          <ProtectedRoute allowedRoles={['supplier']}>
                            <SupplierAnalytics />
                          </ProtectedRoute>
                        } />

                        <Route path={ROUTES.ADMIN_DASHBOARD} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_ORDERS} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminOrders />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/orders/:orderId" element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminOrderDetail />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_PRODUCTS} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminProducts />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_CUSTOMERS} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminCustomers />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_SUPPLIERS} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminSuppliers />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_FINANCIAL} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminFinancial />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_ANALYTICS} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminAnalytics />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_MARKETING} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminMarketing />
                          </ProtectedRoute>
                        } />
                        <Route path={ROUTES.ADMIN_SETTINGS} element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminSettings />
                          </ProtectedRoute>
                        } />

                        <Route path={ROUTES.ABOUT} element={<About />} />
                        <Route path={ROUTES.CONTACT} element={<Contact />} />
                        <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
                        <Route path={ROUTES.TERMS} element={<TermsConditions />} />
                        <Route path={ROUTES.FAQ} element={<FAQ />} />

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>

                    <Toaster
                      position="top-center"
                      toastOptions={{
                        duration: 3000,
                        style: {
                          background: '#fff',
                          color: '#2D2D2D',
                          borderRadius: '12px',
                          padding: '16px',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        },
                        success: {
                          iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff'
                          }
                        },
                        error: {
                          iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff'
                          }
                        }
                      }}
                    />
                  </SearchProvider>
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}