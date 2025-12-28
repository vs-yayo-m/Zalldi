// src/hooks/useMediaQuery.js

import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = (e) => setMatches(e.matches)
    
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [query, matches])
  
  return matches
}

export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 639px)')
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)')
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : 'large'
  }
}

export function useOrientation() {
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const isLandscape = useMediaQuery('(orientation: landscape)')
  
  return {
    isPortrait,
    isLandscape,
    orientation: isPortrait ? 'portrait' : 'landscape'
  }
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)')
}