// src/pages/auth/ResetPassword.jsx

import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Check } from 'lucide-react'
import { confirmPasswordReset } from 'firebase/auth'
import { auth } from '@/config/firebase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { validatePassword } from '@/utils/validators'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  if (!oobCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Invalid Reset Link</h1>
          <p className="text-neutral-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary">Request New Link</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!validate()) return
    
    setLoading(true)
    
    try {
      await confirmPasswordReset(auth, oobCode, formData.password)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError('Failed to reset password. The link may have expired.')
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
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Create New Password</h1>
          <p className="text-neutral-600">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Password reset successfully! Redirecting to login...</span>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                disabled={success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-600 hover:text-neutral-800"
                disabled={success}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<Lock className="w-5 h-5" />}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                disabled={success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-neutral-600 hover:text-neutral-800"
                disabled={success}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={success}
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}