// src/components/customer/AddressForm.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home, Briefcase, Lock } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { useUser } from '../../hooks/useUsers'
import { WARDS, ADDRESS_TYPES } from '../../utils/constants'
import { validateAddress } from '../../utils/validators'
import toast from 'react-hot-toast'

export default function AddressForm({ initialData = null, onSuccess, onCancel }) {
  const { user } = useAuth()
  const { addAddress, updateAddress } = useUser(user?.uid)
  
  const [formData, setFormData] = useState({
    type: initialData?.type || 'home',
    city: 'Butwal', // Locked to Butwal
    ward: initialData?.ward || '',
    area: initialData?.area || '',
    street: initialData?.street || '',
    houseNo: initialData?.houseNo || '', // New field
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
    
    // We pass a sanitized version for validation if needed, 
    // ensuring street/houseNo combo satisfies existing validation logic
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
      {/* Address Type Selection */}
      <div>
        <label className="block text-sm font-bold text-neutral-700 mb-3">
          Save Address As
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
                  p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center
                  ${isSelected 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-neutral-100 bg-white hover:border-orange-200'
                  }
                `}
              >
                <Icon className={`
                  w-6 h-6 mb-2
                  ${isSelected ? 'text-orange-600' : 'text-neutral-400'}
                `} />
                <span className={`
                  text-xs font-bold uppercase tracking-tight
                  ${isSelected ? 'text-orange-600' : 'text-neutral-600'}
                `}>
                  {type.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* City (Locked) & Ward Number */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            City
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.city}
              readOnly
              className="w-full p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 font-medium cursor-not-allowed outline-none"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1 font-bold uppercase">Currently only serving Butwal</p>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Ward Number
          </label>
          <select
            value={formData.ward}
            onChange={(e) => handleChange('ward', e.target.value)}
            className={`w-full p-3 border rounded-xl transition-all outline-none appearance-none bg-white
              ${errors.ward ? 'border-red-500' : 'border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}
            `}
            required
          >
            <option value="">Select Ward</option>
            {WARDS.map(ward => (
              <option key={ward.value} value={ward.value}>
                Ward {ward.label}
              </option>
            ))}
          </select>
          {errors.ward && <p className="text-red-500 text-xs mt-1 font-medium">{errors.ward}</p>}
        </div>
      </div>

      {/* Area & House Number */}
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Area / Locality"
          placeholder="e.g. Traffic Chowk, Milanchowk"
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
          error={errors.area}
          required
          className="rounded-xl"
        />
        <Input
          label="House Number"
          placeholder="e.g. 102 or 'Red Gate House'"
          value={formData.houseNo}
          onChange={(e) => handleChange('houseNo', e.target.value)}
          error={errors.houseNo}
          className="rounded-xl"
        />
      </div>

      {/* Street/Path Name */}
      <Input
        label="Street / Path Name"
        placeholder="e.g. Siddhartha Highway, Hospital Road"
        value={formData.street}
        onChange={(e) => handleChange('street', e.target.value)}
        error={errors.street}
        required
        className="rounded-xl"
      />

      {/* Landmark */}
      <Input
        label="Nearby Famous Place (Landmark)"
        placeholder="e.g. Opposite to Bhatbhateni, Near Lions Eye Hospital"
        value={formData.landmark}
        onChange={(e) => handleChange('landmark', e.target.value)}
        className="rounded-xl"
      />

      {/* Default Address Toggle */}
      <motion.label
        className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer
          ${formData.isDefault ? 'border-orange-500 bg-orange-50/30' : 'border-neutral-100 bg-white hover:border-orange-100'}
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
          ${formData.isDefault ? 'bg-orange-500 border-orange-500' : 'border-neutral-300'}
        `}>
          {formData.isDefault && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
        </div>
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => handleChange('isDefault', e.target.checked)}
          className="hidden"
        />
        <span className="text-sm font-bold text-neutral-700">
          Set as my default delivery address
        </span>
      </motion.label>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-neutral-100">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-neutral-500 font-bold"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[160px] bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 rounded-xl py-4"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            initialData ? 'Update Address' : 'Add New Address'
          )}
        </Button>
      </div>
    </motion.form>
  )
}

