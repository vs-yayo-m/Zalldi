// src/components/layout/Navigation.jsx
import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/utils/constants';
import { Sparkles, Grid } from 'lucide-react';

/**
 * ZALLDI CATEGORY NAVIGATION
 * A high-performance, scrollable navigation bar designed for rapid category switching.
 */

export default function Navigation({ className = '' }) {
  const scrollRef = useRef(null);
  
  // Limiting top nav to primary categories to maintain performance and focus
  const navCategories = CATEGORIES.slice(0, 10);
  
  return (
    <nav className={`relative z-40 bg-white/80 backdrop-blur-md border-y border-neutral-100 ${className}`}>
      <div className="max-w-7xl mx-auto relative group">

        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 px-4 sm:px-6"
        >
          {/* All Products */}
          <NavLink
            to="/shop"
            end
            className={({ isActive }) =>
              `relative px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-200'
                  : 'text-neutral-500 hover:text-orange-600 hover:bg-orange-50'
              }`
            }
          >
            All Products
          </NavLink>

          {/* Categories (NEW – from reference nav) */}
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `relative px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'text-neutral-500 hover:text-orange-600 hover:bg-orange-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Grid className="w-3.5 h-3.5" />
                <span>Categories</span>

                {isActive && (
                  <motion.div
                    layoutId="nav-pill-active"
                    className="absolute inset-0 bg-orange-500 rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </>
            )}
          </NavLink>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-neutral-200 mx-1 shrink-0" />

          {/* Dynamic Category Links */}
          {navCategories.map((category) => (
            <NavLink
              key={category.id}
              to={`/category/${category.id}`}
              className={({ isActive }) =>
                `relative px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                    : 'text-neutral-500 hover:text-orange-600 hover:bg-orange-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {category.isTrending && !isActive && (
                    <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
                  )}
                  <span>{category.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="nav-pill-active"
                      className="absolute inset-0 bg-orange-500 rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}