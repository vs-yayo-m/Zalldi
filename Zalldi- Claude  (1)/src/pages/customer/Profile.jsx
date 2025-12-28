// src/pages/customer/Profile.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Alert from '@components/ui/Alert'
import LoadingScreen from '@components/shared/LoadingScreen'
import { validateName, validatePhone, validateEmail } from '@utils/validators'
import { updateUserProfile } from '@services/user.service'
import toast from 'react-hot-toast'
import { User, Mail, Phone, ArrowLeft, Save } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/profile', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      })
    }
  }, [user])
  
  if (authLoading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return null
  }
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    setError(null)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    const validationErrors = {}
    
    const nameError = validateName(formData.displayName, 'Name')
    if (nameError) validationErrors.displayName = nameError
    
    if (formData.phoneNumber) {
      const phoneError = validatePhone(formData.phoneNumber)
      if (phoneError) validationErrors.phoneNumber = phoneError
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber || null
      })
      
      await refreshUser()
      setHasChanges(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err.message || 'Failed to update profile')
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-50 py-8 sm:py-12"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Dashboard
          </Button>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-neutral-600">
            Manage your account information
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
        >
          {error && (
            <Alert variant="error" onClose={() => setError(null)} className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {(formData.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <Input
              label="Full Name"
              value={formData.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              placeholder="Enter your full name"
              error={errors.displayName}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              leftIcon={<Mail className="w-5 h-5" />}
              disabled
              helper="Email cannot be changed"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              leftIcon={<Phone className="w-5 h-5" />}
              placeholder="98XXXXXXXX"
              error={errors.phoneNumber}
            />

            <div className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    displayName: user.displayName || '',
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || ''
                  })
                  setHasChanges(false)
                  setErrors({})
                }}
                disabled={!hasChanges || isSubmitting}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!hasChanges || isSubmitting}
                loading={isSubmitting}
                leftIcon={<Save className="w-5 h-5" />}
                className="flex-1"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div>
                  <p className="font-semibold text-neutral-900">Account Created</p>
                  <p className="text-sm text-neutral-600">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div>
                  <p className="font-semibold text-neutral-900">Total Orders</p>
                  <p className="text-sm text-neutral-600">{user.orderCount || 0} orders</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}