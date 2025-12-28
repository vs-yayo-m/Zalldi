// src/components/shared/LoadingScreen.jsx

import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = ({ message = 'Loading...', fullScreen = true }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { scale: 0 },
    show: { scale: 1 }
  }
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-2"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={item}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.15
            }}
            className="w-4 h-4 bg-primary-500 rounded-full"
          />
        ))}
      </motion.div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-neutral-600 font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  )
}

export default LoadingScreen