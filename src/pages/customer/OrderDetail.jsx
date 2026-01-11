// src/pages/customer/OrderDetail.jsx (REFACTORED - ENTERPRISE)

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ArrowLeft, MapPin, Phone, MessageCircle, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import OrderTimeline from '@/components/customer/OrderTimeline'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { ORDER_STATUS_LABELS, CONTACT } from '@/utils/constants'

export default function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { getOrderById } = useOrders()
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/orders', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return
      
      try {
        setLoading(true)
        const data = await getOrderById(orderId)
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchOrder()
    }
  }, [orderId, user, getOrderById])
  
  const getStatusColor = (status) => {
    if (status === 'delivered') return 'bg-green-100 text-green-700'
    if (status === 'cancelled') return 'bg-red-100 text-red-700'
    return 'bg-orange-100 text-orange-700'
  }
  
  if (authLoading || loading) return <LoadingScreen />
  if (!user) return null
  
  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-50 py-24 px-4">
          <div className="max-w-xl mx-auto">
            <EmptyState
              icon={Package}
              title="Order Not Found"
              description="The order you're looking for doesn't exist"
              action={{ label: 'Back to Orders', onClick: () => navigate('/customer/orders') }}
            />
          </div>
        </div>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 pb-24 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-8">
            <button
              onClick={() => navigate('/customer/orders')}
              className="flex items-center gap-2 text-neutral-600 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
            >
              <ArrowLeft size={18} /> Back to Orders
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-neutral-900">
                Order #{order.orderNumber}
              </h1>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-neutral-600 text-sm">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {formatDateTime(order.createdAt)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl border border-neutral-100 p-8">
                <h3 className="text-xl font-black text-neutral-900 mb-6">Order Timeline</h3>
                <OrderTimeline order={order} />
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 p-8">
                <h3 className="text-xl font-black text-neutral-900 mb-6">Order Items</h3>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="text-neutral-400" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900">{item.name}</h4>
                        <p className="text-sm text-neutral-600">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-black text-neutral-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <div className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">
                  <MapPin size={14} className="text-orange-500" /> Delivery Address
                </div>
                <p className="font-black text-neutral-900 mb-2">{user.displayName}</p>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {order.deliveryAddress?.street}<br />
                  {order.deliveryAddress?.area}, Ward {order.deliveryAddress?.ward}<br />
                  Butwal, Nepal
                </p>
                {order.deliveryAddress?.landmark && (
                  <p className="text-neutral-500 text-sm mt-2">
                    Near {order.deliveryAddress.landmark}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h4 className="font-black text-neutral-900 mb-4">Bill Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery</span>
                    <span>{order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-neutral-100 flex justify-between font-black text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h4 className="font-black text-neutral-900 mb-4">Need Help?</h4>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => window.open(`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`, '_blank')}
                  >
                    <MessageCircle size={18} className="mr-2" /> WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => window.location.href = `tel:${CONTACT.phone}`}
                  >
                    <Phone size={18} className="mr-2" /> Call Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}