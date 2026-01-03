// src/pages/customer/Settings.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Switch from '@/components/ui/Switch'
import Modal from '@/components/ui/Modal'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { updateUserSettings } from '@/services/user.service'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  Bell, 
  Mail, 
  MessageSquare, 
  LogOut, 
  Trash2,
  ShieldCheck,
  Lock,
  Eye,
  Globe,
  Moon,
  Sun,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser, logout } = useAuth()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [activeSection, setActiveSection] = useState('notifications')
  
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
        promotions: user.notifications.promotions ?? true,
        newsletter: user.notifications.newsletter ?? false
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
      toast.success('Settings updated', {
        icon: '✓',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
          fontWeight: 'bold'
        }
      })
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

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
    { id: 'account', label: 'Account Actions', icon: LogOut }
  ]
  
  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#F8F9FA] pb-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
              Settings <span className="text-orange-500">& Preferences</span>
            </h1>
            <p className="text-gray-600 font-medium">
              Customize your Zalldi experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sticky top-24">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                        activeSection === section.id
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <section.icon size={20} />
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-9 space-y-6"
            >
              
              <AnimatePresence mode="wait">
                {activeSection === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                        <Bell className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">
                          Notification Preferences
                        </h2>
                        <p className="text-sm text-gray-600 font-medium">
                          Choose how you want to receive updates
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <SettingItem
                        icon={<Mail size={20} />}
                        label="Email Notifications"
                        description="Receive order updates via email"
                        checked={settings.emailNotifications}
                        onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                        disabled={isSaving}
                      />

                      <SettingItem
                        icon={<Bell size={20} />}
                        label="Push Notifications"
                        description="Receive alerts on your device"
                        checked={settings.pushNotifications}
                        onChange={(checked) => handleSettingChange('pushNotifications', checked)}
                        disabled={isSaving}
                      />

                      <SettingItem
                        icon={<MessageSquare size={20} />}
                        label="SMS Notifications"
                        description="Receive text messages for orders"
                        checked={settings.smsNotifications}
                        onChange={(checked) => handleSettingChange('smsNotifications', checked)}
                        disabled={isSaving}
                      />

                      <div className="border-t border-gray-100 my-6 pt-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                          Content Preferences
                        </h3>
                        
                        <div className="space-y-4">
                          <SettingItem
                            icon={<CheckCircle2 size={20} />}
                            label="Order Updates"
                            description="Get notified about your order status"
                            checked={settings.orderUpdates}
                            onChange={(checked) => handleSettingChange('orderUpdates', checked)}
                            disabled={isSaving}
                          />

                          <SettingItem
                            icon={<Smartphone size={20} />}
                            label="Promotions & Offers"
                            description="Receive special deals and discounts"
                            checked={settings.promotions}
                            onChange={(checked) => handleSettingChange('promotions', checked)}
                            disabled={isSaving}
                          />

                          <SettingItem
                            icon={<Mail size={20} />}
                            label="Newsletter"
                            description="Weekly updates and product news"
                            checked={settings.newsletter}
                            onChange={(checked) => handleSettingChange('newsletter', checked)}
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">
                          Privacy & Security
                        </h2>
                        <p className="text-sm text-gray-600 font-medium">
                          Manage your account security
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-green-50 border-2 border-green-100">
                        <div className="flex items-start gap-4">
                          <CheckCircle2 className="text-green-600 mt-1" size={24} />
                          <div>
                            <h3 className="font-black text-green-900 mb-1">Email Verified</h3>
                            <p className="text-sm text-green-700 font-medium">
                              Your email address has been verified and is secure
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            <Lock size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-500 font-medium">Update your account password</p>
                          </div>
                        </div>
                      </button>

                      <button className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Eye size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-gray-900">Privacy Settings</p>
                            <p className="text-sm text-gray-500 font-medium">Control who sees your information</p>
                          </div>
                        </div>
                      </button>

                      <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                          <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                          <div>
                            <p className="text-sm font-bold text-blue-900 mb-1">Your data is safe</p>
                            <p className="text-xs text-blue-700 font-medium">
                              We use enterprise-grade encryption to protect your information
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                        <LogOut className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">
                          Account Actions
                        </h2>
                        <p className="text-sm text-gray-600 font-medium">
                          Manage your account settings
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            <LogOut size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-gray-900">Logout</p>
                            <p className="text-sm text-gray-500 font-medium">Sign out of your account</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:bg-red-50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                            <Trash2 size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-red-600">Delete Account</p>
                            <p className="text-sm text-red-500 font-medium">Permanently remove your account</p>
                          </div>
                        </div>
                      </button>

                      <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-100 rounded-2xl">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                          <div>
                            <p className="text-sm font-bold text-yellow-900 mb-1">Important</p>
                            <p className="text-xs text-yellow-700 font-medium">
                              Account deletion is permanent and cannot be undone. All your data will be lost.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        </div>
      </motion.div>
      <Footer />

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-gray-600 font-medium">
            Are you sure you want to logout from your account?
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="flex-1 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              loading={isLoggingOut}
              className="flex-1 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold"
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
          <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl">
            <p className="text-red-700 font-bold text-sm">
              ⚠️ This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
          <p className="text-gray-600 font-medium">
            To delete your account, please contact our support team at <span className="font-bold text-orange-600">support.zalldi@gmail.com</span>
          </p>
          <Button
            variant="outline"
            fullWidth
            onClick={() => setShowDeleteModal(false)}
            className="rounded-xl font-bold"
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}

const SettingItem = ({ icon, label, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-4 flex-1">
      <div className="text-gray-600">
        {icon}
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500 font-medium">{description}</p>
      </div>
    </div>
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
)