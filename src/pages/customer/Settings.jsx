// src/pages/customer/Settings.jsx (REFACTORED - CLEAN)

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, LogOut, ArrowLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Switch from '@/components/ui/Switch'
import Modal from '@/components/ui/Modal'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { updateUserSettings } from '@/services/user.service'

export default function Settings() {
  const navigate = useNavigate()
  const { user, loading: authLoading, logout } = useAuth()
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/settings', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  useEffect(() => {
    if (user?.notifications) {
      setSettings({
        emailNotifications: user.notifications.email ?? true,
        pushNotifications: user.notifications.push ?? true,
        smsNotifications: user.notifications.sms ?? false,
        orderUpdates: user.notifications.orderUpdates ?? true,
        promotions: user.notifications.promotions ?? true
      })
    }
  }, [user])
  
  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    setIsSaving(true)
    
    try {
      await updateUserSettings(user.uid, { notifications: newSettings })
      toast.success('Settings updated')
    } catch (error) {
      toast.error('Failed to update settings')
      setSettings(settings)
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error('Failed to logout')
      setIsLoggingOut(false)
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
            <h1 className="text-3xl font-black text-neutral-900">Settings</h1>
            <p className="text-neutral-600 mt-1">Manage your preferences</p>
          </div>

          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-neutral-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-neutral-900">Notifications</h2>
                  <p className="text-sm text-neutral-600">Choose how you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <SettingItem
                  label="Email Notifications"
                  description="Receive order updates via email"
                  checked={settings.emailNotifications}
                  onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  disabled={isSaving}
                />

                <SettingItem
                  label="Push Notifications"
                  description="Get alerts on your device"
                  checked={settings.pushNotifications}
                  onChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  disabled={isSaving}
                />

                <SettingItem
                  label="SMS Notifications"
                  description="Receive text messages for orders"
                  checked={settings.smsNotifications}
                  onChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  disabled={isSaving}
                />

                <div className="border-t border-neutral-100 my-6 pt-6">
                  <h3 className="text-sm font-black text-neutral-700 mb-4">Content Preferences</h3>
                  
                  <div className="space-y-4">
                    <SettingItem
                      label="Order Updates"
                      description="Status changes and delivery updates"
                      checked={settings.orderUpdates}
                      onChange={(checked) => handleSettingChange('orderUpdates', checked)}
                      disabled={isSaving}
                    />

                    <SettingItem
                      label="Promotions & Offers"
                      description="Special deals and discounts"
                      checked={settings.promotions}
                      onChange={(checked) => handleSettingChange('promotions', checked)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 p-8">
              <h2 className="text-xl font-black text-neutral-900 mb-4">Account Actions</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-neutral-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <LogOut size={18} className="text-neutral-600 group-hover:text-orange-600 transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-900">Logout</p>
                      <p className="text-sm text-neutral-600">Sign out of your account</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => toast.info('Contact support to delete your account')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-red-100 hover:border-red-300 hover:bg-red-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <Trash2 size={18} className="text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-red-600">Delete Account</p>
                      <p className="text-sm text-red-500">Permanently remove your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">Are you sure you want to logout?</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

const SettingItem = ({ label, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
    <div>
      <p className="font-bold text-neutral-900 text-sm">{label}</p>
      <p className="text-xs text-neutral-600">{description}</p>
    </div>
    <Switch checked={checked} onChange={onChange} disabled={disabled} />
  </div>
)