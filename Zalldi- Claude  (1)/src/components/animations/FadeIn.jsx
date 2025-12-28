// src/components/animations/FadeIn.jsx

import { motion } from 'framer-motion'

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = '',
  ...props
}) {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  }
  
  const variants = {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeInWhenVisible({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = '',
  once = true,
  margin = '-100px',
  ...props
}) {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  }
  
  const variants = {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  }
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeInScale({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
  ...props
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9
      }}
      animate={{
        opacity: 1,
        scale: 1
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

export function FadeInBlur({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  ...props
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: 'blur(10px)'
      }}
      animate={{
        opacity: 1,
        filter: 'blur(0px)'
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