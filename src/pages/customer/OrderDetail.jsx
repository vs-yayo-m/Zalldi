import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Clock, 
  CreditCard, 
  MapPin, 
  Phone, 
  HelpCircle, 
  FileText,
  Truck,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

// Existing project architecture imports
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import OrderTracking from '../../components/customer/OrderTracking';
import LoadingScreen from '../../components/shared/LoadingScreen';
import EmptyState from '../../components/shared/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

/**
 * ZALLDI - Enterprise Order Detail Experience
 * Features: High-fidelity status tracking, detailed itemization, and logistical insights.
 */

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { order, loading: orderLoading, fetchOrder } = useOrders({ autoFetch: false });
  
  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/orders', { replace: true });
    }
  }, [user, authLoading, navigate]);
  
  // Data Fetching
  useEffect(() => {
    if (orderId && user) {
      fetchOrder(orderId);
    }
  }, [orderId, user, fetchOrder]);

  // Determine status color scheme
  const statusConfig = useMemo(() => {
    const s = order?.status?.toLowerCase();
    if (s === 'delivered') return { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircle2 size={18} /> };
    if (s === 'cancelled') return { bg: 'bg-red-50', text: 'text-red-700', icon: <AlertCircle size={18} /> };
    return { bg: 'bg-orange-50', text: 'text-orange-700', icon: <Truck size={18} /> };
  }, [order]);
  
  if (authLoading || orderLoading) return <LoadingScreen />;
  if (!user) return null;
  
  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-24 px-4">
        <div className="max-w-xl mx-auto">
          <EmptyState
            icon={Package}
            title="Order Not Found"
            description="The order reference provided doesn't exist or you don't have permission to view it."
            actionLabel="Return to My Orders"
            onAction={() => navigate('/customer/orders')}
          />
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9FA] pb-24 pt-24"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <button
              onClick={() => navigate('/customer/orders')}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-bold text-sm mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to My Orders
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                Order <span className="text-orange-500">#{order.id.slice(-8)}</span>
              </h1>
              <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest ${statusConfig.bg} ${statusConfig.text}`}>
                {statusConfig.icon}
                {order.status}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl border-gray-200 font-bold flex items-center gap-2">
              <FileText size={18} /> Invoice
            </Button>
            <Button className="rounded-2xl font-bold bg-gray-900 flex items-center gap-2">
              <HelpCircle size={18} /> Need Help?
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Tracking & Items */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Visual Tracking Component */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <OrderTracking order={order} />
            </div>

            {/* 2. Items List */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBagIcon /> Order Basket
                <span className="text-sm font-bold text-gray-400">({order.items?.length || 0} items)</span>
              </h3>
              <div className="divide-y divide-gray-50">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-5 flex items-center gap-6 group">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 group-hover:bg-orange-50 transition-colors">
                       <Package className="text-gray-300 group-hover:text-orange-300 transition-colors" size={32} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                      <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <div className="text-right font-black text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Logistics & Payment */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery Address Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                <MapPin size={14} className="text-orange-500" /> Delivery Address
              </div>
              <p className="font-black text-gray-900 mb-1">{order.address?.name || user.displayName}</p>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {order.address?.street}, {order.address?.city}<br />
                {order.address?.state} - {order.address?.zipCode}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-700 font-bold">
                <Phone size={14} className="text-gray-400" /> {order.address?.phone || user.phoneNumber || 'N/A'}
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                <CreditCard size={14} className="text-orange-500" /> Bill Summary
              </div>
              
              <div className="space-y-3">
                <SummaryRow label="Items Total" value={formatCurrency(order.subtotal)} />
                <SummaryRow label="Delivery Fee" value={order.deliveryFee > 0 ? formatCurrency(order.deliveryFee) : 'FREE'} isFree={order.deliveryFee === 0} />
                {order.discount > 0 && <SummaryRow label="Coupon Savings" value={`-${formatCurrency(order.discount)}`} isDiscount />}
                <SummaryRow label="Taxes & Charges" value={formatCurrency(order.tax || 0)} />
                
                <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-lg font-black text-gray-900">Total Paid</span>
                  <span className="text-2xl font-black text-orange-600">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <CreditCard size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Method</p>
                    <p className="text-xs font-bold text-gray-900">{order.paymentMethod || 'Credit Card'}</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px] font-black">PAID</Badge>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SummaryRow = ({ label, value, isDiscount, isFree }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`font-bold ${isDiscount ? 'text-green-600' : isFree ? 'text-green-600' : 'text-gray-900'}`}>
      {value}
    </span>
  </div>
);

const ShoppingBagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

export default OrderDetail;

