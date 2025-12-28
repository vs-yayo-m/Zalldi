// src/hooks/useThrottle.js

import { useRef, useCallback } from 'react'

export function useThrottle(callback, delay = 500) {
  const lastRun = useRef(Date.now())
  
  return useCallback(
    (...args) => {
      const now = Date.now()
      
      if (now - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = now
      }
    },
    [callback, delay]
  )
}

export function useThrottleValue(value, delay = 500) {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRun = useRef(Date.now())
  
  useEffect(() => {
    const now = Date.now()
    
    if (now - lastRun.current >= delay) {
      setThrottledValue(value)
      lastRun.current = now
    } else {
      const timeout = setTimeout(() => {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }, delay - (now - lastRun.current))
      
      return () => clearTimeout(timeout)
    }
  }, [value, delay])
  
  return throttledValue
}