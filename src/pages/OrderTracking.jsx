//src/pages/OrderTracking.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useOrders } from '@hooks/useOrders';
import OrderTracking from '@components/customer/OrderTracking';
import LoadingScreen from '@components/shared/LoadingScreen';
import EmptyState from '@components/shared/EmptyState';
import Button from '@components/ui/Button';
import { Package, ArrowLeft, RefreshCcw } from 'lucide-react';

/**
 * ENTERPRISE-GRADE TRACKING PAGE
 * Optimized for mobile-first views and rapid state switching.
 */

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, loading, error, fetchOrder } = useOrders({ orderId, autoFetch: false });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Reading scroll progress for a subtle top bar indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId).finally(() => {
        setIsInitialLoad(false);
      });
    } else {
      navigate('/', { replace: true });
    }
  }, [orderId, fetchOrder, navigate]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchOrder(orderId);
  };

  if (loading && isInitialLoad) {
    return <LoadingScreen message="Locating your delivery partner..." />;
  }

  if (error || (!loading && !order)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <EmptyState
            icon={Package}
            title="Order Not Found"
            description="We couldn't retrieve the details for this order. It might be expired or the ID is incorrect."
            actionLabel="Return to My Orders"
            onAction={() => navigate('/customer/orders')}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Header Section */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/customer/orders')}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-neutral-600" />
            </motion.button>
            <div>
              <h1 className="font-black text-xl text-neutral-900 tracking-tight">Track Order</h1>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-none">Live Tracking</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            loading={loading}
            className="text-neutral-500 hover:text-orange-600"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <OrderTracking order={order} />
      </div>

      {/* Modern Floating Help Button for Mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/static/support')}
        className="fixed bottom-6 right-6 lg:hidden bg-neutral-900 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-bold text-sm">Help</span>
      </motion.button>
    </div>
  );
}
