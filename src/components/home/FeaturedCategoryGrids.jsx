// src/components/home/FeaturedCategoryGrids.jsx
// 2x3 non scroll 
import React from 'react';
import { motion } from 'framer-motion';
import CategoryGridSection from './CategoryGridSection';

const GRID_CATEGORIES = [
  {
    id: 'chips-namkeen',
    name: 'Chips & Namkeen',
    priority: 1
  },
  {
    id: 'instant-food',
    name: 'Instant Food',
    priority: 2
  },
  {
    id: 'drinks-juices',
    name: 'Drinks & Juices',
    priority: 3
  },
  {
    id: 'skin-face',
    name: 'Skin & Face',
    priority: 4
  },
  {
    id: 'beauty-cosmetics',
    name: 'Beauty & Cosmetics',
    priority: 5
  },
  {
    id: 'flour-rice-dal',
    name: 'Atta, Rice & Dal',
    priority: 6
  },
  {
    id: 'oil-ghee-masala',
    name: 'Oil, Ghee & Masala',
    priority: 7
  },
  {
    id: 'cleaners-repellents',
    name: 'Cleaners & Repellents',
    priority: 8
  },
  {
    id: 'bath-body',
    name: 'Bath & Body',
    priority: 9
  }
];

export default function FeaturedCategoryGrids() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8 bg-white"
    >
      <div className="container mx-auto px-4">
        {GRID_CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CategoryGridSection
              categoryId={category.id}
              categoryName={category.name}
              displayCount={6}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}