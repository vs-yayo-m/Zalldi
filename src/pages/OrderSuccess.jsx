import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrderById } from '@/services/order.service';
import Button from '@/components/ui/Button';
import LoadingScreen from '@/components/shared/LoadingScreen';
import Confetti from '@/components/animations/Confetti';
import Header from '@/components/layout/Header';
import { formatCurrency, formatOrderNumber, formatDateTime } from '@/utils/formatters';
import { CheckCircle2, Package, MapPin, Clock, ArrowRight, Zap } from 'lucide-react';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) fetchOrder();
    
    // Auto-stop confetti after 6 seconds
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, [orderId]);
  
  if (loading) return <LoadingScreen message="Securing your order slot..." />;
  
  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-neutral-400" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 mb-2">Order Not Found</h2>
        <p className="text-neutral-500 font-medium mb-8 max-w-xs mx-auto">We couldn't locate this specific order. It may have been moved or archived.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#FDFDFD] relative overflow-hidden">
      <Header />

      {/* Confetti Explosion */}
      <AnimatePresence>
        {showConfetti && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 pointer-events-none z-50"
            >
                <Confetti />
            </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16 relative z-10">
        
        {/* HERO: Success Message */}
        <div className="text-center mb-12">
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30"
            >
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter uppercase mb-4"
            >
                Order Confirmed!
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-medium text-neutral-500 max-w-md mx-auto"
            >
                Sit tight! Our delivery partner will be at your doorstep within <span className="text-orange-600 font-bold">60 minutes</span>.
            </motion.p>
        </div>

        {/* TICKET: Order Details */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", damping: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden relative"
        >
            {/* Ticket Header */}
            <div className="bg-neutral-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Order Reference</p>
                    <p className="text-2xl font-black tracking-widest">#{formatOrderNumber(order.orderNumber)}</p>
                </div>
                <div className="relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Paid</p>
                    <p className="text-2xl font-black text-orange-500">{formatCurrency(order.total)}</p>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            </div>

            {/* Ticket Body */}
            <div className="p-8 space-y-8">
                
                {/* Timeline Strip */}
                <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-orange-600 shrink-0">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-orange-800 uppercase tracking-wide mb-1">Estimated Arrival</p>
                        <p className="text-sm font-bold text-neutral-700">
                            {formatDateTime(order.estimatedDelivery)} <span className="text-neutral-400 font-normal ml-1">(Approx)</span>
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">Delivery Location</p>
                                <p className="text-sm font-bold text-neutral-900 leading-snug">
                                    {order.deliveryAddress.street}, {order.deliveryAddress.area}
                                </p>
                                <p className="text-xs font-medium text-neutral-500 mt-0.5">Ward {order.deliveryAddress.ward}, Butwal</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Package className="w-5 h-5 text-neutral-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">Package Info</p>
                                <p className="text-sm font-bold text-neutral-900">
                                    {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} Packed
                                </p>
                                <p className="text-xs font-medium text-green-600 mt-0.5 flex items-center gap-1">
                                    <Zap size={10} fill="currentColor" /> Express Delivery Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket Footer Actions */}
            <div className="bg-neutral-50 p-8 border-t border-neutral-100 flex flex-col sm:flex-row gap-4">
                <Button 
                    variant="outline" 
                    onClick={() => navigate('/')} 
                    className="flex-1 bg-white border-neutral-200 h-14 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-orange-200"
                >
                    Continue Shopping
                </Button>
                <Button 
                    onClick={() => navigate(`/track/${order.id}`)} 
                    className="flex-1 h-14 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-neutral-800 flex items-center justify-center gap-2 group"
                >
                    Track Live Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </motion.div>

        {/* Support Link */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
        >
            <p className="text-neutral-400 text-xs font-medium">
                Confirmation sent to <span className="text-neutral-900 font-bold">{order.customerEmail}</span>
            </p>
            <button 
                onClick={() => navigate('/contact')}
                className="mt-2 text-orange-600 text-xs font-black uppercase tracking-widest hover:underline"
            >
                Need Help? Contact Support
            </button>
        </motion.div>

      </div>
    </div>
  )
}


