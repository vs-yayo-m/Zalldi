// src/components/layout/CategoriesSection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES_DATA } from '@/data/categoriesData';
import { normalizeCategoriesForHome } from '@/utils/normalizeCategoriesForHome';

export default function CategoriesSection() {
  const navigate = useNavigate();
  
  // Normalize object-based category data into array for UI
  const sections = normalizeCategoriesForHome(CATEGORIES_DATA);
  
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900">
            Shop by Category
          </h2>

          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:gap-3 transition-all"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Sections */}
        {Array.isArray(sections) &&
          sections.map((section) => (
            <div key={section.id} className="mb-10">
              {/* Section title */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="text-lg font-bold text-neutral-800">
                  {section.name}
                </h3>
              </div>

              {/* Horizontal subcategories */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                {section.subcategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 w-24 md:w-28 snap-start group"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-2 border-2 border-transparent group-hover:border-orange-500 transition-all">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>

                    <p className="text-xs font-bold text-neutral-800 text-center leading-tight line-clamp-2">
                      {category.name}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}