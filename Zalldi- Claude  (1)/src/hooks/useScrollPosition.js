// src/hooks/useScrollPosition.js

import { useState, useEffect } from 'react'

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)
  
  useEffect(() => {
    function handleScroll() {
      setScrollPosition(window.pageYOffset)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return scrollPosition
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up')
  const [lastScrollY, setLastScrollY] = useState(0)
  
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.pageYOffset
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])
  
  return scrollDirection
}