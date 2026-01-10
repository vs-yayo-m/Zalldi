// src/components/customer/AddressSelector.jsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Plus, Home, Briefcase, Check, Navigation } from 'lucide-react'
import { useAuth } from '@hooks/useAuth'
import AddressForm from './AddressForm'
import { formatAddress } from '@utils/formatters'

export default function AddressSelector({ isOpen, onClose, selectedAddress, onSelect }) {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [requestingLocation, setRequestingLocation] = useState(false)
  
  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses)
    }
  }, [user])
  
  const handleSelectAddress = (address) => {
    onSelect(address)
    onClose()
  }
  
  const handleAddressCreated = (newAddress) => {
    setAddresses([...addresses, newAddress])
    onSelect(newAddress)
    setShowForm(false)
    onClose()
  }
  
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    
    setRequestingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // In production, use reverse geocoding API to get address
        // For now, just open form with coordinates
        setShowForm(true)
        setRequestingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please enter manually.')
        setShowForm(true)
        setRequestingLocation(false)
      }
    )
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div>
              <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight">
                Delivery Address
              </h2>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Where should we deliver?
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {showForm ? (
              <AddressForm
                onSuccess={handleAddressCreated}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <div className="space-y-3">
                {/* Location Request Button */}
                <button
                  onClick={requestLocation}
                  disabled={requestingLocation}
                  className="w-full p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl flex items-center gap-3 hover:from-orange-100 hover:to-orange-200 transition-all"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-black text-orange-900">
                      {requestingLocation ? 'Getting location...' : 'Use my current location'}
                    </div>
                    <div className="text-[10px] font-bold text-orange-700">
                      We'll detect your address automatically
                    </div>
                  </div>
                </button>

                {/* Add New Address Button */}
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-2xl flex items-center gap-3 hover:border-orange-400 hover:bg-orange-50 transition-all"
                >
                  <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-black text-neutral-900">
                      Add New Address
                    </div>
                    <div className="text-[10px] font-bold text-neutral-500">
                      Enter manually
                    </div>
                  </div>
                </button>

                {/* Saved Addresses */}
                {addresses.length > 0 && (
                  <div className="mt-6">
                    <div className="text-[10px] font-black text-neutral-500 uppercase tracking-wider mb-3 px-1">
                      Saved Addresses
                    </div>

                    <div className="space-y-2">
                      {addresses.map((address) => {
                        const isSelected = selectedAddress?.id === address.id
                        const Icon = address.type === 'home' ? Home : address.type === 'work' ? Briefcase : MapPin

                        return (
                          <button
                            key={address.id}
                            onClick={() => handleSelectAddress(address)}
                            className={`w-full p-4 border-2 rounded-2xl text-left transition-all ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-neutral-200 hover:border-orange-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-orange-500' : 'bg-neutral-100'
                              }`}>
                                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neutral-600'}`} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-black text-neutral-900 uppercase">
                                    {address.type}
                                  </span>
                                  {address.isDefault && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase">
                                      Default
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-neutral-700 leading-relaxed">
                                  {formatAddress(address)}
                                </p>

                                {address.landmark && (
                                  <p className="text-[10px] text-neutral-500 mt-1">
                                    Near: {address.landmark}
                                  </p>
                                )}
                              </div>

                              {isSelected && (
                                <div className="flex-shrink-0">
                                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}