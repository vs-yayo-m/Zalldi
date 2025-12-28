// src/hooks/useIntersectionObserver.js

import { useState, useEffect, useRef } from 'react'

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef(null)

  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false
  } = options

  useEffect(() => {
    const node = ref.current

    if (!node || (freezeOnceVisible && hasIntersected)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        
        if (entry.isIntersecting) {
          setHasIntersected(true)
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, freezeOnceVisible, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}