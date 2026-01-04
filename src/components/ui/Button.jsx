// src/components/ui/Button.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  
  // Enterprise-Grade Kinetic Variants
  const variants = {
    primary: 'bg-neutral-900 text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-orange-500/20',
    orange: 'bg-orange-500 text-white shadow-[0_20px_40px_rgba(249,115,22,0.3)] hover:shadow-orange-600/40',
    secondary: 'bg-white text-neutral-900 border-2 border-neutral-100 hover:border-orange-500 hover:text-orange-600 shadow-sm',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
    danger: 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
  };
  
  const sizes = {
    sm: 'h-10 px-4 text-[11px] font-black uppercase tracking-widest',
    md: 'h-14 px-8 text-[13px] font-black uppercase tracking-[0.15em]',
    lg: 'h-16 px-10 text-[15px] font-black uppercase tracking-[0.2em]'
  };
  
  const buttonClasses = `
    relative inline-flex items-center justify-center 
    rounded-2xl transition-all duration-500 
    focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden group italic
    ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
  `;

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {/* 1. THE "GLOW-WASH" EFFECT (Only on primary/orange) */}
      {(variant === 'primary' || variant === 'orange') && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[45deg] pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {/* 2. LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-inherit flex items-center justify-center z-20"
          >
            <Loader2 className="animate-spin" size={20} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CONTENT WRAPPER */}
      <span className={`flex items-center gap-3 relative z-10 transition-transform duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Left Icon with Magnetic Kick */}
        {leftIcon && (
          <motion.span 
            className="group-hover:-translate-x-1 transition-transform"
          >
            {leftIcon}
          </motion.span>
        )}
        
        <span className="relative">
          {children}
          {/* Underline Dash Effect */}
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-current opacity-50 group-hover:w-full transition-all duration-300" />
        </span>

        {/* Right Icon / Zap Indicator */}
        {rightIcon ? (
          <motion.span className="group-hover:translate-x-1 transition-transform">
            {rightIcon}
          </motion.span>
        ) : (
          variant === 'orange' && (
            <Zap size={14} className="opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all fill-current" />
          )
        )}
      </span>

      {/* 4. LIQUID BORDER (Subtle) */}
      <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
    </motion.button>
  );
};

export default Button;

