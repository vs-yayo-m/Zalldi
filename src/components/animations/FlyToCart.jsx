// src/components/animations/FlyToCart.jsx

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function FlyToCart({ trigger, productImage, onComplete }) {
  const [particles, setParticles] = useState([])
  const controls = useAnimation()
  
  useEffect(() => {
    if (trigger) {
      animateToCart()
    }
  }, [trigger])
  
  const animateToCart = async () => {
    const cartIcon = document.getElementById('cart-icon')
    if (!cartIcon) return
    
    const cartRect = cartIcon.getBoundingClientRect()
    const startX = window.innerWidth / 2
    const startY = window.innerHeight / 2
    
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      startX,
      startY,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2
    }))
    
    setParticles(newParticles)
    
    await controls.start({
      scale: [1, 0.5, 0],
      opacity: [1, 1, 0],
      transition: { duration: 0.6, ease: 'easeInOut' }
    })
    
    setTimeout(() => {
      setParticles([])
      if (onComplete) onComplete()
    }, 100)
  }
  
  if (particles.length === 0) return null
  
  return (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="fixed z-[9999] pointer-events-none"
          initial={{
            x: particle.startX,
            y: particle.startY,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: particle.endX + (Math.random() - 0.5) * 20,
            y: particle.endY + (Math.random() - 0.5) * 20,
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.05,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg" />
        </motion.div>
      ))}

      {productImage && (
        <motion.div
          className="fixed z-[9999] pointer-events-none"
          initial={{
            x: window.innerWidth / 2 - 30,
            y: window.innerHeight / 2 - 30,
            scale: 1,
            opacity: 1
          }}
          animate={controls}
          style={{ width: 60, height: 60 }}
        >
          <img
            src={productImage}
            alt="Product"
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
        </motion.div>
      )}
    </>
  )
}