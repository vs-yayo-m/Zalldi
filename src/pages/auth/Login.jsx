import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { validateEmail, validatePassword } from '@/utils/validators';
import { APP_NAME } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Simple validation check
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      
      toast.success(`Logging you in...`);

      // We wait a brief moment for the AuthContext to finish fetching 
      // the user document from the standardized Firestore path
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/customer/dashboard';
        navigate(from, { replace: true });
      }, 800);

    } catch (err) {
      console.error("Login component error:", err);
      setError("Invalid email or password. Please try again.");
      toast.error('Login failed.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-orange-100">
      {/* Visual Side Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600 rounded-full blur-[120px] opacity-20" />
        </div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <Zap className="w-8 h-8 text-white fill-current" />
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
            Everything you need, <br />
            <span className="text-orange-500">Delivered in 60m.</span>
          </h2>
          <div className="space-y-4">
            {["Quality-checked fresh produce.", "Hyper-local delivery.", "Secure payments."].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-neutral-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#F9FAFB]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
             <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-orange-500 transition-colors mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-neutral-500 font-medium">Access your orders and dashboard.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-10 border border-neutral-100">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <Alert variant="error" className="rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold">{error}</span>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="w-5 h-5" />}
                placeholder="name@example.com"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[2.4rem] text-neutral-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="h-14 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl transition-all"
                fullWidth
                loading={loading}
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </div>
              </Button>
            </form>

            <div className="mt-8 text-center">
               <Link to="/register" className="text-sm font-bold text-neutral-500 hover:text-orange-500 transition-all">
                New here? <span className="text-orange-500">Create an Account</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

