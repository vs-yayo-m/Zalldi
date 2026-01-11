// /src/pages/Payment.jsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '@services/order.service'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  useEffect(() => {
    const pendingOrder = sessionStorage.getItem('pendingOrder')
    if (!pendingOrder) {
      navigate('/cart')
      return
    }
    setOrderData(JSON.parse(pendingOrder))
  }, [navigate])
  
  const handleCOD = async () => {
    if (!orderData) return
    setIsProcessing(true)
    
    try {
      const order = await createOrder({ ...orderData, paymentMethod: 'cod' })
      sessionStorage.removeItem('pendingOrder')
      toast.success('Order placed successfully with COD!')
      navigate(`/order-success/${order.id}`)
    } catch (error) {
      toast.error('Failed to place order. Try again.')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleOnlinePayment = (method) => {
    toast('Online payment coming soon! 🛠️', { icon: '⚡' })
  }
  
  if (!orderData) return null
  
  return (
    <div className="max-w-xl mx-auto mt-10 p-5">
      <h2 className="text-lg font-bold mb-4">Choose Payment Method</h2>

      <button
        onClick={handleCOD}
        disabled={isProcessing}
        className="w-full mb-3 p-3 bg-green-600 text-white font-bold rounded"
      >
        {isProcessing ? 'Processing...' : 'Cash on Delivery'}
      </button>

      <button
        onClick={() => handleOnlinePayment('esewa')}
        className="w-full mb-3 p-3 bg-blue-600 text-white font-bold rounded"
      >
        Pay with eSewa (Coming Soon)
      </button>

      <button
        onClick={() => handleOnlinePayment('khalti')}
        className="w-full mb-3 p-3 bg-purple-600 text-white font-bold rounded"
      >
        Pay with Khalti (Coming Soon)
      </button>
    </div>
  )
}