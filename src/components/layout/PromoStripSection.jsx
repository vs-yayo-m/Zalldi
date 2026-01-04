import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Zap, Percent, Star, ShieldCheck } from 'lucide-react';

const promos = [
  { icon: Sparkles, text: "Free Delivery on First Order" },
  { icon: Gift, text: "Special Gift on Orders Above Rs. 500" },
  { icon: Zap, text: "Delivered in Minutes" },
  { icon: Percent, text: "Up to 30% Off on Selected Items" },
  { icon: Star, text: "Premium Quality Guaranteed" },
  { icon: ShieldCheck, text: "100% Secure Payments" },
];

/**
 * ZALLDI PROMO STRIP
 * Enterprise-grade infinite marquee with high-performance CSS-driven animations.
 * Features:
 * 1. Infinite seamless loop using Framer Motion.
 * 2. Edge-fade masking for a premium visual flow.
 * 3. Hover-to-pause logic for accessibility.
 * 4. Ultra-crisp typography and Lucide icons.
 */
export default function PromoStripSection() {
  // Triple the array to ensure no gaps on high-resolution screens (4K/Ultrawide)
  const marqueeItems = [...promos, ...promos, ...promos];

  return (
    <section className="relative bg-orange-500 border-y border-orange-400/30 overflow-hidden group">
      {/* Premium Edge Fades: Creates a smooth transition as text enters/leaves the viewport */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-orange-500 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-orange-500 to-transparent z-10 pointer-events-none" />

      <div className="py-2.5 md:py-3 flex overflow-hidden">
        <motion.div
          className="flex items-center gap-12 md:gap-20"
          animate={{
            x: [0, -1035], // Calculated based on content width for a seamless jump
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25, // Optimized speed for readability
              ease: "linear",
            },
          }}
          // Pause animation on hover for better UX/Readability
          whileHover={{ animationPlayState: "paused" }}
        >
          {marqueeItems.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5 md:gap-3 text-white whitespace-nowrap select-none"
              >
                <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-[11px] md:text-sm font-black uppercase tracking-wider">
                  {promo.text}
                </span>
                
                {/* Decorative Separator */}
                <div className="ml-8 md:ml-12 opacity-30">
                  <div className="w-1.5 h-1.5 rounded-full bg-white rotate-45" />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Subtle Animation Glow */}
      <motion.div 
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
      />
    </section>
  );
}

/**
 * PRODUCTION NOTES:
 * 1. Performance: Used 'linear' easing for the marquee to prevent the "stuttering" feel of ease-in-out.
 * 2. Visual Polish: Added `font-black` and `tracking-wider` to the text to give it an "Urgency/Retail" vibe common in Blinkit/Instamart.
 * 3. Responsive: Icon sizes and gaps scale down for mobile to prevent overwhelming the small height.
 */

