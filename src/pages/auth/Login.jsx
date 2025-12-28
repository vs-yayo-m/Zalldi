// src/pages/auth/Login.jsx

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { validateEmail, validatePassword } from '@/utils/validators'
import { getDefaultRouteForRole } from '@/config/routes'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const from = location.state?.from?.pathname || '/'
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError
    
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!validate()) return
    
    setLoading(true)
    
    try {
      await login(formData.email, formData.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="font-display font-bold text-4xl">
              <span className="text-orange-500">Zal</span>
              <span className="text-neutral-800">ldi</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Welcome Back</h1>
          <p className="text-neutral-600">Login to your account to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-600 hover:text-neutral-800"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={<LogIn className="w-5 h-5" />}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Create Account
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-neutral-600 mt-6">
          By continuing, you agree to our{' '}
          <Link to="/terms-conditions" className="text-orange-500 hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="text-orange-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  )
}