// src/pages/OrderSuccess.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrderById, getRecommendedProducts } from '@services/order.service'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import Confetti from '@components/animations/Confetti'
import { formatCurrency, formatOrderNumber, formatDateTime } from '@utils/formatters'
import { CheckCircle, Package, MapPin, Clock, ArrowRight, Share2, Plus } from 'lucide-react'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)
  const [countdown, setCountdown] = useState('')
  const [recommended, setRecommended] = useState([])

  // Fetch order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
        updateCountdown(orderData.estimatedDelivery)

        // Fetch recommended products
        const recs = await getRecommendedProducts(orderData.items.map(i => i.id))
        setRecommended(recs)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) fetchOrder()
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(confettiTimer)
  }, [orderId])

  // Countdown timer
  useEffect(() => {
    if (!order) return
    const interval = setInterval(() => updateCountdown(order.estimatedDelivery), 1000)
    return () => clearInterval(interval)
  }, [order])

  const updateCountdown = (eta) => {
    const now = new Date()
    const end = new Date(eta)
    const diff = end - now
    if (diff <= 0) {
      setCountdown('Arriving soon')
      return
    }
    const minutes = Math.floor(diff / 1000 / 60)
    const seconds = Math.floor((diff / 1000) % 60)
    setCountdown(`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')} mins`)
  }

  if (loading) return <LoadingScreen />

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Order not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  const handleShare = () => {
    const text = `
Order Confirmation: ${formatOrderNumber(order.orderNumber)}
Amount: ${formatCurrency(order.total)}
Items: ${order.items.map(i => `${i.name} x${i.qty}`).join(', ')}
Delivery: ${order.deliveryAddress.street}, ${order.deliveryAddress.area}, Ward ${order.deliveryAddress.ward}, Butwal
Track: ${window.location.origin}/track/${order.id}
    `
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Order details copied to clipboard!')
    }
  }

  const handleAddToCart = (product) => {
    // Add to cart logic (depends on your Cart context/service)
    console.log('Add to cart', product)
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 sm:pb-12">
      {showConfetti && <Confetti />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-8 sm:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-3"
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600 mb-8"
          >
            Thank you for your order. We'll deliver it shortly.
          </motion.p>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-primary-50 rounded-xl p-6 mb-8 text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Order Number</p>
                <p className="font-bold text-neutral-900 text-lg">
                  {formatOrderNumber(order.orderNumber)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Order Total</p>
                <p className="font-bold text-primary-600 text-lg">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 text-left">
                    <p className="text-neutral-900 font-semibold">{item.name}</p>
                    <p className="text-sm text-neutral-600">{item.qty} x {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            {/* ETA */}
            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl text-left">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 mb-1">Estimated Delivery</p>
                <p className="text-sm text-neutral-600">{formatDateTime(order.estimatedDelivery)}</p>
                <p className="text-sm text-primary-600 font-medium mt-1">{countdown}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl text-left">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 mb-1">Delivery Address</p>
                <p className="text-sm text-neutral-600">
                  {order.deliveryAddress.street}, {order.deliveryAddress.area}, Ward {order.deliveryAddress.ward}, Butwal
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(order.deliveryAddress.street + ',' + order.deliveryAddress.area)}`, '_blank')}
                >
                  View on Map
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate(`/track/${order.id}`)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="flex-1"
            >
              Track Order
            </Button>
            <Button
              variant="secondary"
              onClick={handleShare}
              leftIcon={<Share2 className="w-5 h-5" />}
              className="flex-1"
            >
              Share Order
            </Button>
          </motion.div>

          {/* Email & Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-sm text-neutral-600"
          >
            <p>
              You will receive a confirmation email at{' '}
              <span className="font-semibold">{order.customerEmail}</span>
            </p>
            <p className="mt-2">
              Need help?{' '}
              <button
                onClick={() => navigate('/contact')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Contact Support
              </button>
            </p>
          </motion.div>
        </motion.div>

        {/* Recommended / Reorder Carousel */}
        {recommended.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">You Might Also Like</h2>
            <div className="flex overflow-x-auto gap-4 pb-2">
              {recommended.map(product => (
                <div key={product.id} className="min-w-[140px] bg-white rounded-xl p-2 shadow-sm flex-shrink-0 flex flex-col items-center">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded mb-2" />
                  <p className="text-sm font-semibold text-neutral-900 text-center">{product.name}</p>
                  <p className="text-sm text-primary-600">{formatCurrency(product.price)}</p>
                  <Button size="sm" className="mt-2 w-full flex items-center justify-center gap-1" onClick={() => handleAddToCart(product)}>
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Mobile Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-3 shadow-top sm:hidden flex gap-2">
        <Button onClick={() => navigate(`/track/${order.id}`)} className="flex-1">
          Track Order
        </Button>
        <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}