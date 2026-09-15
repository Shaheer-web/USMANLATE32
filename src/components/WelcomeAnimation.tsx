import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, School, Star } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const totalDurationMs = 2800; // 2.8s snappy, elegant intro
  const hasFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete reference fresh without triggering effect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Run the progress timer strictly once on mount
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          setTimeout(() => {
            onCompleteRef.current?.();
          }, 150);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, []); // Strictly empty dependency array so it never restarts

  const handleManualEnter = () => {
    if (!hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onCompleteRef.current?.();
    }
  };

  const welcomeLetters = "WELCOME".split("");
  const usmanianLetters = "USMANIAN".split("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between px-4 py-6 sm:py-10 bg-gradient-to-br from-[#02170d] via-[#052b1b] to-[#01140a] text-white select-none overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ 
              opacity: [0.2, 0.7, 0.2],
              scale: [0.9, 1.15, 0.9],
              y: [0, -15, 0]
            }}
            transition={{ 
              duration: 3 + (i % 2), 
              repeat: Infinity, 
              delay: i * 0.4 
            }}
            className="absolute text-amber-300/30"
            style={{
              top: `${18 + (i * 12)}%`,
              left: `${12 + ((i * 22) % 76)}%`
            }}
          >
            <Star className="w-2.5 h-2.5 fill-amber-300/20" />
          </motion.div>
        ))}
      </div>

      {/* Top Header: Bismillah */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 text-center pt-2"
      >
        <span className="font-serif text-amber-300/90 text-sm sm:text-base tracking-widest font-medium block">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
        <span className="text-[10px] sm:text-xs text-emerald-300/70 tracking-wider uppercase font-mono mt-0.5 block">
          Usman Public School System &bull; Campus 32
        </span>
      </motion.div>

      {/* Centerpiece: Animated Words with perfect responsive text on mobile */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto w-full max-w-sm sm:max-w-md px-2">
        {/* School Crest Badge */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.2 }}
          className="relative mb-4 sm:mb-6"
        >
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-emerald-800 to-emerald-950 border-2 border-amber-400 shadow-lg flex items-center justify-center p-2">
            <div className="w-full h-full rounded-full border border-amber-300/30 flex items-center justify-center bg-black/20">
              <School className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 drop-shadow" />
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none"
          />
        </motion.div>

        {/* Word 1: WELCOME (responsive size, no wrap) */}
        <div className="flex justify-center items-center tracking-wide whitespace-nowrap overflow-visible">
          {welcomeLetters.map((char, idx) => (
            <motion.span
              key={`w-${idx}`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                damping: 14,
                stiffness: 180,
                delay: 0.35 + idx * 0.04,
              }}
              className="inline-block text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white drop-shadow-md mx-[0.5px] xs:mx-[1px]"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Word 2: USMANIAN (Golden Gleam, responsive, fits on all phones) */}
        <div className="flex justify-center items-center tracking-wide whitespace-nowrap overflow-visible mt-1 sm:mt-2">
          {usmanianLetters.map((char, idx) => (
            <motion.span
              key={`u-${idx}`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                damping: 14,
                stiffness: 180,
                delay: 0.65 + idx * 0.04,
              }}
              className="inline-block text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black font-serif bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.45)] mx-[0.5px] xs:mx-[1px]"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Urdu & English Subtitle: Clean line height and font size */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-3 sm:mt-4 space-y-1 px-2"
        >
          <p className="text-amber-200/90 font-serif text-xs sm:text-sm md:text-base leading-relaxed">
            علم، کردار اور نظم و ضبط کا باوقار گہوارہ
          </p>
          <p className="text-[10px] sm:text-xs text-emerald-200/70 font-sans tracking-wide">
            Campus 32 &bull; Daily Punctuality & Character Monitoring
          </p>
        </motion.div>
      </div>

      {/* Bottom Action & Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.2 }}
        className="relative z-10 w-full max-w-xs flex flex-col items-center gap-2.5 pb-2"
      >
        {/* Progress Bar */}
        <div className="w-full bg-emerald-950/80 border border-emerald-800/60 rounded-full h-1.5 p-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Enter Portal Button */}
        <button
          onClick={handleManualEnter}
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
