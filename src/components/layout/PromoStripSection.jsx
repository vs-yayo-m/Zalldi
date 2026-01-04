// 🎪 Banner Slider Component
// Continuous auto-scrolling banner

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BANNER_SLIDES } from '../../utils/constants';

const BannerSlider = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);
  
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || isPaused) return;
    
    let scrollAmount = 0;
    const scrollStep = 1; // Pixels to scroll per frame
    const scrollDelay = 30; // Milliseconds between frames
    
    const scroll = () => {
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        // Reset to beginning when halfway through
        slider.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        scrollAmount += scrollStep;
        slider.scrollLeft = scrollAmount;
      }
    };
    
    const interval = setInterval(scroll, scrollDelay);
    return () => clearInterval(interval);
  }, [isPaused]);
  
  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Duplicate slides for seamless loop */}
        {[...BANNER_SLIDES, ...BANNER_SLIDES].map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            onClick={() => navigate(banner.link)}
            className="flex-shrink-0 w-72 md:w-96 h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md"
          >
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default BannerSlider;