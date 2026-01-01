// src/pages/admin/Settings.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Save, RefreshCw, Bell, Mail, Shield, Truck, CreditCard, Globe } from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Switch from '@components/ui/Switch'
import Select from '@components/ui/Select'
import Tabs from '@components/ui/Tabs'
import Card from '@components/ui/Card'
import toast from 'react-hot-toast'

export default function Settings() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Zalldi',
      siteUrl: 'https://zalldi.com.np',
      supportEmail: 'support.zalldi@gmail.com',
      whatsappNumber: '+9779821072912',
      timezone: 'Asia/Kathmandu',
      language: 'en'
    },
    delivery: {
      standardTime: 60,
      expressTime: 30,
      standardFee: 50,
      expressFee: 100,
      freeDeliveryThreshold: 0,
      maxDeliveryRadius: 20,
      operatingHours: {
        open: '06:00',
        close: '23:00'
      }
    },
    payments: {
      enableCOD: true,
      enableEsewa: false,
      enableKhalti: false,
      esewaId: '',
      khaltiKey: ''
    },
    notifications: {
      enableEmail: true,
      enableSMS: false,
      enablePush: true,
      orderConfirmation: true,
      orderStatusUpdate: true,
      lowStockAlert: true,
      newOrderAlert: true
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8
    }
  })

  const handleSave = async (section) => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`${section} settings saved successfully`)
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleNestedChange = (section, parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }))
  }

  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-heading font-semibold text-neutral-800 mb-4">Site Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Site Name"
                value={settings.general.siteName}
                onChange={(e) => handleChange('general', 'siteName', e.target.value)}
              />
              <Input
                label="Site URL"
                value={settings.general.siteUrl}
                onChange={(e) => handleChange('general', 'siteUrl', e.target.value)}
              />
              <Input
                label="Support Email"
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
              />
              <Input
                label="WhatsApp Number"
                value={settings.general.whatsappNumber}
                onChange={(e) => handleChange('general', 'whatsappNumber', e.target.value)}
              />
              <Select
                label="Timezone"
                value={settings.general.timezone}
                onChange={(e) => handleChange('general', 'timezone', e.target.value)}
              >
                <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
              </Select>
              <Select
                label="Language"
                value={settings.general.language}
                onChange={(e) => handleChange('general', 'language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="ne">Nepali</option>
              </Select>
            </div>
            <div className="mt-6">
              <Button onClick={() => handleSave('General')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: Truck,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-heading font-semibold text-neutral-800 mb-4">Delivery Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Standard Delivery Time (minutes)"
                type="number"
                value={settings.delivery.standardTime}
                onChange={(e) => handleChange('delivery', 'standardTime', parseInt(e.target.value))}
              />
              <Input
                label="Express Delivery Time (minutes)"
                type="number"
                value={settings.delivery.expressTime}
                onChange={(e) => handleChange('delivery', 'expressTime', parseInt(e.target.value))}
              />
              <Input
                label="Standard Delivery Fee (NPR)"
                type="number"
                value={settings.delivery.standardFee}
                onChange={(e) => handleChange('delivery', 'standardFee', parseInt(e.target.value))}
              />
              <Input
                label="Express Delivery Fee (NPR)"
                type="number"
                value={settings.delivery.expressFee}
                onChange={(e) => handleChange('delivery', 'expressFee', parseInt(e.target.value))}
              />
              <Input
                label="Free Delivery Threshold (NPR)"
                type="number"
                value={settings.delivery.freeDeliveryThreshold}
                onChange={(e) => handleChange('delivery', 'freeDeliveryThreshold', parseInt(e.target.value))}
              />
              <Input
                label="Max Delivery Radius (km)"
                type="number"
                value={settings.delivery.maxDeliveryRadius}
                onChange={(e) => handleChange('delivery', 'maxDeliveryRadius', parseInt(e.target.value))}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-heading font-semibold text-neutral-800 mb-4">Operating Hours</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Opening Time"
                type="time"
                value={settings.delivery.operatingHours.open}
                onChange={(e) => handleNestedChange('delivery', 'operatingHours', 'open', e.target.value)}
              />
              <Input
                label="Closing Time"
                type="time"
                value={settings.delivery.operatingHours.close}
                onChange={(e) => handleNestedChange('delivery', 'operatingHours', 'close', e.target.value)}
              />
            </div>
            <div className="mt-6">
              <Button onClick={() => handleSave('Delivery')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-heading font-semibold text-neutral-800 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Cash on Delivery</h4>
                  <p className="text-body-sm text-neutral-600">Accept cash payments on delivery</p>
                </div>
                <Switch
                  checked={settings.payments.enableCOD}
                  onChange={(checked) => handleChange('payments', 'enableCOD', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">eSewa</h4>
                  <p className="text-body-sm text-neutral-600">Enable eSewa digital payments</p>
                </div>
                <Switch
                  checked={settings.payments.enableEsewa}
                  onChange={(checked) => handleChange('payments', 'enableEsewa', checked)}
                />
              </div>

              {settings.payments.enableEsewa && (
                <Input
                  label="eSewa Merchant ID"
                  value={settings.payments.esewaId}
                  onChange={(e) => handleChange('payments', 'esewaId', e.target.value)}
                  placeholder="Enter your eSewa merchant ID"
                />
              )}

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Khalti</h4>
                  <p className="text-body-sm text-neutral-600">Enable Khalti digital payments</p>
                </div>
                <Switch
                  checked={settings.payments.enableKhalti}
                  onChange={(checked) => handleChange('payments', 'enableKhalti', checked)}
                />
              </div>

              {settings.payments.enableKhalti && (
                <Input
                  label="Khalti Public Key"
                  value={settings.payments.khaltiKey}
                  onChange={(e) => handleChange('payments', 'khaltiKey', e.target.value)}
                  placeholder="Enter your Khalti public key"
                />
              )}
            </div>
            <div className="mt-6">
              <Button onClick={() => handleSave('Payment')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-heading font-semibold text-neutral-800 mb-4">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Email Notifications</h4>
                  <p className="text-body-sm text-neutral-600">Send notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.enableEmail}
                  onChange={(checked) => handleChange('notifications', 'enableEmail', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">SMS Notifications</h4>
                  <p className="text-body-sm text-neutral-600">Send notifications via SMS</p>
                </div>
                <Switch
                  checked={settings.notifications.enableSMS}
                  onChange={(checked) => handleChange('notifications', 'enableSMS', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Push Notifications</h4>
                  <p className="text-body-sm text-neutral-600">Send browser push notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.enablePush}
                  onChange={(checked) => handleChange('notifications', 'enablePush', checked)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-heading font-semibold text-neutral-800 mb-4">Notification Events</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Order Confirmation</h4>
                  <p className="text-body-sm text-neutral-600">Notify when order is placed</p>
                </div>
                <Switch
                  checked={settings.notifications.orderConfirmation}
                  onChange={(checked) => handleChange('notifications', 'orderConfirmation', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Order Status Update</h4>
                  <p className="text-body-sm text-neutral-600">Notify on status changes</p>
                </div>
                <Switch
                  checked={settings.notifications.orderStatusUpdate}
                  onChange={(checked) => handleChange('notifications', 'orderStatusUpdate', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Low Stock Alert</h4>
                  <p className="text-body-sm text-neutral-600">Alert suppliers on low stock</p>
                </div>
                <Switch
                  checked={settings.notifications.lowStockAlert}
                  onChange={(checked) => handleChange('notifications', 'lowStockAlert', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">New Order Alert</h4>
                  <p className="text-body-sm text-neutral-600">Alert suppliers on new orders</p>
                </div>
                <Switch
                  checked={settings.notifications.newOrderAlert}
                  onChange={(checked) => handleChange('notifications', 'newOrderAlert', checked)}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={() => handleSave('Notification')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-heading font-semibold text-neutral-800 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Email Verification</h4>
                  <p className="text-body-sm text-neutral-600">Require email verification on signup</p>
                </div>
                <Switch
                  checked={settings.security.requireEmailVerification}
                  onChange={(checked) => handleChange('security', 'requireEmailVerification', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-neutral-800">Two-Factor Authentication</h4>
                  <p className="text-body-sm text-neutral-600">Enable 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.security.enableTwoFactor}
                  onChange={(checked) => handleChange('security', 'enableTwoFactor', checked)}
                />
              </div>

              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                helperText="User will be logged out after this period of inactivity"
              />

              <Input
                label="Max Login Attempts"
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                helperText="Account will be locked after this many failed attempts"
              />

              <Input
                label="Password Minimum Length"
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
                helperText="Minimum characters required for passwords"
              />
            </div>
            <div className="mt-6">
              <Button onClick={() => handleSave('Security')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-display font-display font-bold text-neutral-800">Settings</h1>
                <p className="text-body text-neutral-600">Manage platform configuration</p>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs tabs={tabs} />
      </main>

      <Footer />
    </div>
  )
}