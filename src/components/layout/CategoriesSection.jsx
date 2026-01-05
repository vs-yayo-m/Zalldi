// src/components/layout/CategoriesSection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronRight, Grid } from 'lucide-react';
import { CATEGORIES_DATA } from '@/data/categoriesData';

export default function CategoriesSection() {
  const navigate = useNavigate();
  
  const featuredCategories = CATEGORIES_DATA.flatMap(section =>
    section.subcategories.slice(0, 2).map(sub => ({
      ...sub,
      parentColor: section.color,
      parentIcon: section.icon
    }))
  ).slice(0, 11);
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', damping: 20, stiffness: 120 }
    }
  };
  
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white via-orange-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Grid className="w-5 h-5 text-white" />
              </div>
              <span className="text-orange-600 font-black text-sm uppercase tracking-widest">
                Shop Smart
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 leading-tight tracking-tight">
              Browse by <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Category
              </span>
            </h2>
            <p className="text-neutral-600 mt-3 font-semibold text-lg max-w-xl">
              Everything you need, organized perfectly. Shop faster, live better.
            </p>
          </motion.div>

          <motion.button
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/categories')}
            className="flex items-center gap-3 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/30 transition-all group"
          >
            View All
            <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
        >
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -12, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white border-2 border-neutral-100 group-hover:border-orange-500 transition-all duration-500 shadow-md group-hover:shadow-2xl group-hover:shadow-orange-500/20">
                
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full flex flex-col">
                  <div className="flex-1 p-4 pb-2">
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-50">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transform group-hover:scale-125 group-hover:rotate-3 transition-all duration-700 ease-out"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23a3a3a3" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 pt-2">
                    <h3 className="font-black text-neutral-900 text-base md:text-lg leading-tight group-hover:text-orange-600 transition-colors mb-1 line-clamp-2">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                        <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
                      </div>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                        In Stock
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-xl">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-black text-orange-600">View Products</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -12, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/categories')}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-xl shadow-orange-500/40 border-2 border-orange-400">
              
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-black/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-white/50"
                >
                  <Grid className="w-10 h-10 text-orange-600" />
                </motion.div>
                <span className="block text-white font-black text-2xl mb-2">See All</span>
                <span className="text-orange-100 text-sm font-bold uppercase tracking-widest block">
                  Categories
                </span>
                <div className="mt-4 flex items-center justify-center gap-2 text-white/80">
                  <span className="text-xs font-bold">Explore</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-500 font-semibold text-sm mb-4">
            Can't find what you're looking for?
          </p>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-neutral-200 hover:border-orange-500 rounded-2xl font-bold text-neutral-700 hover:text-orange-600 transition-all shadow-sm hover:shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Search Products
          </button>
        </motion.div>
      </div>
    </section>
  );
}