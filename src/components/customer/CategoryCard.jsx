// src/components/customer/CategoryCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        to={`/category/${category.id}`}
        className="group block relative bg-white rounded-2xl overflow-hidden border-2 border-neutral-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300"
      >
        <div className="aspect-square relative overflow-hidden bg-neutral-50">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold text-neutral-800 text-center leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
            {category.name}
          </h3>
        </div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3"
        >
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}