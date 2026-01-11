// src/pages/OrderTracking.jsx (REFACTORED - REAL-TIME)

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Package, ArrowLeft, MapPin, Phone, MessageCircle, Clock, Truck } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import OrderTimeline from '@/components/customer/OrderTimeline'
import TrackingMap from '@/components/customer/TrackingMap'
import LoadingScreen from '@/components/shared/LoadingScreen'
import EmptyState from '@/components/shared/EmptyState'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDateTime, formatTimeRemaining } from '@/utils/formatters'
import { ORDER_STATUS_LABELS, CONTACT } from '@/utils/constants'

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState('')
  
  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true })
      return
    }
    
    const orderRef = doc(db, 'orders', orderId)
    const unsubscribe = onSnapshot(
      orderRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          setOrder({
            id: snapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            estimatedDelivery: data.estimatedDelivery?.toDate?.() || null,
            actualDelivery: data.actualDelivery?.toDate?.() || null
          })
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching order:', error)
        setLoading(false)
      }
    )
    
    return () => unsubscribe()
  }, [orderId, navigate])
  
  useEffect(() => {
    if (!order?.estimatedDelivery) return
    
    const updateTimer = () => {
      if (order.status === 'delivered') {
        setTimeRemaining('Delivered')
      } else {
        setTimeRemaining(formatTimeRemaining(order.estimatedDelivery))
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 30000)
    return () => clearInterval(interval)
  }, [order])
  
  const getStatusColor = (status) => {
    if (status === 'delivered') return 'success'
    if (status === 'cancelled') return 'error'
    return 'info'
  }
  
  if (loading) return <LoadingScreen />
  
  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-50 py-24 px-4">
          <div className="max-w-xl mx-auto">
            <EmptyState
              icon={Package}
              title="Order Not Found"
              description="We couldn't find this order"
              action={{ label: 'Go to Orders', onClick: () => navigate('/customer/orders') }}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-8">
            <button
              onClick={() => navigate('/customer/orders')}
              className="flex items-center gap-2 text-neutral-600 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
            >
              <ArrowLeft size={18} /> Back to Orders
            </button>
            <h1 className="text-3xl font-black text-neutral-900">Track Your Order</h1>
            <p className="text-neutral-600 mt-1">Real-time delivery updates</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-neutral-100 p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                    <p className="font-black text-2xl text-neutral-900">#{order.orderNumber}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status)} size="lg">
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-neutral-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 font-bold">Est. Delivery</p>
                      <p className="font-black text-neutral-900">{timeRemaining}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 font-bold">Items</p>
                      <p className="font-black text-neutral-900">{order.items?.length || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 font-bold">Total</p>
                      <p className="font-black text-orange-600">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-neutral-100 p-8"
              >
                <h2 className="text-xl font-black text-neutral-900 mb-6">Order Progress</h2>
                <OrderTimeline order={order} />
              </motion.div>

              {order.deliveryAddress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-neutral-100 p-8"
                >
                  <h2 className="text-xl font-black text-neutral-900 mb-6">Delivery Location</h2>
                  <TrackingMap order={order} />
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl border border-neutral-100 p-6 sticky top-24"
              >
                <h3 className="text-lg font-black text-neutral-900 mb-4">Delivery Address</h3>
                <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl mb-6">
                  <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-neutral-900 font-medium">{order.deliveryAddress.street}</p>
                    <p className="text-neutral-600 text-sm">{order.deliveryAddress.area}</p>
                    <p className="text-neutral-600 text-sm">Ward {order.deliveryAddress.ward}, Butwal</p>
                    {order.deliveryAddress.landmark && (
                      <p className="text-neutral-500 text-sm mt-1">Near {order.deliveryAddress.landmark}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-black text-neutral-900">Need Help?</h3>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => window.open(`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`, '_blank')}
                  >
                    <MessageCircle size={18} className="mr-2" /> WhatsApp Support
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => window.location.href = `tel:${CONTACT.phone}`}
                  >
                    <Phone size={18} className="mr-2" /> Call Support
                  </Button>
                </div>

                {order.notes && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-bold text-blue-900 mb-1">Delivery Notes</p>
                    <p className="text-sm text-blue-700">{order.notes}</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}