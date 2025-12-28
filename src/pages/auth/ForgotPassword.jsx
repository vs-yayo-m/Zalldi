// src/pages/auth/ForgotPassword.jsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { validateEmail } from '@/utils/validators'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }
    
    setLoading(true)
    
    try {
      await resetPassword(email)
      setSuccess(true)
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
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Reset Password</h1>
          <p className="text-neutral-600">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6">
              Password reset link sent! Check your email inbox.
            </Alert>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                placeholder="your@email.com"
                autoComplete="email"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon={<Send className="w-5 h-5" />}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-neutral-600">
                Didn't receive the email?
              </p>
              <Button
                onClick={() => setSuccess(false)}
                variant="outline"
                size="lg"
                fullWidth
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}