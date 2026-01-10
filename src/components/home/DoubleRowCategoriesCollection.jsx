// src/components/home/DoubleRowCategoriesCollection.jsx

import React from 'react';
import { motion } from 'framer-motion';
import DoubleRowCategorySection from './DoubleRowCategorySection';

const DOUBLE_ROW_CATEGORIES = [
  {
    id: 'chips-namkeen',
    name: 'Chips & Namkeen'
  },
  {
    id: 'instant-food',
    name: 'Instant Food'
  },
  {
    id: 'drinks-juices',
    name: 'Drinks & Juices'
  },
  {
    id: 'skin-face',
    name: 'Skin & Face'
  },
  {
    id: 'beauty-cosmetics',
    name: 'Beauty & Cosmetics'
  },
  {
    id: 'flour-rice-dal',
    name: 'Atta, Rice & Dal'
  },
  {
    id: 'oil-ghee-masala',
    name: 'Oil, Ghee & Masala'
  },
  {
    id: 'cleaners-repellents',
    name: 'Cleaners & Repellents'
  },
  {
    id: 'bath-body',
    name: 'Bath & Body'
  }
];

export default function DoubleRowCategoriesCollection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6 bg-white"
    >
      <div className="container mx-auto px-4">
        {DOUBLE_ROW_CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DoubleRowCategorySection
              categoryId={category.id}
              categoryName={category.name}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}