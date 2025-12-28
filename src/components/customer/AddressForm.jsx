// src/components/customer/AddressForm.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home, Briefcase, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
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
  
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-3">
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
                      : 'border-neutral-200 hover:border-orange-300'
                  }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Ward"
          value={formData.ward}
          onChange={(e) => handleChange('ward', e.target.value)}
          error={errors.ward}
          required
        >
          <option value="">Select Ward</option>
          {WARDS.map((ward) => (
            <option key={ward.value} value={ward.value}>
              {ward.label}
            </option>
          ))}
        </Select>

        <Input
          label="Area"
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
          error={errors.area}
          required
        />
      </div>

      <Input
        label="Street Address"
        value={formData.street}
        onChange={(e) => handleChange('street', e.target.value)}
        error={errors.street}
        required
      />

      <Input
        label="Landmark (Optional)"
        value={formData.landmark}
        onChange={(e) => handleChange('landmark', e.target.value)}
      />

      <Radio
        label="Set as default address"
        checked={formData.isDefault}
        onChange={(e) => handleChange('isDefault', e.target.checked)}
      />

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