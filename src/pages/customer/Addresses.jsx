// src/pages/customer/Addresses.jsx (REFACTORED - PRIORITY)

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, ArrowLeft, Home, Briefcase, Trash2, Edit3, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { updateUserAddresses } from '@/services/user.service'
import { validateAddress } from '@/utils/validators'
import { WARDS } from '@/utils/constants'

export default function Addresses() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser } = useAuth()
  
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAddress, setDeletingAddress] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/addresses', { replace: true })
    }
  }, [user, authLoading, navigate])

  const addresses = user?.addresses || []

  const handleEdit = (address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleDeleteClick = (address) => {
    setDeletingAddress(address)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingAddress) return
    
    setIsDeleting(true)
    try {
      const updatedAddresses = addresses.filter(a => a.id !== deletingAddress.id)
      
      if (deletingAddress.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true
      }
      
      await updateUserAddresses(user.uid, updatedAddresses)
      await refreshUser()
      
      toast.success('Address deleted')
      setShowDeleteModal(false)
      setDeletingAddress(null)
    } catch (error) {
      toast.error('Failed to delete address')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      const updatedAddresses = addresses.map(a => ({
        ...a,
        isDefault: a.id === addressId
      }))
      
      await updateUserAddresses(user.uid, updatedAddresses)
      await refreshUser()
      toast.success('Default address updated')
    } catch (error) {
      toast.error('Failed to update default address')
    }
  }

  if (authLoading) return <LoadingScreen />
  if (!user) return null

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50 pb-24 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-8">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-neutral-600 hover:text-orange-600 transition-colors font-semibold text-sm mb-4"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-neutral-900">Delivery Addresses</h1>
                <p className="text-neutral-600 mt-1">Manage your saved addresses</p>
              </div>
              {!showForm && (
                <Button
                  onClick={() => {
                    setEditingAddress(null)
                    setShowForm(true)
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus size={18} className="mr-2" /> Add New
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showForm ? (
              <AddressForm
                key="form"
                address={editingAddress}
                user={user}
                onSuccess={() => {
                  setShowForm(false)
                  setEditingAddress(null)
                }}
                onCancel={() => {
                  setShowForm(false)
                  setEditingAddress(null)
                }}
              />
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {addresses.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">No addresses saved</h3>
                    <p className="text-neutral-600 mb-6">Add your delivery address to get started</p>
                    <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
                      <Plus size={18} className="mr-2" /> Add Address
                    </Button>
                  </div>
                ) : (
                  addresses.map((address, index) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      index={index}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onSetDefault={handleSetDefault}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingAddress(null)
        }}
        title="Delete Address"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">Are you sure you want to delete this address?</p>
          {deletingAddress && (
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="font-semibold text-neutral-900">{deletingAddress.street}</p>
              <p className="text-sm text-neutral-600">
                {deletingAddress.area}, Ward {deletingAddress.ward}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setDeletingAddress(null)
              }}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function AddressCard({ address, index, onEdit, onDelete, onSetDefault }) {
  const typeIcons = {
    home: Home,
    work: Briefcase,
    other: MapPin
  }
  
  const TypeIcon = typeIcons[address.type] || MapPin

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl border-2 p-6 ${
        address.isDefault ? 'border-orange-500' : 'border-neutral-100'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            address.isDefault ? 'bg-orange-100' : 'bg-neutral-100'
          }`}>
            <TypeIcon className={`w-5 h-5 ${
              address.isDefault ? 'text-orange-600' : 'text-neutral-600'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-900 capitalize">{address.type}</h3>
              {address.isDefault && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(address)}
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          >
            <Edit3 size={16} className="text-neutral-600" />
          </button>
          <button
            onClick={() => onDelete(address)}
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="text-neutral-600 text-sm space-y-1 mb-4">
        <p className="font-medium">{address.street}</p>
        <p>{address.area}, Ward {address.ward}</p>
        {address.landmark && <p>Near {address.landmark}</p>}
      </div>

      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="text-orange-600 text-sm font-bold hover:text-orange-700 transition-colors"
        >
          Set as Default
        </button>
      )}
    </motion.div>
  )
}

function AddressForm({ address, user, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'home',
    ward: '',
    area: '',
    street: '',
    landmark: '',
    isDefault: false,
    ...address
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateAddress(formData)
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const addresses = user.addresses || []
      const newAddress = {
        ...formData,
        id: address?.id || `addr_${Date.now()}`,
        ward: Number(formData.ward)
      }

      let updatedAddresses
      if (address) {
        updatedAddresses = addresses.map(a => a.id === address.id ? newAddress : a)
      } else {
        updatedAddresses = [...addresses, newAddress]
      }

      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(a => ({
          ...a,
          isDefault: a.id === newAddress.id
        }))
      }

      await updateUserAddresses(user.uid, updatedAddresses)
      await user.refreshUser?.()
      
      toast.success(address ? 'Address updated' : 'Address added')
      onSuccess()
    } catch (error) {
      toast.error('Failed to save address')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-neutral-100 p-8"
    >
      <h2 className="text-xl font-black text-neutral-900 mb-6">
        {address ? 'Edit Address' : 'Add New Address'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-3">Address Type</label>
          <div className="grid grid-cols-3 gap-3">
            {['home', 'work', 'other'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('type', type)}
                className={`p-3 rounded-xl border-2 font-bold capitalize transition-all ${
                  formData.type === type
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Ward</label>
            <select
              value={formData.ward}
              onChange={(e) => handleChange('ward', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.ward ? 'border-red-300' : 'border-neutral-200'
              } focus:border-orange-500 focus:outline-none font-medium`}
              required
            >
              <option value="">Select Ward</option>
              {WARDS.map(w => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
            {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Area</label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="e.g., Traffic Chowk"
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.area ? 'border-red-300' : 'border-neutral-200'
              } focus:border-orange-500 focus:outline-none font-medium`}
              required
            />
            {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Street Address</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="House/Building name, Street"
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.street ? 'border-red-300' : 'border-neutral-200'
            } focus:border-orange-500 focus:outline-none font-medium`}
            required
          />
          {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Landmark (Optional)</label>
          <input
            type="text"
            value={formData.landmark}
            onChange={(e) => handleChange('landmark', e.target.value)}
            placeholder="e.g., Near City Mall"
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => handleChange('isDefault', e.target.checked)}
            className="w-5 h-5 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
          />
          <label htmlFor="isDefault" className="text-sm font-bold text-neutral-700">
            Set as default address
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  )
}