// src/components/shared/MapPicker.jsx

import { useState, useEffect } from 'react'
import { MapPin, Locate, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import Modal from '@components/ui/Modal'
import toast from 'react-hot-toast'

export default function MapPicker({ value, onChange, isOpen, onClose }) {
  const [coordinates, setCoordinates] = useState(value || { lat: 27.5, lng: 83.45 })
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (value) {
      setCoordinates(value)
    }
  }, [value])
  
  const getCurrentLocation = () => {
    setIsLoading(true)
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      setIsLoading(false)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCoordinates(newCoords)
        setIsLoading(false)
        toast.success('Location found')
      },
      (error) => {
        setIsLoading(false)
        toast.error('Unable to get your location')
      }
    )
  }
  
  const handleSave = () => {
    if (onChange) {
      onChange(coordinates)
    }
    onClose()
  }
  
  const handleMapClick = (lat, lng) => {
    setCoordinates({ lat, lng })
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pick Location" maxWidth="max-w-3xl">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search for an address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="secondary"
            onClick={getCurrentLocation}
            disabled={isLoading}
          >
            <Locate className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative bg-neutral-100 rounded-xl overflow-hidden h-96">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800 mb-1">Map Preview</p>
                <p className="text-body-sm text-neutral-500">
                  Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={getCurrentLocation}>
                <Locate className="w-4 h-4 mr-2" />
                Get My Location
              </Button>
            </div>
          </div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
            animate={{ y: [-5, 0, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin className="w-10 h-10 text-orange-500 drop-shadow-lg" fill="currentColor" />
          </motion.div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-neutral-800 mb-1">Selected Location</p>
              <p className="text-body-sm text-neutral-600">
                Latitude: {coordinates.lat.toFixed(6)}
                <br />
                Longitude: {coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <MapPin className="w-4 h-4 mr-2" />
            Save Location
          </Button>
        </div>
      </div>
    </Modal>
  )
}