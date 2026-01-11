// src/pages/Payment.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getOrderById, updateOrder } from '../services/order.service'
import { formatCurrency } from '@utils/formatters'
import { ShieldCheck, Truck, Clock } from 'lucide-react'

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
        toast.error('Failed to load order')
        console.error(error)
      }
    }
    
    fetchOrder()
  }, [orderId])
  
  const confirmCOD = async () => {
    if (!order) return
    
    setIsProcessing(true)
    try {
      await updateOrder(order.id, {
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        status: 'pending'
      })
      
      toast.success('Order confirmed (Cash on Delivery)')
      navigate(`/order-success/${order.id}`)
    } catch (error) {
      toast.error('Failed to confirm order')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500 text-sm">Loading order…</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto min-h-screen px-4 py-6 bg-neutral-50">
      <h1 className="text-xl font-black text-neutral-900 mb-4">
        Payment
      </h1>

      {/* Order Summary */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-5">
        <h2 className="text-sm font-black text-neutral-700 mb-3 uppercase">
          Order Summary
        </h2>

        {order.items.map(item => (
          <div key={item.productId} className="flex justify-between text-sm mb-1">
            <span className="font-medium">
              {item.name} × {item.quantity}
            </span>
            <span className="font-bold">
              {formatCurrency(item.total)}
            </span>
          </div>
        ))}

        <hr className="my-3" />

        <div className="flex justify-between font-black text-neutral-900">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Cash on Delivery (Default) */}
      <div className="bg-white rounded-xl border border-green-300 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-5 h-5 text-green-600" />
          <h2 className="text-sm font-black text-green-700">
            Cash on Delivery (Default)
          </h2>
        </div>

        <p className="text-xs text-neutral-600 mb-3">
          Pay with cash when your order is delivered to your doorstep.
        </p>

        <button
          onClick={confirmCOD}
          disabled={isProcessing}
          className="w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 text-white rounded-xl font-black uppercase tracking-wide transition-all"
        >
          {isProcessing ? 'Confirming…' : 'Confirm Order (COD)'}
        </button>
      </div>

      {/* Online Payment (Coming Soon – Trust Section) */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 opacity-90">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-neutral-600" />
          <h2 className="text-sm font-black text-neutral-700">
            Online Payments
          </h2>
          <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
            Coming Soon
          </span>
        </div>

        <p className="text-xs text-neutral-500 mb-4">
          Secure online payments will be available soon. We are integrating trusted Nepal payment gateways.
        </p>

        <div className="flex gap-4 items-center">
          {/* eSewa */}
          <div className="flex items-center gap-2 bg-neutral-100 px-3 py-2 rounded-lg">
            <img
  src="/payments/esewa.png"
  alt="eSewa"
  className="h-12 w-auto object-contain scale-125"
/>
            <span className="text-xs font-bold text-neutral-600">
              eSewa
            </span>
          </div>

          {/* Khalti */}
          <div className="flex items-center gap-2 bg-neutral-100 px-3 py-2 rounded-lg">
            <img
              src="/payments/khalti.png"
              alt="Khalti"
              className="h-12 w-auto object-contain scale-125"
            />
            <span className="text-xs font-bold text-neutral-600">
              Khalti
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-[11px] text-neutral-500">
          <Clock className="w-4 h-4" />
          <span>Online payment support will be enabled soon</span>
        </div>
      </div>
    </div>
  )
}