// src/components/home/ ScrollRawCategories.jsx

import React from 'react';
import { motion } from 'framer-motion';
import CategoryProductsShowcase from './CategoryProductsShowcase';

const FEATURED_CATEGORIES = [
  {
    id: 'chips-namkeen',
    name: 'Crispy Chips & Namkeen',
    priority: 1
  },
  
  {
  id: 'drinks-juices',
  name: 'Drinks & Juice',
  priority: 2
  },
  
  {
  id: 'snacks-drinks',
  name: 'Snacks & Drinks',
  priority: 3
  },
  
  {
  id: 'instant-food',
  name: 'Instant Food',
  priority: 4
  },
  {
  id: 'bakery-biscuits',
  name: 'Bakery & Biscuits',
  priority: 5
  },

  {
    id: 'dairy-bread-eggs',
    name: 'Dairy, Bread & Eggs',
    priority: 2
  },
  
  
  
  {
    id: 'bath-body',
    name: 'Bath & Body Essentials',
    priority: 6
  },
  
];

export default function FeaturedCategoriesProducts() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6 bg-white"
    >
      <div className="container mx-auto px-4">
        {FEATURED_CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CategoryProductsShowcase
              categoryId={category.id}
              categoryName={category.name}
              maxProducts={12}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}