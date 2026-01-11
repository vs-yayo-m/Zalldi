// src/pages/Payment.jsx

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Placeholder for actual payment integration
    console.log('Order ready for payment:', orderId)
  }, [orderId])
  
  const handleOnlinePayment = (method) => {
    alert(`${method} payment is coming soon for Order ID: ${orderId}`)
  }
  
  const handleCashOnDelivery = () => {
    // Redirect to order success page
    navigate(`/order-success/${orderId}`)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        <h1 className="text-xl font-bold mb-4">Payment Options</h1>
        <p className="mb-6">Order ID: <span className="font-mono">{orderId}</span></p>

        <button
          onClick={() => handleOnlinePayment('eSewa')}
          className="w-full mb-3 h-12 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
        >
          Pay with eSewa
        </button>

        <button
          onClick={() => handleOnlinePayment('Khalti')}
          className="w-full mb-3 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Pay with Khalti
        </button>

        <button
          onClick={handleCashOnDelivery}
          className="w-full mt-4 h-12 border border-neutral-300 rounded-xl font-bold hover:bg-neutral-100 transition-colors"
        >
          Cash on Delivery
        </button>
      </div>
    </div>
  )
}