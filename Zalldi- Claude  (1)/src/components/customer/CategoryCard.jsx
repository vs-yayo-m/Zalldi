// src/components/customer/CategoryCard.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

export default function CategoryCard({ category }) {
  const IconComponent = Icons[category.icon] || Icons.Package
  
  return (
    <Link to={`/category/${category.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
      >
        <div
          className="absolute inset-0 opacity-5 rounded-2xl"
          style={{ backgroundColor: category.color }}
        />

        <div className="relative flex flex-col items-center text-center">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <IconComponent
              className="w-8 h-8"
              style={{ color: category.color }}
            />
          </div>

          <h3 className="font-semibold text-neutral-800 group-hover:text-orange-500 transition-colors">
            {category.name}
          </h3>
        </div>
      </motion.div>
    </Link>
  )
}