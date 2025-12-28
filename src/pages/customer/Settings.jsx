// src/pages/customer/Settings.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/ui/Button'
import Switch from '@components/ui/Switch'
import Modal from '@components/ui/Modal'
import LoadingScreen from '@components/shared/LoadingScreen'
import { updateUserSettings } from '@services/user.service'
import toast from 'react-hot-toast'
import { ArrowLeft, Bell, Mail, MessageSquare, LogOut, Trash2 } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser, logout } = useAuth()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
        smsNotifications: user.notifications.sms ?? false
      })
    }
  }, [user])
  
  if (authLoading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return null
  }
  
  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    setIsSaving(true)
    
    try {
      await updateUserSettings(user.uid, {
        notifications: newSettings
      })
      await refreshUser()
      toast.success('Settings updated')
    } catch (error) {
      console.error('Settings update error:', error)
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
      console.error('Logout error:', error)
      toast.error('Failed to logout')
      setIsLoggingOut(false)
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
            Settings
          </h1>
          <p className="text-neutral-600">
            Manage your preferences and account settings
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-900">
                  Notifications
                </h2>
                <p className="text-sm text-neutral-600">
                  Choose how you want to receive updates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="font-semibold text-neutral-900">Email Notifications</p>
                    <p className="text-sm text-neutral-600">Receive order updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="font-semibold text-neutral-900">Push Notifications</p>
                    <p className="text-sm text-neutral-600">Receive alerts on your device</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="font-semibold text-neutral-900">SMS Notifications</p>
                    <p className="text-sm text-neutral-600">Receive text messages for orders</p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">
              Account Actions
            </h2>

            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<LogOut className="w-5 h-5" />}
                onClick={() => setShowLogoutModal(true)}
                className="justify-start"
              >
                Logout
              </Button>

              <Button
                variant="outline"
                fullWidth
                leftIcon={<Trash2 className="w-5 h-5" />}
                onClick={() => setShowDeleteModal(true)}
                className="justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            Are you sure you want to logout?
          </p>
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
              loading={isLoggingOut}
              className="flex-1"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            Account deletion is permanent and cannot be undone. Please contact support to proceed.
          </p>
          <Button
            variant="outline"
            fullWidth
            onClick={() => setShowDeleteModal(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </motion.div>
  )
}