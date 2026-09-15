import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, School, Star } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const totalDurationMs = 3200; // 3.2s smooth animated intro

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  const welcomeLetters = "WELCOME".split("");
  const usmanianLetters = "USMANIAN".split("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between px-4 py-8 sm:py-12 bg-gradient-to-br from-[#02170d] via-[#052b1b] to-[#01140a] text-white select-none overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating subtle stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
              y: [0, -25, 0]
            }}
            transition={{ 
              duration: 3 + (i % 2), 
              repeat: Infinity, 
              delay: i * 0.4 
            }}
            className="absolute text-amber-300/30"
            style={{
              top: `${15 + (i * 10)}%`,
              left: `${10 + ((i * 18) % 80)}%`
            }}
          >
            <Star className="w-2.5 h-2.5 fill-amber-300/20" />
          </motion.div>
        ))}
      </div>

      {/* Top Header: Bismillah */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 text-center"
      >
        <span className="font-serif text-amber-300/90 text-sm sm:text-base tracking-widest font-medium block">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
        <span className="text-[10px] sm:text-xs text-emerald-300/70 tracking-widest uppercase font-mono mt-1 block">
          Usman Public School System &bull; Campus 32
        </span>
      </motion.div>

      {/* Middle Animated Centerpiece */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto w-full max-w-lg px-2">
        {/* Emblem Crest */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
          className="relative mb-5 sm:mb-6"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-emerald-800 to-emerald-950 border-2 border-amber-400 shadow-xl flex items-center justify-center p-2.5">
            <div className="w-full h-full rounded-full border border-amber-300/30 flex items-center justify-center bg-black/20">
              <School className="w-7 h-7 sm:w-9 sm:h-9 text-amber-300 drop-shadow" />
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none"
          />
        </motion.div>

        {/* Stacked Animated Words: WELCOME USMANIAN */}
        <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 mb-3">
          {/* Line 1: WELCOME */}
          <div className="flex justify-center tracking-wider">
            {welcomeLetters.map((char, idx) => (
              <motion.span
                key={`w-${idx}`}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 180,
                  delay: 0.5 + idx * 0.05,
                }}
                className="inline-block text-3xl sm:text-5xl md:text-6xl font-black font-serif text-white tracking-wide drop-shadow-lg"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Line 2: USMANIAN (Golden Gleam) */}
          <div className="flex justify-center tracking-wider relative">
            {usmanianLetters.map((char, idx) => (
              <motion.span
                key={`u-${idx}`}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 180,
                  delay: 0.8 + idx * 0.05,
                }}
                className="inline-block text-4xl sm:text-6xl md:text-7xl font-black font-serif bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Urdu & English Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-2 space-y-1"
        >
          <p className="text-amber-200/90 font-serif text-sm sm:text-base">
            علم، کردار اور نظم و ضبط کا باوقار گہوارہ
          </p>
          <p className="text-[11px] sm:text-xs text-emerald-200/60 font-sans">
            Campus 32 &bull; Daily Punctuality & Character Monitoring
          </p>
        </motion.div>
      </div>

      {/* Bottom Action & Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="relative z-10 w-full max-w-xs flex flex-col items-center gap-3"
      >
        {/* Progress Bar */}
        <div className="w-full bg-emerald-950/80 border border-emerald-800/60 rounded-full h-1.5 p-0.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Enter Portal Button */}
        <button
          onClick={onComplete}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Enter Portal (داخل ہوں)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-emerald-300/50 font-mono">
          Loading Campus 32 System...
        </span>
      </motion.div>
    </motion.div>
  );
};
