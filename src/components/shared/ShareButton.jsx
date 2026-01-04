// src/components/shared/ShareButton.jsx

import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  X,
  Send,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

/**
 * UTILITY: Enhanced Copy to Clipboard with fallback
 */
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    return false;
  }
};

export default function ShareButton({ 
  url, 
  title, 
  text,
  className = '',
  variant = 'primary',
  size = 'md'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBlast, setShowBlast] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = text || `You HAVE to see this on Zalldi! ⚡`;

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setShowBlast(true);
      toast.success('Link captured! Ready to spread the word.');
      setTimeout(() => {
        setCopied(false);
        setShowBlast(false);
        setIsOpen(false);
      }, 2000);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: 'bg-[#25D366]',
      hover: 'hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    },
    {
      name: 'Messenger',
      icon: <Send size={20} />,
      color: 'bg-[#0084FF]',
      hover: 'hover:shadow-[0_0_20px_rgba(0,132,255,0.4)]',
      action: () => window.open(`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: 'bg-black',
      hover: 'hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleShareClick}
        className="relative group overflow-hidden"
      >
        <motion.div
            whileHover={{ rotate: 15, scale: 1.2 }}
            className="relative z-10"
        >
            <Share2 className="w-5 h-5" />
        </motion.div>
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute right-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-neutral-100 p-6 z-[70] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <Sparkles size={16} />
                    </div>
                    <h4 className="font-black text-neutral-900 uppercase tracking-tighter italic">Spread the Vibes</h4>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                    <X size={20} />
                </button>
              </div>
              
              {/* Social Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {shareOptions.map((option, i) => (
                  <motion.button
                    key={option.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={option.action}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-14 h-14 ${option.color} ${option.hover} rounded-2xl flex items-center justify-center text-white transition-all duration-300 group-hover:-translate-y-1`}>
                      {option.icon}
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{option.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Copy Link Section */}
              <div className="relative">
                <motion.button
                  onClick={handleCopyLink}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 overflow-hidden ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${copied ? 'bg-white/20' : 'bg-white shadow-sm border border-neutral-100'}`}>
                      {copied ? <Check size={20} /> : <LinkIcon size={20} className="text-orange-500" />}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-tight">
                        {copied ? 'Captured!' : 'Quick Copy'}
                      </p>
                      <p className={`text-[10px] font-bold truncate max-w-[120px] ${copied ? 'text-white/80' : 'text-neutral-400'}`}>
                        {shareUrl.replace(/(^\w+:|^)\/\//, '')}
                      </p>
                    </div>
                  </div>
                  
                  {!copied && (
                    <div className="bg-orange-500/10 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                        Copy
                    </div>
                  )}

                  {/* Copy Blast Effect */}
                  <AnimatePresence>
                    {showBlast && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/20 rounded-full"
                        />
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Footer "Slogan" */}
              <p className="mt-6 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">
                “Friends don’t let friends pay full price”
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

