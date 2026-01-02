// src/components/customer/OrderTracking.jsx

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTimeline from './OrderTimeline';
import TrackingMap from './TrackingMap';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Alert from '@components/ui/Alert';
import { formatCurrency, formatOrderNumber, formatDateTime, formatTimeRemaining } from '@utils/formatters';
import { ORDER_STATUS, ORDER_STATUS_LABELS, CONTACT } from '@utils/constants';
import { 
  Package, MapPin, Clock, Phone, MessageCircle,
  AlertCircle, CheckCircle, Truck, Navigation, 
  ChevronRight, Info, ShieldCheck
} from 'lucide-react';

/**
 * ENTERPRISE-GRADE ORDER TRACKING
 * Features: 
 * - Real-time ETA calculations
 * - Dynamic status-based UI shifting
 * - Framer Motion micro-interactions
 * - Blinkit-inspired "Live" pulse animations
 */

export default function OrderTracking({ order }) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isDelayed, setIsDelayed] = useState(false);

  // Animation Variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  useEffect(() => {
    if (!order.estimatedDelivery) return;

    const updateTimer = () => {
      const now = new Date();
      const estimated = new Date(order.estimatedDelivery);
      const remaining = estimated - now;

      if (remaining <= 0 && order.status !== 'delivered') {
        setIsDelayed(true);
        setTimeRemaining('Arriving any moment');
      } else if (order.status === 'delivered') {
        setTimeRemaining('Delivered');
      } else {
        setTimeRemaining(formatTimeRemaining(estimated));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [order.estimatedDelivery, order.status]);

  const getStatusConfig = useMemo(() => {
    const configs = {
      delivered: { color: 'success', bg: 'bg-green-50', iconColor: 'text-green-600' },
      cancelled: { color: 'error', bg: 'bg-red-50', iconColor: 'text-red-600' },
      processing: { color: 'warning', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
      shipped: { color: 'info', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
      default: { color: 'info', bg: 'bg-neutral-50', iconColor: 'text-neutral-600' }
    };
    return configs[order.status] || configs.default;
  }, [order.status]);

  const handleContactSupport = () => {
    const message = encodeURIComponent(`Hi, I need help with order ${order.orderNumber}`);
    window.open(`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Dynamic Status Banner */}
      <AnimatePresence mode="wait">
        {isDelayed && order.status !== 'delivered' && (
          <motion.div key="delay-alert" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Alert variant="warning" className="border-l-4 border-orange-500 shadow-sm">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-bold text-orange-900">Delivery taking longer than usual</p>
                  <p className="text-sm text-orange-800 opacity-90">Our partner is navigating heavy traffic. We appreciate your patience!</p>
                </div>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Order Header Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Order ID</span>
                  <h2 className="text-2xl font-black text-neutral-900 leading-none">
                    #{order.orderNumber}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusConfig.color} size="lg" className="px-4 py-1.5 rounded-full uppercase tracking-wider font-bold">
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-neutral-100 rounded-2xl overflow-hidden">
                <div className="p-5 bg-neutral-50/50 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-neutral-100">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" />
                    <div className="relative bg-orange-500 p-2.5 rounded-full">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-neutral-500 uppercase">Estimated Arrival</p>
                  <p className="font-bold text-neutral-900 mt-1">{timeRemaining}</p>
                </div>

                <div className="p-5 bg-neutral-50/50 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-neutral-100">
                  <div className="bg-green-100 p-2.5 rounded-full mb-2">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs font-medium text-neutral-500 uppercase">Parcel Size</p>
                  <p className="font-bold text-neutral-900 mt-1">{order.items.length} Essential{order.items.length > 1 ? 's' : ''}</p>
                </div>

                <div className="p-5 bg-neutral-50/50 flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-2.5 rounded-full mb-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-medium text-neutral-500 uppercase">Payment Total</p>
                  <p className="font-bold text-primary-600 mt-1">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
              <h2 className="text-xl font-bold text-neutral-900">Journey Tracking</h2>
            </div>
            <OrderTimeline order={order} />
          </motion.div>

          {/* Dynamic Map Component */}
          {order.deliveryAddress?.coordinates && (
            <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-orange-500" />
                  Live Location
                </h2>
                <Badge variant="outline" className="text-[10px] animate-pulse">LIVE UPDATE</Badge>
              </div>
              <div className="h-[400px] w-full bg-neutral-100">
                 <TrackingMap destination={order.deliveryAddress.coordinates} orderStatus={order.status} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Info (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="sticky top-24 space-y-6">
            
            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
              <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-4">Deliver To</h3>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-neutral-900 text-lg leading-tight mb-1">{order.deliveryAddress.street}</p>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {order.deliveryAddress.area}, Ward {order.deliveryAddress.ward}<br />
                    Butwal, Lumbini
                  </p>
                  {order.deliveryAddress.landmark && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-full">
                      <Info className="w-3 h-3" />
                      Near {order.deliveryAddress.landmark}
                    </div>
                  )}
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Instruction for Partner</p>
                  <p className="text-sm text-blue-800 italic leading-snug">"{order.notes}"</p>
                </div>
              )}
            </div>

            {/* Support Actions */}
            <div className="bg-neutral-900 rounded-3xl p-6 text-white shadow-2xl shadow-orange-900/10">
              <h3 className="font-bold text-xl mb-2">Need Assistance?</h3>
              <p className="text-neutral-400 text-sm mb-6">Our 24/7 support team is here to help with your delivery.</p>
              
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  className="bg-green-600 hover:bg-green-700 border-none h-12 rounded-2xl"
                  onClick={handleContactSupport}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp Support</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  fullWidth 
                  className="border-neutral-700 text-white hover:bg-neutral-800 h-12 rounded-2xl"
                  onClick={() => window.location.href = `tel:${CONTACT.phone}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>Call Helpline</span>
                  </div>
                </Button>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Order Items List (Full Width at Bottom) */}
        <motion.div variants={itemVariants} className="lg:col-span-12">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-900">Order Summary</h2>
              <span className="text-sm font-medium text-neutral-500">{order.items.length} Items</span>
            </div>
            
            <div className="p-6 sm:p-8 space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-neutral-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || '/images/placeholder.webp'} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral-900 truncate">{item.name}</p>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">{formatCurrency(item.total)}</p>
                    <p className="text-[10px] text-neutral-400 font-medium">UNIT: {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-8 border-t border-neutral-100">
                <div className="max-w-md ml-auto space-y-3">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-neutral-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-bold">{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-dashed border-neutral-100">
                    <span className="text-lg font-black text-neutral-900">Paid Amount</span>
                    <span className="text-2xl font-black text-orange-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
