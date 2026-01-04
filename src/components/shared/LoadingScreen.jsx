import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Wind, Rocket, Coffee, Bike } from 'lucide-react';

const FUN_SLOGANS = [
  "Order now, delivered before your tea cools down. ☕",
  "Wait... did we just arrive already? ⚡",
  "Blink twice and check your doorstep. 📦",
  "Breaking the sound barrier for your snacks... 🚀",
  "Our delivery partners are basically superheroes. 🦸‍♂️",
  "Putting the 'fast' in 'fast food'. 🏎️",
  "Your cravings don't like waiting, neither do we. 🕒",
  "Teleporting your groceries in 3... 2... 1..."
];

const LoadingScreen = ({ fullScreen = true }) => {
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % FUN_SLOGANS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto">
      
      {/* 1. THE KINETIC DASH ANIMATION */}
      <div className="relative w-full h-32 flex items-center justify-center mb-12">
        {/* Speed Lines Background */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-20">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 400, opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="h-[2px] bg-orange-500 w-24 rounded-full"
            />
          ))}
        </div>

        {/* The "Delivery Rocket" */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="relative z-10 flex items-center gap-4 bg-neutral-900 px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(249,115,22,0.3)]"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <Zap className="text-orange-500 fill-orange-500" size={32} />
          </motion.div>
          <div className="h-8 w-[2px] bg-white/20" />
          <motion.div
             animate={{ x: [0, 5, 0] }}
             transition={{ duration: 0.2, repeat: Infinity }}
          >
            <Bike className="text-white" size={28} />
          </motion.div>
        </motion.div>

        {/* Particle Blast */}
        <motion.div 
            className="absolute right-1/2 translate-x-[-80px] flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {[1, 2, 3].map(p => (
                <motion.div 
                    key={p}
                    animate={{ x: [-20, -100], opacity: [1, 0], scale: [1, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: p * 0.1 }}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                />
            ))}
        </motion.div>
      </div>

      {/* 2. THE PUNCHY SLOGAN ENGINE */}
      <div className="text-center px-8 relative h-20 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={sloganIndex}
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="space-y-2"
          >
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight">
              {FUN_SLOGANS[sloganIndex].split(',')[0]}
            </h3>
            <p className="text-orange-600 font-bold uppercase tracking-[0.2em] text-[10px]">
              {FUN_SLOGANS[sloganIndex].split(',')[1] || "Fastest in the City"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. PROGRESS TRACK (Visual Only) */}
      <div className="w-48 h-1.5 bg-neutral-100 rounded-full mt-8 overflow-hidden">
        <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
        />
      </div>

      {/* 4. IMMERSIVE ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-orange-500/5 rounded-full"
        />
        <motion.div 
            animate={{ 
                rotate: -360,
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-orange-500/10 rounded-full border-dashed"
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white flex items-center justify-center z-[9999]"
      >
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50/40 via-transparent to-transparent" />
        {content}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center py-24 min-h-[500px] w-full">
      {content}
    </div>
  );
};

export default LoadingScreen;

