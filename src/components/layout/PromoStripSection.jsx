import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import { BANNER_SLIDES } from '@/utils/constants';

/**
 * BLINKIT-INSPIRED HYPER-MODERN BANNER SLIDER
 * Features: 
 * 1. Hardware-accelerated transitions
 * 2. Auto-playing logic with progress indicator
 * 3. Parallax content layers
 * 4. Enterprise-grade responsive design
 */

const BannerSlider = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);

  // Enterprise Auto-play logic
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, [currentIndex, isHovered]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  // Variant for slide transitions
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      },
    }),
  };

  return (
    <section 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[220px] sm:h-[350px] lg:h-[420px] w-full rounded-[2.5rem] overflow-hidden bg-neutral-100 shadow-2xl shadow-orange-500/10 border border-white">
        
        {/* Main Content Slider */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => navigate(BANNER_SLIDES[currentIndex].link)}
          >
            {/* Background Image with Overlay */}
            <div className="relative w-full h-full">
                <img
                    src={BANNER_SLIDES[currentIndex].image}
                    alt={BANNER_SLIDES[currentIndex].title || "Promotion"}
                    className="w-full h-full object-cover"
                />
                {/* Modern Gradient Overlay (Vignette style) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Floating Content Layer (Parallax Effect) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-center px-10 sm:px-16"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-orange-500 p-2 rounded-lg">
                    <Zap size={16} className="text-white fill-current" />
                </div>
                <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Special Offer</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight max-w-lg mb-6 tracking-tighter">
                {BANNER_SLIDES[currentIndex].title || "Flash Sale: Up to 50% Off"}
              </h2>

              <div className="flex items-center gap-4">
                 <button className="bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all group">
                    Shop Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Custom Navigation Controls (Glassmorphism) */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3 z-20">
            <NavButton onClick={handlePrev} icon={<ChevronLeft />} />
            <NavButton onClick={handleNext} icon={<ChevronRight />} />
        </div>

        {/* Modern Progress Bar Indicators */}
        <div className="absolute bottom-8 left-10 sm:left-16 flex items-center gap-2 z-20">
            {BANNER_SLIDES.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                    }}
                    className="group relative h-1.5 transition-all duration-500 ease-out"
                    style={{ width: currentIndex === idx ? '40px' : '12px' }}
                >
                    <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                        currentIndex === idx ? 'bg-orange-500' : 'bg-white/40 group-hover:bg-white/60'
                    }`} />
                </button>
            ))}
        </div>
      </div>

      {/* Background Glows (Visual Depth) */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-400/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full -z-10" />
    </section>
  );
};

/**
 * SUB-COMPONENT: REUSABLE NAV BUTTON
 */
const NavButton = ({ onClick, icon }) => (
    <button 
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
    >
        {React.cloneElement(icon, { size: 24, strokeWidth: 3 })}
    </button>
);

export default BannerSlider;

