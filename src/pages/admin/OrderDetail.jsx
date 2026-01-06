import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Package, User, MapPin, Phone, Mail, Clock, 
  CheckCircle, XCircle, Truck, Edit, Printer, MessageSquare, 
  Zap, Receipt, ClipboardList, ShieldCheck, CreditCard
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
      console.error('Fetch error:', error)
      toast.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order moved to ${ORDER_STATUS_LABELS[newStatus]}`)
      await fetchOrder()
    } catch (error) {
      toast.error('Status update failed')
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => window.print()

  if (loading) return <LoadingScreen />
  if (!order) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-black">ORDER NOT FOUND</h1>
      <Button onClick={() => navigate('/admin/orders')}>Return to Dashboard</Button>
    </div>
  )

  const getStatusTheme = (status) => {
    const themes = {
      [ORDER_STATUS.PENDING]: 'bg-orange-100 text-orange-600 border-orange-200',
      [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-600 border-blue-200',
      [ORDER_STATUS.PACKING]: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-600 border-green-200',
      [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-600 border-red-200',
    }
    return themes[status] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="no-print"><Header /></div>

      {/* ==========================================================================
         1. ENTERPRISE PRINT ENGINE (Invisible on Screen)
         ========================================================================== */}
      <div className="hidden print:block font-serif text-black">
        {/* Watermark for Cancelled Orders */}
        {order.status === ORDER_STATUS.CANCELLED && (
          <div className="print-watermark">CANCELLED</div>
        )}

        {/* Doc Header */}
        <div className="print-doc-header">
          <div className="print-brand-identity">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-black flex items-center justify-center rounded">
                  <span className="text-white font-black text-xl italic">Z</span>
                </div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">Zalldi</h1>
             </div>
             <p className="text-[9px] font-bold text-neutral-500 uppercase leading-tight">
                Premium Logistics & Retail Network<br />
                Butwal, Nepal | zalldi.com.np
             </p>
          </div>
          <div className="print-doc-meta">
            <h2 className="print-doc-id text-right">TAX INVOICE</h2>
            <p className="text-[10px] font-black uppercase text-neutral-400 mt-1">NO: #{order.orderNumber}</p>
            <p className="text-[9px] font-medium text-neutral-600">DATE: {formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="print-info-grid">
          <div>
            <span className="print-label">Billing & Shipping Details</span>
            <p className="text-sm font-black uppercase mb-1">{order.customerName}</p>
            <p className="text-[10px] leading-relaxed text-neutral-700 w-3/4">
              {formatAddress(order.deliveryAddress)}
            </p>
            <p className="text-[10px] font-bold mt-2">TEL: {order.customerPhone}</p>
          </div>
          <div className="text-right">
            <span className="print-label">Payment Information</span>
            <p className="text-[10px] font-bold uppercase">{order.paymentMethod || 'Cash On Delivery'}</p>
            <p className="text-[10px] font-medium text-neutral-500 mt-1 italic">Status: {order.paymentStatus || 'Pending'}</p>
            
            <div className="mt-4">
              <span className="print-label">Dispatch Method</span>
              <p className="text-[10px] font-bold flex items-center justify-end gap-1">
                <Zap size={10} /> Zalldi Express (60 Mins)
              </p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <table className="print-data-table">
          <thead>
            <tr>
              <th className="w-12">SN</th>
              <th>Description</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="text-[10px] text-neutral-400 font-bold">{idx + 1}</td>
                <td>
                  <p className="print-item-title">{item.name}</p>
                  <p className="print-item-desc">SKU: {item.sku || 'ZAL-' + idx}</p>
                </td>
                <td className="text-center font-bold text-xs">{item.quantity}</td>
                <td className="text-right text-xs">{formatCurrency(item.price)}</td>
                <td className="text-right font-black text-xs">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Block */}
        <div className="print-summary-container">
          <div className="print-summary-card">
            <div className="print-summary-row">
              <span className="text-[10px] font-bold uppercase text-neutral-500">Subtotal Amount</span>
              <span className="font-bold text-xs">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="print-summary-row">
              <span className="text-[10px] font-bold uppercase text-neutral-500">Service & Delivery</span>
              <span className="font-bold text-xs">{formatCurrency(order.deliveryFee || 0)}</span>
            </div>
            {order.discount > 0 && (
              <div className="print-summary-row">
                <span className="text-[10px] font-bold uppercase text-neutral-500">Campaign Discount</span>
                <span className="font-bold text-xs text-rose-600">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="print-summary-row grand-total">
              <span className="text-sm">GRAND TOTAL (NPR)</span>
              <span className="text-lg">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="print-compliance-footer">
          <div className="flex justify-between items-end mb-10">
            <div className="text-left">
               <p className="text-[8px] font-bold uppercase text-neutral-400 mb-8">Authorized Signature</p>
               <div className="w-32 border-b border-black"></div>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-bold uppercase text-neutral-400 mb-8">Customer Acknowledgment</p>
               <div className="w-32 border-b border-black"></div>
            </div>
          </div>
          <p className="text-[7px] uppercase tracking-widest font-bold">
            Thank you for choosing Zalldi. This document serves as a valid commercial invoice.
          </p>
        </div>
      </div>


      {/* ==========================================================================
         2. ADMIN DASHBOARD INTERFACE (Screen Only)
         ========================================================================== */}
      <main className="container mx-auto px-4 py-8 no-print pb-24">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center text-neutral-400 hover:text-black transition-all mb-3"
            >
              <div className="p-1 rounded-full group-hover:bg-neutral-200 mr-2 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="text-sm font-black uppercase tracking-tighter">Exit to Console</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-neutral-900">
                Order <span className="text-orange-600">#{order.orderNumber}</span>
              </h1>
              <div className={`px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest ${getStatusTheme(order.status)}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="bg-white border-2 border-neutral-200 hover:border-black rounded-2xl px-6 h-12 transition-all"
            >
              <Printer className="w-4 h-4 mr-2" />
              <span className="font-black text-xs uppercase">Generate Invoice</span>
            </Button>
            
            {order.status !== ORDER_STATUS.DELIVERED && (
              <Button
                onClick={() => handleStatusUpdate(ORDER_STATUS.PACKING)}
                disabled={updating}
                className="bg-neutral-900 hover:bg-black text-white rounded-2xl px-8 h-12 shadow-xl shadow-neutral-200 transition-all"
              >
                <Package className="w-4 h-4 mr-2" />
                <span className="font-black text-xs uppercase tracking-tight">Stage for Delivery</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Console: Left Side */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Packaging Interface: Items Table */}
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 overflow-hidden">
              <div className="p-8 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-neutral-800">Manifest Summary</h3>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{order.items?.length} Unique SKUs</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/30">
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-neutral-400 tracking-widest">Article</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-neutral-400 tracking-widest text-center">Qty</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Price</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Ext. Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 p-2 overflow-hidden shrink-0">
                              <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div>
                              <p className="font-black text-sm text-neutral-800 tracking-tight leading-none mb-1">{item.name}</p>
                              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">UNIT: {item.unit || 'Standard'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600 font-black text-xs">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-neutral-500 text-sm">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-8 py-5 text-right font-black text-neutral-900 text-sm">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Console Totals */}
              <div className="p-8 bg-neutral-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black text-neutral-500 uppercase mb-1">Subtotal</p>
                    <p className="font-bold">{formatCurrency(order.subtotal)}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-500 uppercase mb-1">Logistics</p>
                    <p className="font-bold">+{formatCurrency(order.deliveryFee || 0)}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black text-orange-500 uppercase mb-1 tracking-[0.2em]">Settlement Amount</p>
                  <p className="text-3xl font-black italic tracking-tighter">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Console: Right Side */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Shipping & Handling */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-xl shadow-neutral-200/50">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-8 flex items-center gap-2">
                <Truck size={14} className="text-orange-500" /> Dispatch Profile
              </h3>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-2 tracking-widest">Consignee</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-black text-xs">
                      {order.customerName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-neutral-800 leading-none">{order.customerName}</p>
                      <p className="text-[10px] font-bold text-neutral-400 mt-1">{order.customerPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-neutral-50">
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-2 tracking-widest">Delivery Coordinates</label>
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-600 leading-relaxed italic">
                      {formatAddress(order.deliveryAddress)}
                    </p>
                    {order.deliveryAddress?.landmark && (
                      <p className="mt-3 inline-block px-3 py-1 bg-white border border-neutral-200 rounded-lg text-[10px] font-black text-orange-500 uppercase">
                        🚩 {order.deliveryAddress.landmark}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-neutral-50">
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-2 tracking-widest">Security & Verification</label>
                  <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase">
                    <ShieldCheck size={14} /> Identity Verified (OTP)
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {order.notes && (
              <div className="bg-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={16} className="fill-white" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Special Instructions</h3>
                </div>
                <p className="text-sm font-bold leading-relaxed italic">
                  "{order.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="no-print"><Footer /></div>
    </div>
  )
}

