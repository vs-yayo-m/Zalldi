// src/hooks/useClickOutside.js

import { useEffect } from 'react'

export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      handler(event)
    }
    
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export function useClickOutsideMultiple(refs, handler) {
  useEffect(() => {
    const listener = (event) => {
      const clickedOutside = refs.every(ref =>
        !ref.current || !ref.current.contains(event.target)
      )
      
      if (clickedOutside) {
        handler(event)
      }
    }
    
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refs, handler])
}

export function useEscapeKey(handler) {
  useEffect(() => {
    const listener = (event) => {
      if (event.key === 'Escape') {
        handler(event)
      }
    }
    
    document.addEventListener('keydown', listener)
    
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [handler])
}