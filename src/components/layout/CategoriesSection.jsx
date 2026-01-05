// src/components/layout/CategoriesSection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Zap } from 'lucide-react';
import { CATEGORIES_DATA } from '@/data/categoriesData';

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles size={14} className="fill-current" />
              Department Discovery
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-none italic uppercase">
              Browse <span className="text-orange-500 underline decoration-orange-500/10 underline-offset-8">Aisles</span>
            </h2>
          </div>
          
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/categories')}
            className="group flex items-center gap-4 bg-neutral-900 text-white pl-8 pr-4 py-4 rounded-full shadow-xl shadow-neutral-900/10 active:scale-95 transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">See All Categories</span>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        </div>

        {/* CATEGORY TRACKS */}
        {CATEGORIES_DATA.map((section, idx) => (
          <motion.div 
            key={section.id} 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="mb-16 last:mb-0"
          >
            {/* SUB-SECTION HEADER */}
            <div className="flex items-center justify-between mb-6 px-1 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{section.icon}</span>
                <h3 className="text-xl font-black text-neutral-900 italic uppercase tracking-tight">{section.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-neutral-300 uppercase tracking-widest">
                <Zap size={10} className="fill-current" />
                Swipe to Explore
              </div>
            </div>

            {/* HORIZONTAL KINETIC TRACK */}
            <div className="relative group">
              <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory pt-2">
                {section.subcategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 w-32 md:w-40 snap-start group/item"
                  >
                    {/* IMAGE POD */}
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-100 mb-4 border border-neutral-100 shadow-sm group-hover/item:shadow-2xl group-hover/item:shadow-orange-500/20 transition-all duration-500">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(category.name)}&background=f5f5f5&color=a3a3a3&size=256`;
                        }}
                      />
                      {/* OVERLAY GRADIENT */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                         <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Explore</span>
                      </div>
                    </div>

                    {/* LABEL */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-neutral-900 uppercase tracking-tight leading-tight group-hover/item:text-orange-500 transition-colors">
                        {category.name}
                      </p>
                      <div className="w-0 h-0.5 bg-orange-500 group-hover/item:w-full transition-all duration-300" />
                    </div>
                  </motion.button>
                ))}
                
                {/* INVISIBLE SPACER FOR LAST ITEM */}
                <div className="flex-shrink-0 w-8" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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

