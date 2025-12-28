// src/components/customer/CategoryGrid.jsx

import React from 'react'
import { motion } from 'framer-motion'
import CategoryCard from './CategoryCard'

export default function CategoryGrid({ categories, className = '' }) {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${className}`}
    >
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </motion.div>
  )
}