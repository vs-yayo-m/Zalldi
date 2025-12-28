// src/components/customer/TrackingMap.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

export default function TrackingMap({ destination, orderStatus }) {
  const [mapError, setMapError] = useState(false)
  
  const mapUrl = destination ?
    `https://www.openstreetmap.org/export/embed.html?bbox=${destination.lng - 0.01},${destination.lat - 0.01},${destination.lng + 0.01},${destination.lat + 0.01}&layer=mapnik&marker=${destination.lat},${destination.lng}` :
    null
  
  useEffect(() => {
    setMapError(false)
  }, [destination])
  
  if (!destination) {
    return (
      <div className="bg-neutral-100 rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-600">Location information not available</p>
      </div>
    )
  }
  
  if (mapError) {
    return (
      <div className="bg-neutral-100 rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-600 mb-4">Unable to load map</p>
        <a
          href={`https://www.google.com/maps?q=${destination.lat},${destination.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
        >
          <Navigation className="w-4 h-4" />
          Open in Google Maps
        </a>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="relative w-full h-80 bg-neutral-100 rounded-xl overflow-hidden">
        {orderStatus === 'out_for_delivery' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-sm font-semibold text-neutral-900">
                Driver on the way
              </span>
            </div>
          </motion.div>
        )}

        <iframe
          title="Delivery Location"
          src={mapUrl}
          className="w-full h-full border-0"
          loading="lazy"
          onError={() => setMapError(true)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">Delivery Location</p>
            <p className="font-semibold text-neutral-900">
              {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
            </p>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps?q=${destination.lat},${destination.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span className="hidden sm:inline">Navigate</span>
        </a>
      </div>
    </motion.div>
  )
}