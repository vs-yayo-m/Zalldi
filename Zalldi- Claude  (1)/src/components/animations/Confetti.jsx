// src/components/animations/Confetti.jsx

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Confetti({ trigger, duration = 3000 }) {
  const [particles, setParticles] = useState([])
  const [isActive, setIsActive] = useState(false)
  
  useEffect(() => {
    if (trigger && !isActive) {
      startConfetti()
    }
  }, [trigger])
  
  const startConfetti = () => {
    setIsActive(true)
    const colors = ['#FF6B35', '#F7931E', '#FFB88C', '#10B981', '#3B82F6', '#F59E0B']
    
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      delay: Math.random() * 0.5
    }))
    
    setParticles(newParticles)
    
    setTimeout(() => {
      setParticles([])
      setIsActive(false)
    }, duration)
  }
  
  if (particles.length === 0) return null
  
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: 0,
            opacity: 1
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: particle.rotation + 720,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            ease: 'easeIn'
          }}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  )
}