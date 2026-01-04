import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  MapPin, 
  User, 
  Clock, 
  ChevronRight, 
  Zap, 
  Heart, 
  HelpCircle,
  TrendingUp,
  CreditCard,
  Truck,
  Star,
  Gift,
  Package,
  ArrowUpRight,
  Coffee
} from 'lucide-react';

// --- Pure JS "Smart" Logic (Zero Cost) ---
const getPersonalizedGreeting = (name) => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name}! Ready for breakfast?`;
  if (hour < 17) return `Good Afternoon, ${name}! Need a quick snack?`;
  return `Good Evening, ${name}! dinner's on the way?`;
};

const getSmartReminder = (orders) => {
  if (!orders || orders.length === 0) return "Welcome to Zalldi! First delivery is on us.";
  // Simple logic: if they bought milk/bread recently, remind them
  const items = orders.flatMap(o => o.items.map(i => i.name.toLowerCase()));
  if (items.some(i => i.includes('milk') || i.includes('bread'))) {
    return "Running low on essentials? Restock your daily staples in one tap.";
  }
  return "You've saved a lot of time today! Relax, we'll handle the shopping.";
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  
  // Mock Data (Replace with your database/props)
  const user = { displayName: "Abhishek", walletBalance: 1250 };
  const orders = [
    { id: '1', orderNumber: 'ZAL-8821', status: 'out_for_delivery', total: 1200, items: [{name: 'Organic Apples'}], createdAt: new Date() },
    { id: '2', orderNumber: 'ZAL-8800', status: 'delivered', total: 450, items: [{name: 'Fresh Milk'}], createdAt: new Date(Date.now() - 86400000) }
  ];

  const greeting = useMemo(() => getPersonalizedGreeting(user.displayName.split(' ')[0]), [user.displayName]);
  const reminder = useMemo(() => getSmartReminder(orders), [orders]);

  const stats = {
    lifetimeOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
    totalSavings: 150,
    activeDeliveries: orders.filter(o => o.status !== 'delivered').length
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Member Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
              {greeting}
            </h1>
          </motion.div>

          <button 
            onClick={() => navigate('/shop')}
            className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-3 w-fit"
          >
            <Zap size={18} className="fill-current" />
            Start Shopping
          </button>
        </div>

        {/* Smart Status Bar (Zero API Cost) */}
        <div className="bg-white border border-neutral-100 p-6 rounded-[2rem] mb-10 shadow-sm flex items-start gap-4">
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
            <Coffee size={24} />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">Zalldi Insight</h4>
            <p className="text-lg font-bold text-neutral-800">{reminder}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Orders" value={stats.lifetimeOrders} icon={<ShoppingBag/>} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Active" value={stats.activeDeliveries} icon={<Truck/>} color="text-orange-600" bg="bg-orange-50" pulse={stats.activeDeliveries > 0} />
          <StatCard label="Saved" value={`रू ${stats.totalSavings}`} icon={<TrendingUp/>} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Wallet" value={`रू ${user.walletBalance}`} icon={<CreditCard/>} color="text-purple-600" bg="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">Recent Activity</h2>
              <Link to="/customer/orders" className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">View All</Link>
            </div>

            {orders.map(order => (
              <motion.div 
                key={order.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-50 rounded-[1.5rem] flex items-center justify-center border border-neutral-100">
                    <Package className="text-neutral-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">#{order.orderNumber}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="font-black text-neutral-900 text-lg uppercase leading-none">
                      {order.items[0].name} {order.items.length > 1 && `+ ${order.items.length - 1} more`}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-2 font-bold flex items-center gap-1">
                      <Clock size={12} /> {order.status === 'delivered' ? 'Delivered Yesterday' : 'Arrival in 15 mins'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                  <p className="text-xl font-black text-neutral-900 tracking-tighter">रू {order.total}</p>
                  <button className="p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                    <ChevronRight size={20} className="text-neutral-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <Star className="text-orange-500 fill-current mb-4" size={32} />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Zalldi Gold</h3>
                <p className="text-neutral-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-widest">Premium Membership</p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-orange-500 font-black text-sm uppercase tracking-widest">Free Delivery Active</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NavTile icon={<MapPin/>} label="Addresses" color="bg-blue-500" />
              <NavTile icon={<Heart/>} label="Wishlist" color="bg-rose-500" />
              <NavTile icon={<User/>} label="Profile" color="bg-orange-500" />
              <NavTile icon={<HelpCircle/>} label="Support" color="bg-emerald-600" />
            </div>

            <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
               <div className="flex items-center gap-2 mb-3">
                  <Gift className="text-orange-600" size={18} />
                  <h4 className="text-xs font-black text-orange-900 uppercase tracking-widest">Refer & Earn</h4>
               </div>
               <p className="text-sm font-bold text-orange-800/80 leading-snug">
                 Invite a friend to Zalldi and you both get रू 100 in your wallet.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg, pulse }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm relative group overflow-hidden">
      <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-neutral-900 tracking-tighter">{value}</h3>
      {pulse && <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />}
    </div>
  );
}

function NavTile({ icon, label, color }) {
  return (
    <button className="bg-white border border-neutral-100 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 hover:border-orange-200 transition-all active:scale-95 group">
      <div className={`p-3 rounded-2xl ${color} text-white shadow-lg transition-transform group-hover:rotate-6`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">{label}</span>
    </button>
  );
}

