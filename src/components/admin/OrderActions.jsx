// src/components/admin/OrderActions.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Navigation, Share2, MessageCircle, Mail, 
  Copy, ExternalLink, Phone, CheckCircle
} from 'lucide-react'
import Button from '@components/ui/Button'
import { 
  shareOrderViaWhatsApp, 
  shareOrderViaEmail, 
  copyOrderDetailsToClipboard 
} from '@services/notification.service'
import { generateGoogleMapsLink, generateGoogleMapsDirectionsLink } from '@services/location.service'
import toast from 'react-hot-toast'

export default function OrderActions({ order }) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const hasLocation = order.location && order.location.latitude && order.location.longitude

  const handleOpenMap = () => {
    if (!hasLocation) {
      toast.error('No location data available')
      return
    }

    const mapUrl = generateGoogleMapsLink(
      order.location.latitude,
      order.location.longitude,
      `Order ${order.orderNumber} - ${order.customerName}`
    )
    
    window.open(mapUrl, '_blank')
  }

  const handleGetDirections = () => {
    if (!hasLocation) {
      toast.error('No location data available')
      return
    }

    const directionsUrl = generateGoogleMapsDirectionsLink(
      order.location.latitude,
      order.location.longitude
    )
    
    window.open(directionsUrl, '_blank')
  }

  const handleShareWhatsApp = () => {
    shareOrderViaWhatsApp(order)
    setShowShareMenu(false)
    toast.success('Opening WhatsApp...')
  }

  const handleShareEmail = () => {
    shareOrderViaEmail(order)
    setShowShareMenu(false)
    toast.success('Opening email client...')
  }

  const handleCopyDetails = async () => {
    const success = await copyOrderDetailsToClipboard(order)
    if (success) {
      setCopied(true)
      toast.success('Order details copied!')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Failed to copy')
    }
    setShowShareMenu(false)
  }

  const handleCallCustomer = () => {
    window.location.href = `tel:${order.customerPhone}`
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Location Button */}
      {hasLocation && (
        <div className="flex gap-2">
          <Button
            onClick={handleOpenMap}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MapPin className="w-4 h-4 mr-2" />
            View on Map
          </Button>

          <Button
            onClick={handleGetDirections}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Directions
          </Button>
        </div>
      )}

      {/* Call Customer */}
      <Button
        onClick={handleCallCustomer}
        variant="outline"
        className="border-green-600 text-green-600 hover:bg-green-50"
      >
        <Phone className="w-4 h-4 mr-2" />
        Call
      </Button>

      {/* Share Button with Dropdown */}
      <div className="relative">
        <Button
          onClick={() => setShowShareMenu(!showShareMenu)}
          variant="outline"
          className="border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Order
        </Button>

        {showShareMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowShareMenu(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-20"
            >
              <button
                onClick={handleShareWhatsApp}
                className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3 text-sm font-medium text-neutral-700"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                Share via WhatsApp
              </button>

              <button
                onClick={handleShareEmail}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 text-sm font-medium text-neutral-700"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                Share via Email
              </button>

              <button
                onClick={handleCopyDetails}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-sm font-medium text-neutral-700"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-orange-600" />
                    Copy Details
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </div>

      {/* Location Badge */}
      {hasLocation && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
            Location Shared
          </span>
        </div>
      )}
    </div>
  )
}