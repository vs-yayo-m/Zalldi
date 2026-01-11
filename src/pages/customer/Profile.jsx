// src/pages/customer/Profile.jsx (REFACTORED - CLEAN)

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, ArrowLeft, Save, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { validateName, validatePhone } from '@/utils/validators'
import { updateUserProfile } from '@/services/user.service'

export default function Profile() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser } = useAuth()
  
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
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
        phoneNumber: user.phoneNumber || ''
      })
    }
  }, [user])
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
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
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (authLoading) return <LoadingScreen />
  if (!user) return null
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 pb-24 pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-8">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-neutral-600 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-neutral-900">Account Profile</h1>
            <p className="text-neutral-600 mt-1">Manage your personal information</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex items-center gap-6 pb-6 border-b border-neutral-100">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      (formData.displayName || user.email || 'Z').charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                  >
                    <Camera size={16} className="text-neutral-600" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">Profile Picture</h3>
                  <p className="text-sm text-neutral-600">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                        errors.displayName ? 'border-red-300' : 'border-neutral-200'
                      } focus:border-orange-500 focus:outline-none font-medium`}
                      required
                    />
                  </div>
                  {errors.displayName && (
                    <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-neutral-200 bg-neutral-100 font-medium text-neutral-600 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="98XXXXXXXX"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                        errors.phoneNumber ? 'border-red-300' : 'border-neutral-200'
                      } focus:border-orange-500 focus:outline-none font-medium`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button
                  type="submit"
                  disabled={!hasChanges || isSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-200 disabled:text-neutral-400"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      displayName: user.displayName || '',
                      phoneNumber: user.phoneNumber || ''
                    })
                    setHasChanges(false)
                    setErrors({})
                  }}
                  disabled={!hasChanges || isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}