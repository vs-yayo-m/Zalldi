// src/components/customer/CategoryGrid.jsx

// NOTE: This update focuses ONLY on CategoryGrid.jsx
// Goal: strict 2-column grid on mobile, premium spacing, clean hierarchy, smooth motion

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
  if (!categories || categories.length === 0) return null;

  // HARD RULE (mobile-first):
  // - Mobile: ALWAYS 2 columns (no exception)
  // - Tablet: 3–4 columns
  // - Desktop: scalable via `columns`
  const gridCols = {
    2: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mb-10"
    >
      {/* HEADER */}
      {title && (
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                style={{ backgroundColor: `${color}1A`, color }}
              >
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight leading-none">
                {title}
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                {categories.length} items
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GRID */}
      <div
        className={`grid ${gridCols[columns] || gridCols[4]} gap-3 sm:gap-4 lg:gap-5`}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: index * 0.02 }}
          >
            <CategoryCard category={category} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
