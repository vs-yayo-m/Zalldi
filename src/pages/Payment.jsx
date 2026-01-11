// src/pages/Payment.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getOrderById, updateOrder } from '../services/order.service'
import { formatCurrency } from '@utils/formatters'

export default function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  
  const [order, setOrder] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId)
        setOrder(data)
      } catch (error) {
        toast.error('Failed to fetch order')
        console.error(error)
      }
    }
    
    fetchOrder()
  }, [orderId])
  
  const handlePayment = async (method) => {
    if (!order) return
    setIsProcessing(true)
    
    try {
      if (method === 'cod') {
        // For Cash on Delivery, just update paymentStatus
        await updateOrder(order.id, { paymentMethod: 'cod', paymentStatus: 'pending', status: 'pending' })
        toast.success('Order confirmed for Cash on Delivery')
      } else if (method === 'online') {
        // Dummy online payment logic (integrate with Stripe, Razorpay, etc.)
        await new Promise(resolve => setTimeout(resolve, 2000)) // simulate payment delay
        await updateOrder(order.id, { paymentMethod: 'online', paymentStatus: 'paid', status: 'paid' })
        toast.success('Payment successful!')
      }
      
      navigate(`/order-success/${order.id}`)
    } catch (error) {
      toast.error('Payment failed')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto min-h-screen px-4 py-6">
      <h1 className="text-xl font-black text-neutral-900 mb-4">Payment</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <h2 className="text-sm font-bold text-neutral-700 mb-2">Order Summary</h2>
        {order.items.map(item => (
          <div key={item.productId} className="flex justify-between text-sm mb-1">
            <span>{item.name} x {item.quantity}</span>
            <span>{formatCurrency(item.total)}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-neutral-900">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <h2 className="text-sm font-bold text-neutral-700 mb-2">Choose Payment Method</h2>

        <button
          onClick={() => handlePayment('cod')}
          disabled={isProcessing}
          className="w-full mb-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Cash on Delivery'}
        </button>

        <button
          onClick={() => handlePayment('online')}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Pay Online'}
        </button>
      </div>
    </div>
  )
}