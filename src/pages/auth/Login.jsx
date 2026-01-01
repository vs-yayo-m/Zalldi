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
import { APP_NAME } from '@/utils/constants'; // Added missing import

/**
 * ZALLDI PREMIUM AUTHENTICATION
 * A high-performance login gateway with immersive brand storytelling.
 */

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
  
  const from = location.state?.from?.pathname || '/';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-orange-100">
      {/* 1. Left Side: Brand Storytelling (Visible on MD+) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 items-center justify-center p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600 rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-400 rounded-full blur-[100px] opacity-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/40">
            <Zap className="w-8 h-8 text-white fill-current" />
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
            Everything you need, <br />
            <span className="text-orange-500">Delivered in 60m.</span>
          </h2>
          <div className="space-y-6">
            {[
              "Hyper-local grocery delivery across Butwal.",
              "Quality-checked fresh produce from dark stores.",
              "The fastest checkout experience in Nepal."
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-neutral-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Abstract Pattern Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* 2. Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#F9FAFB]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo Only */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-block">
              <div className="font-display font-black text-4xl tracking-tighter">
                <span className="text-orange-500">Zal</span>
                <span className="text-neutral-900">ldi</span>
              </div>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
             <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-orange-500 transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-neutral-500 font-medium">Login to access your orders and profile.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-200/50 p-8 md:p-10 border border-neutral-100">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Alert variant="error" className="rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold">{error}</span>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="w-5 h-5" />}
                  placeholder="name@example.com"
                  className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="space-y-1 relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="••••••••"
                  className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[2.4rem] text-neutral-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-neutral-300 transition-all checked:bg-orange-500 checked:border-orange-500"
                    />
                    <CheckCircle2 className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm font-bold text-neutral-500 group-hover:text-neutral-700 transition-colors">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="h-14 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98]"
                fullWidth
                loading={loading}
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </div>
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-neutral-400">
                <span className="bg-white px-4">New to {APP_NAME}?</span>
              </div>
            </div>

            <div className="mt-8">
               <Link
                to="/register"
                className="flex items-center justify-center w-full h-12 border-2 border-neutral-100 hover:border-orange-500 text-neutral-600 hover:text-orange-600 font-bold rounded-2xl transition-all"
              >
                Create an Account
              </Link>
            </div>
          </div>

          <p className="text-center text-[11px] font-bold text-neutral-400 mt-10 uppercase tracking-widest">
            Protected by Zalldi Shield <span className="text-neutral-300">•</span>{' '}
            <Link to="/terms-conditions" className="hover:text-orange-500">Terms</Link>{' '}
            <span className="text-neutral-300">&</span>{' '}
            <Link to="/privacy-policy" className="hover:text-orange-500">Privacy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

