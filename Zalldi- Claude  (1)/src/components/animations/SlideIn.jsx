// src/components/animations/SlideIn.jsx

import { motion } from 'framer-motion'

export default function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0,
  duration = 0.5,
  className = '',
  ...props 
}) {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideInWhenVisible({ 
  children, 
  direction = 'left',
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
  margin = '-100px',
  ...props 
}) {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideInStagger({ 
  children, 
  direction = 'left',
  staggerDelay = 0.1,
  duration = 0.5,
  className = '',
  ...props 
}) {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 }
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  }

  const item = {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={item}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </motion.div>
  )
}

export function SlideFade({ 
  children, 
  direction = 'left',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = '',
  ...props 
}) {
  const getInitial = () => {
    switch (direction) {
      case 'left': return { x: -distance, opacity: 0 }
      case 'right': return { x: distance, opacity: 0 }
      case 'up': return { y: -distance, opacity: 0 }
      case 'down': return { y: distance, opacity: 0 }
      default: return { x: -distance, opacity: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitial()}
      animate={{
        x: 0,
        y: 0,
        opacity: 1
      }}
      transition={{
        duration,
        delay,
        ease: [0.6, 0.05, 0.01, 0.9]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}