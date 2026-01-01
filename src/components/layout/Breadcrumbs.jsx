import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ZALLDI BREADCRUMBS
 * A premium navigation indicator with responsive truncation and brand-aligned styling.
 */

export default function Breadcrumbs({ items, className = '' }) {
  if (!items || items.length === 0) return null;

  // Logic to handle extremely long breadcrumb paths (e.g., more than 4 levels)
  const shouldTruncate = items.length > 3;
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`group flex items-center py-2 px-1 overflow-x-auto no-scrollbar ${className}`}
    >
      <ol className="flex items-center list-none m-0 p-0">
        {/* Home Entry */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-neutral-400 hover:text-orange-500 transition-all duration-200 ease-out py-1"
            title="Return to Home"
          >
            <div className="p-1 rounded-md bg-neutral-100 group-hover:bg-orange-50 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">Home</span>
          </Link>
        </li>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isIntermediate = shouldTruncate && index > 0 && index < items.length - 2;

          // If we have too many items, we can optionally hide middle ones 
          // but for commerce, usually, we show the full trail.
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 mx-2 shrink-0" />
              
              {isLast ? (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-black text-neutral-900 truncate max-w-[140px] sm:max-w-[250px] uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                </motion.div>
              ) : (
                <Link
                  to={item.to}
                  className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors py-1 whitespace-nowrap uppercase tracking-widest decoration-orange-500/30 underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

