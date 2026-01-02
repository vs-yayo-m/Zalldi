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
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Existing project architecture imports
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { validateName, validatePhone } from '../../utils/validators';
import { updateUserProfile } from '../../services/user.service';

/**
 * ZALLDI - Enterprise Profile Component
 * Enhanced with Framer Motion, micro-interactions, and Blinkit-style account stats.
 */

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  // State Management
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

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/profile', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  // Detect unsaved changes for the "Save" button visibility
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
      // Enterprise pattern: ensure user ID exists before service call
      if (!user?.uid) throw new Error("User session expired");
      
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber || null
      });
      
      await refreshUser();
      setHasChanges(false);
      toast.success('Profile updated successfully!', {
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
        icon: '🧡'
      });
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      toast.error('Update failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9FA] pb-20 pt-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
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
              Account <span className="text-orange-500">Settings</span>
            </h1>
            <p className="text-gray-500 mt-1">Manage your digital identity at Zalldi</p>
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
          
          {/* LEFT COLUMN: Profile Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
              {error && (
                <Alert variant="error" className="mb-8 rounded-2xl">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-gray-50">
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
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900">Profile Picture</h3>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 5MB. Will be visible across Zalldi.</p>
                    <div className="flex gap-2 mt-3">
                      <button type="button" className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">Update Photo</button>
                      <button type="button" className="text-xs font-bold text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Identity</label>
                    <Input
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                      leftIcon={<User className="text-orange-500" size={20} />}
                      placeholder="Enter your full name"
                      error={errors.displayName}
                      className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Verified Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      leftIcon={<Mail className="text-gray-400" size={20} />}
                      disabled
                      className="rounded-2xl bg-gray-100 opacity-70 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contact Number</label>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      leftIcon={<Phone className="text-orange-500" size={20} />}
                      placeholder="98XXXXXXXX"
                      error={errors.phoneNumber}
                      className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={!hasChanges || isSubmitting}
                    className={`flex-grow py-4 rounded-2xl text-lg font-bold shadow-lg transition-all ${
                      hasChanges ? 'bg-orange-600 shadow-orange-200' : 'bg-gray-200'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Syncing...</span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center"><Save size={20} /> Save Changes</span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
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
                    className="sm:w-32 rounded-2xl border-gray-200 font-bold text-gray-500"
                  >
                    Discard
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Account Insights */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Stats Card */}
            <div className="bg-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-100 overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-orange-200 font-bold uppercase tracking-widest text-[10px] mb-4">Loyalty Overview</p>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-4xl font-black">#{user.orderCount || 0}</h4>
                    <p className="text-orange-100 text-sm font-medium">Orders Placed</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ShoppingBag size={24} />
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <Calendar size={18} className="text-orange-200" />
                  <div>
                    <p className="text-xs text-orange-200 uppercase font-bold tracking-wider leading-none mb-1">Customer Since</p>
                    <p className="font-bold text-sm">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Trust & Safety</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-50 text-green-700">
                  <CheckCircle2 size={18} />
                  <span className="text-xs font-bold">Email Verified</span>
                </div>
                <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                      <Trash2 size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">Delete Account</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;

