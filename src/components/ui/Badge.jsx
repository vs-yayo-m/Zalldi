// src/components/ui/Badge.jsx

import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = true,
  className = ''
}) => {
  // Ultra-Dynamic Color Engine
  const theme = {
    primary: {
      bg: 'bg-orange-500',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
      border: 'border-orange-400',
      accent: 'bg-orange-300'
    },
    success: {
      bg: 'bg-emerald-600',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      border: 'border-emerald-400',
      accent: 'bg-emerald-300'
    },
    danger: {
      bg: 'bg-rose-600',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_rgba(225,29,72,0.5)]',
      border: 'border-rose-400',
      accent: 'bg-rose-300'
    },
    neutral: {
      bg: 'bg-neutral-900',
      text: 'text-white',
      glow: 'shadow-[0_0_20px_rgba(0,0,0,0.3)]',
      border: 'border-neutral-700',
      accent: 'bg-neutral-500'
    }
  };

  const selected = theme[variant] || theme.primary;

  const sizes = {
    sm: 'h-6 px-3 text-[10px]',
    md: 'h-8 px-5 text-[11px]',
    lg: 'h-10 px-7 text-[13px]'
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, x: -20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05, rotate: -2 }}
      className={`
        relative inline-flex items-center justify-center
        font-black uppercase tracking-[0.25em] italic
        rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm
        border-b-4 border-r-4 border-black/20
        transition-all duration-300 cursor-default overflow-hidden
        ${selected.bg} ${selected.text} ${sizes[size]} 
        ${glow ? selected.glow : ''}
        ${className}
      `}
    >
      {/* 1. KINETIC SCANNER LINE */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
      />

      {/* 2. CHROME CORNER ACCENT */}
      <div className={`absolute top-0 right-0 w-2 h-2 ${selected.accent} opacity-50`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 ${selected.accent} opacity-50`} />

      {/* 3. THE "ZALLDI" GLITCH TEXT EFFECT */}
      <span className="relative z-10 flex items-center gap-2">
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
        >
          {children}
        </motion.span>
        
        {/* Tiny "Speed Indicator" dots */}
        <div className="flex gap-0.5">
           <div className={`w-1 h-1 rounded-full ${selected.accent} animate-pulse`} />
           <div className={`w-1 h-1 rounded-full ${selected.accent} opacity-40`} />
        </div>
      </span>

      {/* 4. LIQUID BORDER OVERLAY */}
      <div className="absolute inset-0 border border-white/20 pointer-events-none" />
    </motion.div>
  );
};

export default Badge;

