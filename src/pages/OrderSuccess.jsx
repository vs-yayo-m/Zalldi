/**
 * src/pages/OrderSuccess.jsx
 * * ENHANCED ENTERPRISE VERSION:
 * - Implements Staggered Motion Container for smooth content loading.
 * - Blinkit-inspired 10-minute delivery promise styling.
 * - Interactive order breakdown with hyper-realistic shadow depths.
 * - Integration with existing formatting and service utilities.
 */

import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrderById } from '@services/order.service';

// UI Components from your project architecture
import Button from '@components/ui/Button';
import LoadingScreen from '@components/shared/LoadingScreen';
import Confetti from '@components/animations/Confetti';
import Badge from '@components/ui/Badge';

// Utils & Icons
import { formatCurrency, formatOrderNumber, formatDateTime } from '@utils/formatters';
import {
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

// Animation Variants for Enterprise feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
};

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetching from your existing order service
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Order Fetch Error:', error);
      } finally {
        // Simulate a slight delay for high-quality feel during transition
        setTimeout(() => setLoading(false), 800);
      }
    };
    
    if (orderId) fetchOrder();
    
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, [orderId]);
  
  if (loading) return <LoadingScreen />;
  
  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mb-6">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-orange-500" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-neutral-800">Order not found</h2>
        <p className="text-neutral-500 mt-2 mb-8 max-w-xs">
          We couldn't find the details for this order. It might still be processing.
        </p>
        <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white min-w-[200px]"
            onClick={() => navigate('/')}
        >
          Return to Store
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Confetti Component from your existing animations 
          High-performance canvas-based confetti
      */}
      {showConfetti && <Confetti intensity={0.6} />}

      <div className="max-w-2xl mx-auto px-4 pt-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Success Header Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-8 text-center bg-gradient-to-b from-green-50/50 to-white">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, delay: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg shadow-green-200"
              >
                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>

              <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
                Order Received!
              </h1>
              <p className="text-neutral-500 font-medium max-w-sm mx-auto">
                Your groceries are being picked by our partner and will reach you shortly.
              </p>
            </div>

            {/* Status Summary Strip */}
            <div className="flex border-t border-neutral-50 divide-x divide-neutral-50">
              <div className="flex-1 p-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Order ID</p>
                <p className="font-mono font-bold text-neutral-800 tracking-tighter">
                  #{order.orderNumber?.toUpperCase() || orderId.slice(-6).toUpperCase()}
                </p>
              </div>
              <div className="flex-1 p-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Payment</p>
                <Badge variant="success" className="bg-green-100 text-green-700 border-none px-3">
                  SUCCESSFUL
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Delivery Promise Card (Blinkit Style) */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-neutral-900">Arriving in 12-15 mins</h3>
                        <p className="text-xs text-neutral-500">Fastest delivery to {order.deliveryAddress.area}</p>
                    </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            </div>

            {/* Quick Progress Bar */}
            <div className="relative h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden mb-2">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                />
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">Order is being packed at the nearby dark store</p>
          </motion.div>

          {/* Order Details Accordion-Style */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-neutral-100 divide-y divide-neutral-50">
            {/* Delivery Address Section */}
            <div className="p-5 flex items-start gap-4">
              <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-neutral-800">Delivering to</p>
                <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">
                  {order.deliveryAddress.street}, Ward {order.deliveryAddress.ward}<br />
                  {order.deliveryAddress.area}, Butwal
                </p>
              </div>
            </div>

            {/* Items Summary */}
            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-4">
                <Package className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-bold text-neutral-800">{order.items.length} Items</p>
                  <p className="text-xs text-neutral-500">Total Weight: ~2.5kg</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-600">{formatCurrency(order.total)}</span>
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </div>
            </div>
          </motion.div>

          {/* Security & Trust Badge */}
          <motion.div 
            variants={itemVariants}
            className="bg-blue-50/50 rounded-2xl p-4 flex items-center gap-3 border border-blue-100"
          >
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-blue-800 font-medium leading-tight">
              Your order is covered by Zalldi Trust. 100% Quality Assurance or Instant Refund.
            </p>
          </motion.div>

          {/* Primary Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="h-14 rounded-2xl border-2 border-neutral-200 hover:bg-neutral-50 transition-all font-bold text-neutral-700"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate(`/track/${orderId}`)}
              className="h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 transition-all font-bold flex items-center justify-center gap-2 group"
            >
              Track Live Order
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Button>
          </motion.div>

          {/* Support Footer */}
          <motion.div variants={itemVariants} className="text-center pt-8 pb-4">
            <p className="text-neutral-400 text-sm">Need help with your order?</p>
            <div className="flex items-center justify-center gap-6 mt-4">
                <button 
                    onClick={() => navigate('/support')}
                    className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline underline-offset-4"
                >
                    <PhoneCall className="w-4 h-4" />
                    Call Support
                </button>
                <span className="h-4 w-px bg-neutral-200" />
                <button 
                    className="text-neutral-500 font-bold text-sm hover:text-neutral-800"
                    onClick={() => window.print()}
                >
                    Download Invoice
                </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}