// src/components/admin/OrderActions.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Share2, Copy, Mail, MessageCircle, 
  Navigation, ExternalLink, Check, ChevronDown 
} from 'lucide-react'
import { 
  generateGoogleMapsLink, 
  generateAppleMapsLink,
  generateWazeMapsLink 
} from '@services/location.service'
import { 
  shareViaWhatsApp, 
  shareViaEmail, 
  copyOrderDetails,
  shareOrderDetails 
} from '@services/notification.service'
import toast from 'react-hot-toast'

export default function OrderActions({ order }) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showMapMenu, setShowMapMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const hasLocation = order.location?.latitude && order.location?.longitude

  const handleCopy = async () => {
    const success = await copyOrderDetails(order)
    if (success) {
      setCopied(true)
      toast.success('Order details copied!')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Failed to copy')
    }
  }

  const handleShare = async () => {
    const success = await shareOrderDetails(order)
    if (!success) {
      setShowShareMenu(true)
    }
  }

  const handleWhatsApp = () => {
    shareViaWhatsApp(order)
    setShowShareMenu(false)
    toast.success('Opening WhatsApp...')
  }

  const handleEmail = () => {
    shareViaEmail(order)
    setShowShareMenu(false)
    toast.success('Opening email...')
  }

  const openInMaps = (url) => {
    window.open(url, '_blank')
    setShowMapMenu(false)
    toast.success('Opening maps...')
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Location Button */}
      {hasLocation && (
        <div className="relative">
          <button
            onClick={() => setShowMapMenu(!showMapMenu)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-sm transition-all border border-blue-200"
          >
            <MapPin className="w-4 h-4" />
            <span>View Location</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showMapMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showMapMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMapMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden z-50 min-w-[220px]"
                >
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => openInMaps(generateGoogleMapsLink(order.location.latitude, order.location.longitude))}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900">Google Maps</div>
                        <div className="text-xs text-neutral-500">Navigate</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 ml-auto" />
                    </button>

                    <button
                      onClick={() => openInMaps(generateAppleMapsLink(order.location.latitude, order.location.longitude))}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Navigation className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900">Apple Maps</div>
                        <div className="text-xs text-neutral-500">Navigate</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 ml-auto" />
                    </button>

                    <button
                      onClick={() => openInMaps(generateWazeMapsLink(order.location.latitude, order.location.longitude))}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 rounded-lg transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Navigation className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900">Waze</div>
                        <div className="text-xs text-neutral-500">Navigate</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 ml-auto" />
                    </button>
                  </div>

                  <div className="px-3 py-2 bg-neutral-50 border-t border-neutral-100">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      📍 {order.location.latitude.toFixed(6)}, {order.location.longitude.toFixed(6)}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
          copied
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy Details</span>
          </>
        )}
      </button>

      {/* Share Menu */}
      <div className="relative">
        <button
          onClick={handleShare}
          onContextMenu={(e) => {
            e.preventDefault()
            setShowShareMenu(!showShareMenu)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold text-sm transition-all border border-orange-200"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Order</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showShareMenu ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showShareMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowShareMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden z-50 min-w-[220px]"
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-lg transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">WhatsApp</div>
                      <div className="text-xs text-neutral-500">Send via WhatsApp</div>
                    </div>
                  </button>

                  <button
                    onClick={handleEmail}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">Email</div>
                      <div className="text-xs text-neutral-500">Send via email</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}