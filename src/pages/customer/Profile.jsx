// src/pages/customer/Profile.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  Save, 
  Camera, 
  ShieldCheck, 
  Calendar, 
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Edit3,
  Award,
  TrendingUp,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { validateName, validatePhone } from '@/utils/validators';
import { updateUserProfile } from '@/services/user.service';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/profile', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const stats = React.useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrder: 0,
        memberSince: user?.createdAt || new Date()
      };
    }

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrder = totalSpent / totalOrders;

    return {
      totalOrders,
      totalSpent,
      averageOrder,
      memberSince: user?.createdAt || new Date()
    };
  }, [orders, user]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    setError(null);
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const validationErrors = {};
    const nameError = validateName(formData.displayName, 'Name');
    if (nameError) validationErrors.displayName = nameError;
    
    if (formData.phoneNumber) {
      const phoneError = validatePhone(formData.phoneNumber);
      if (phoneError) validationErrors.phoneNumber = phoneError;
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user?.uid) throw new Error("User session expired");
      
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber || null
      });
      
      await refreshUser();
      setHasChanges(false);
      toast.success('Profile updated successfully!', {
        icon: '🧡',
        style: {
          borderRadius: '12px',
          background: '#FF6B35',
          color: '#fff',
          fontWeight: 'bold'
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      toast.error('Update failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || ordersLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#F8F9FA] pb-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <button
                onClick={() => navigate('/customer/dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
              >
                <ArrowLeft size={18} /> Back to Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Account <span className="text-orange-500">Profile</span>
              </h1>
              <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
            </motion.div>

            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Unsaved Changes</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-8 space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
                {error && (
                  <Alert variant="error" className="mb-8 rounded-2xl">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                    <div 
                      className="relative group cursor-pointer"
                      onMouseEnter={() => setIsHoveringAvatar(true)}
                      onMouseLeave={() => setIsHoveringAvatar(false)}
                    >
                      <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-orange-100 transform group-hover:rotate-3 transition-all duration-300">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-3xl" />
                        ) : (
                          (formData.displayName || user.email || 'Z').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className={`absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                        <Camera className="text-white" size={24} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-lg border border-gray-100">
                        <ShieldCheck className="text-green-500" size={20} />
                      </div>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Profile Picture</h3>
                      <p className="text-gray-500 text-sm mb-3">PNG, JPG up to 5MB</p>
                      <div className="flex gap-2">
                        <button type="button" className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                          <Camera size={14} /> Update Photo
                        </button>
                        <button type="button" className="text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => handleChange('displayName', e.target.value)}
                          placeholder="Enter your full name"
                          className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-gray-50/50 focus:bg-white transition-all font-semibold text-gray-900 ${
                            errors.displayName ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-orange-500'
                          }`}
                          required
                        />
                      </div>
                      {errors.displayName && (
                        <p className="text-red-500 text-sm mt-2 font-medium">{errors.displayName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail size={20} />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-100 opacity-70 cursor-not-allowed font-semibold text-gray-600"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500" /> Verified
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Phone Number</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                          <Phone size={20} />
                        </div>
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleChange('phoneNumber', e.target.value)}
                          placeholder="98XXXXXXXX"
                          className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-gray-50/50 focus:bg-white transition-all font-semibold text-gray-900 ${
                            errors.phoneNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-orange-500'
                          }`}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-2 font-medium">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={!hasChanges || isSubmitting}
                      className={`flex-grow py-4 rounded-2xl text-lg font-bold shadow-lg transition-all ${
                        hasChanges && !isSubmitting ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2 justify-center">
                          <RefreshCw className="animate-spin" size={20} /> Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          <Save size={20} /> Save Changes
                        </span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setFormData({
                          displayName: user.displayName || '',
                          email: user.email || '',
                          phoneNumber: user.phoneNumber || ''
                        });
                        setHasChanges(false);
                        setErrors({});
                      }}
                      disabled={!hasChanges || isSubmitting}
                      className="sm:w-32 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 font-bold text-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-6"
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200 overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-orange-100 font-bold uppercase tracking-widest text-[10px] mb-2">Member Status</p>
                      <h4 className="text-3xl font-black flex items-center gap-2">
                        <Award size={28} /> Premium
                      </h4>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-orange-100 uppercase font-bold tracking-wider">Total Orders</p>
                          <p className="text-2xl font-black">{stats.totalOrders}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <TrendingUp size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-orange-100 uppercase font-bold tracking-wider">Total Spent</p>
                          <p className="text-2xl font-black">{formatCurrency(stats.totalSpent)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-orange-100 uppercase font-bold tracking-wider">Member Since</p>
                          <p className="text-lg font-black">
                            {formatDate(stats.memberSince?.toDate ? stats.memberSince.toDate() : stats.memberSince, 'MMM yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-500" /> Security & Privacy
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-50 text-green-700">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-bold">Email Verified</span>
                  </div>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-red-600">Delete Account</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}