// src/pages/admin/OrderDetail.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Package, User, MapPin, Phone, Mail, Clock, 
  CheckCircle, XCircle, Truck, Edit, Printer, MessageSquare, Zap
} from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import LoadingScreen from '@components/shared/LoadingScreen'
import { getOrderById, updateOrderStatus, cancelOrder } from '@services/order.service'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@utils/constants'
import { formatCurrency, formatDateTime, formatAddress } from '@utils/formatters'
import toast from 'react-hot-toast'

export default function AdminOrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (orderId) fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await getOrderById(orderId)
      setOrder(data)
    } catch (error) {
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <LoadingScreen />
  if (!order) return <div className="p-20 text-center">Order not found</div>

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="no-print">
        <Header />
      </div>
      
      {/* ==========================================================================
         A. PRINT-ONLY LAYER (Enterprise Engine)
         ========================================================================== */}
      <div className="hidden print:block">
        <div className="print-doc-header">
          <div className="print-brand-identity">
            {/* Using text logo if SVG is unavailable, styled as high-end typography */}
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-orange-600">Zalldi</h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Butwal's Fresh Network</p>
          </div>
          <div className="print-doc-meta">
            <h2 className="print-doc-id">ORDER #{order.orderNumber}</h2>
            <p className="text-[10px] font-medium text-neutral-500">{formatDateTime(order.createdAt)}</p>
            <div className="mt-2">
               <span className="print-status">{ORDER_STATUS_LABELS[order.status]}</span>
            </div>
          </div>
        </div>

        <div className="print-info-grid">
          <div>
            <span className="print-label">Billing & Shipping To</span>
            <p className="font-black text-sm">{order.customerName}</p>
            <p className="text-xs text-neutral-600 mt-1">{formatAddress(order.deliveryAddress)}</p>
            <div className="flex gap-4 mt-2 text-[10px] font-bold">
              <span>TEL: {order.customerPhone}</span>
              {order.customerEmail && <span>MAIL: {order.customerEmail}</span>}
            </div>
          </div>
          <div className="text-right">
            <span className="print-label">Shipping Method</span>
            <p className="font-bold text-xs uppercase flex items-center justify-end gap-1">
               <Zap size={10} className="text-orange-500" /> Express 1-Hour Delivery
            </p>
            {order.notes && (
              <div className="mt-4">
                <span className="print-label">Order Notes</span>
                <p className="text-[10px] italic">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <table className="print-data-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, index) => (
              <tr key={index}>
                <td>
                  <p className="print-item-title">{item.name}</p>
                  <p className="print-item-desc">{item.unit || 'Standard Unit'}</p>
                </td>
                <td className="text-center font-bold">{item.quantity}</td>
                <td className="text-right">{formatCurrency(item.price)}</td>
                <td className="text-right font-bold">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-summary-container">
          <div className="print-summary-card">
            <div className="print-summary-row">
              <span className="text-xs text-neutral-500 font-bold uppercase">Subtotal</span>
              <span className="font-bold">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="print-summary-row">
              <span className="text-xs text-neutral-500 font-bold uppercase">Delivery Fee</span>
              <span className="font-bold">{formatCurrency(order.deliveryFee || 0)}</span>
            </div>
            {order.discount > 0 && (
              <div className="print-summary-row">
                <span className="text-xs text-neutral-500 font-bold uppercase">Discounts</span>
                <span className="font-bold">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="print-summary-row grand-total">
              <span>TOTAL (NPR)</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="print-compliance-footer">
          <p>This is a computer-generated invoice. No signature required.</p>
          <p className="mt-1">Zalldi Pvt. Ltd. | Ward No. 11, Butwal, Rupandehi | PAN: 610023941</p>
        </div>
      </div>


      {/* ==========================================================================
         B. BROWSER INTERFACE (SCREEN ONLY)
         ========================================================================== */}
      <div className="container mx-auto px-4 py-8 no-print">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center text-neutral-500 hover:text-black mb-2 transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Order #{order.orderNumber}</h1>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={handlePrint} className="bg-white border-2 border-neutral-200">
                <Printer className="w-4 h-4 mr-2" /> Print Invoice
             </Button>
             <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black shadow-lg shadow-orange-200">
                Manage Logistics
             </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <section className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black uppercase italic">Line Items</h2>
                  <Badge variant="blue" className="px-4 py-1.5 rounded-full">{order.items?.length} Items</Badge>
                </div>
                <div className="divide-y divide-neutral-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-neutral-50 rounded-2xl p-2 border border-neutral-100 shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-800">{item.name}</h4>
                        <p className="text-[10px] font-black text-neutral-400 uppercase">{item.unit || 'Standard'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm">{formatCurrency(item.total)}</p>
                        <p className="text-[10px] font-bold text-neutral-400">{item.quantity} x {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </section>
          </div>

          <div className="space-y-6">
             <section className="bg-neutral-900 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-orange-500 mb-6">Customer Dossier</h3>
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-neutral-500 uppercase block mb-1">Full Name</label>
                      <p className="font-bold text-lg">{order.customerName}</p>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-neutral-500 uppercase block mb-1">Contact Link</label>
                      <p className="font-bold flex items-center gap-2"><Phone size={14} className="text-orange-500" /> {order.customerPhone}</p>
                      {order.customerEmail && <p className="text-sm font-medium text-neutral-400 mt-1 underline italic">{order.customerEmail}</p>}
                   </div>
                   <div className="pt-6 border-t border-white/10">
                      <label className="text-[10px] font-black text-neutral-500 uppercase block mb-1">Drop Point</label>
                      <p className="text-sm font-medium leading-relaxed">{formatAddress(order.deliveryAddress)}</p>
                   </div>
                </div>
             </section>
          </div>
        </div>
      </div>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}

