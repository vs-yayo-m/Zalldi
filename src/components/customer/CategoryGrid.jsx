// src/components/customer/CategoryGrid.jsx

import React from 'react';
import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';

export default function CategoryGrid({
  categories,
  title,
  icon,
  color = '#FF6B35',
  columns = 4
}) {
  if (!categories || categories.length === 0) {
    return null;
  }
  
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  };
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      {title && (
        <div className="flex items-center gap-3 mb-6">
          {icon && (
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
              style={{ backgroundColor: `${color}20` }}
            >
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-neutral-500 font-medium">
              {categories.length} categories available
            </p>
          </div>
        </div>
      )}

      <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 lg:gap-5`}>
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}