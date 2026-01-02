// src/components/layout/PromoStripSection.jsx

import { motion } from 'framer-motion'
import { Sparkles, Gift, Zap, Percent, Star } from 'lucide-react'

const promos = [
  { icon: Sparkles, text: "Free Delivery on First Order" },
  { icon: Gift, text: "Special Gift on Orders Above Rs. 500" },
  { icon: Zap, text: "Delivered in Minutes" },
  { icon: Percent, text: "Up to 30% Off on Selected Items" },
  { icon: Star, text: "Premium Quality Guaranteed" },
  { icon: Sparkles, text: "Fresh Products Daily" },
]

export default function PromoStripSection() {
  return (
    <section className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 py-3 overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex gap-8"
          animate={{
            x: [0, -1920]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear"
            }
          }}
        >
          {[...promos, ...promos, ...promos].map((promo, index) => {
            const Icon = promo.icon
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-white whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-body-sm">{promo.text}</span>
                <span className="mx-4 text-white/50">•</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}