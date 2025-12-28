// src/components/shared/ShareButton.jsx

import { useState } from 'react'
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@components/ui/Button'
import { copyToClipboard } from '@utils/helpers'
import toast from 'react-hot-toast'

export default function ShareButton({ 
  url, 
  title, 
  text,
  className = '',
  variant = 'primary',
  size = 'md'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = url || window.location.href
  const shareTitle = title || document.title
  const shareText = text || `Check out ${shareTitle}`

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        })
        toast.success('Shared successfully')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setIsOpen(true)
        }
      }
    } else {
      setIsOpen(true)
    }
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl)
    if (success) {
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 2000)
    } else {
      toast.error('Failed to copy link')
    }
  }

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
        setIsOpen(false)
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
        setIsOpen(false)
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
        setIsOpen(false)
      }
    }
  ]

  return (
    <div className={`relative ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleNativeShare}
        className="relative"
      >
        <Share2 className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 z-50"
            >
              <h4 className="font-semibold text-neutral-800 mb-3">Share via</h4>
              
              <div className="space-y-2 mb-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <option.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-neutral-800">{option.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-neutral-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-neutral-800">
                        {copied ? 'Link Copied!' : 'Copy Link'}
                      </p>
                      <p className="text-caption text-neutral-500 truncate max-w-[180px]">
                        {shareUrl}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}