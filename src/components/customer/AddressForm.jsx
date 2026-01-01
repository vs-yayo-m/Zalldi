// src/components/customer/AddressForm.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home, Briefcase } from 'lucide-react'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { useAuth } from '@hooks/useAuth'
import { useUser } from '@hooks/useUsers'
import { WARDS, ADDRESS_TYPES } from '@utils/constants'
import { validateAddress } from '@utils/validators'
import toast from 'react-hot-toast'

export default function AddressForm({ initialData = null, onSuccess, onCancel }) {
  const { user } = useAuth()
  const { addAddress, updateAddress } = useUser(user?.uid)
  
  const [formData, setFormData] = useState({
    type: initialData?.type || 'home',
    ward: initialData?.ward || '',
    area: initialData?.area || '',
    street: initialData?.street || '',
    landmark: initialData?.landmark || '',
    isDefault: initialData?.isDefault || false
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
      if (initialData?.id) {
        await updateAddress(initialData.id, formData)
        toast.success('Address updated successfully')
      } else {
        const newAddress = await addAddress(formData)
        toast.success('Address added successfully')
        if (onSuccess) onSuccess(newAddress)
      }
    } catch (error) {
      toast.error('Failed to save address')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const addressTypeIcons = {
    home: Home,
    work: Briefcase,
    other: MapPin
  }
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-6 overflow-visible"
    >
      {/* Address Type */}
      <div>
        <label className="block text-body-sm font-medium text-neutral-700 mb-3">
          Address Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ADDRESS_TYPES.map(type => {
            const Icon = addressTypeIcons[type.value]
            const isSelected = formData.type === type.value

            return (
              <motion.button
                key={type.value}
                type="button"
                onClick={() => handleChange('type', type.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-neutral-200 hover:border-orange-200'
                  }
                `}
              >
                <Icon className={`
                  w-6 h-6 mx-auto mb-2
                  ${isSelected ? 'text-orange-600' : 'text-neutral-400'}
                `} />
                <span className={`
                  text-body-sm font-medium
                  ${isSelected ? 'text-orange-600' : 'text-neutral-600'}
                `}>
                  {type.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Ward & Area */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* ✅ Native HTML Select for Ward */}
        <div className="flex flex-col">
          <label className="block text-body-sm font-medium text-neutral-700 mb-2">
            Ward Number
          </label>
          <select
            value={formData.ward}
            onChange={(e) => handleChange('ward', e.target.value)}
            className={`w-full p-2 border rounded-md transition-colors focus:outline-none
              ${errors.ward ? 'border-red-500' : 'border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'}
            `}
            required
          >
            <option value="">Select Ward</option>
            {WARDS.map(ward => (
              <option key={ward.value} value={ward.value}>
                {ward.label}
              </option>
            ))}
          </select>
          {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
        </div>

        <Input
          label="Area/Locality"
          placeholder="e.g., Traffic Chowk"
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
          error={errors.area}
          required
        />
      </div>

      {/* Street */}
      <Input
        label="Street/House Number"
        placeholder="e.g., Main Road, House #25"
        value={formData.street}
        onChange={(e) => handleChange('street', e.target.value)}
        error={errors.street}
        required
      />

      {/* Landmark */}
      <Input
        label="Landmark (Optional)"
        placeholder="e.g., Near Hospital"
        value={formData.landmark}
        onChange={(e) => handleChange('landmark', e.target.value)}
      />

      {/* Default Address Toggle */}
      <motion.label
        className="flex items-center space-x-3 p-4 rounded-xl border border-neutral-200 hover:border-orange-200 cursor-pointer transition-all"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => handleChange('isDefault', e.target.checked)}
          className="w-5 h-5 text-orange-500 border-neutral-300 rounded focus:ring-orange-500 focus:ring-2"
        />
        <span className="text-body-sm font-medium text-neutral-700">
          Set as default address
        </span>
      </motion.label>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Address' : 'Save Address'}
        </Button>
      </div>
    </motion.form>
  )
}