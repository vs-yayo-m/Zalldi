// src/components/customer/AddressForm.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Home, Briefcase, Save, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Radio from '@components/ui/Radio'

import { WARDS, ADDRESS_TYPES } from '@utils/constants'
import { validateAddress } from '@utils/validators'
import { userService } from '@services/user.service'

export default function AddressForm({
  address = null,
  onSave,
  onCancel,
  userId
}) {
  const [formData, setFormData] = useState({
    type: address?.type || 'home',
    ward: address?.ward || '',
    area: address?.area || '',
    street: address?.street || '',
    landmark: address?.landmark || '',
    isDefault: address?.isDefault || false
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [wardOpen, setWardOpen] = useState(false)
  
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
    
    setLoading(true)
    try {
      if (address?.id) {
        await userService.updateAddress(userId, address.id, formData)
        toast.success('Address updated successfully')
      } else {
        await userService.addAddress(userId, formData)
        toast.success('Address added successfully')
      }
      onSave?.()
    } catch (error) {
      toast.error(error.message || 'Failed to save address')
    } finally {
      setLoading(false)
    }
  }
  
  const selectedWard = WARDS.find(w => w.value === formData.ward)
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="space-y-6"
    >
      {/* ADDRESS TYPE */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Address Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ADDRESS_TYPES.map((type) => {
            const Icon =
              type.icon === 'Home'
                ? Home
                : type.icon === 'Briefcase'
                ? Briefcase
                : MapPin

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange('type', type.value)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 transition
                  ${
                    formData.type === type.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-neutral-200'
                  }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* WARD – BLINKIT STYLE */}
      <div className="relative">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Ward
        </label>

        <button
          type="button"
          onClick={() => setWardOpen(prev => !prev)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border
            ${errors.ward ? 'border-red-500' : 'border-neutral-300'}`}
        >
          <span className={selectedWard ? 'text-neutral-800' : 'text-neutral-400'}>
            {selectedWard ? selectedWard.label : 'Select Ward'}
          </span>
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        </button>

        {errors.ward && (
          <p className="text-xs text-red-500 mt-1">{errors.ward}</p>
        )}

        <AnimatePresence>
          {wardOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border bg-white shadow-lg"
            >
              {WARDS.map((ward) => (
                <button
                  key={ward.value}
                  type="button"
                  onClick={() => {
                    handleChange('ward', ward.value)
                    setWardOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition"
                >
                  {ward.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AREA */}
      <Input
        label="Area"
        value={formData.area}
        onChange={(e) => handleChange('area', e.target.value)}
        error={errors.area}
        required
      />

      {/* STREET */}
      <Input
        label="Street Address"
        value={formData.street}
        onChange={(e) => handleChange('street', e.target.value)}
        error={errors.street}
        required
      />

      {/* LANDMARK */}
      <Input
        label="Landmark (Optional)"
        value={formData.landmark}
        onChange={(e) => handleChange('landmark', e.target.value)}
      />

      {/* DEFAULT */}
      <Radio
        label="Set as default address"
        checked={formData.isDefault}
        onChange={(e) => handleChange('isDefault', e.target.checked)}
      />

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving…' : address ? 'Update Address' : 'Save Address'}
        </Button>
      </div>
    </motion.form>
  )
}