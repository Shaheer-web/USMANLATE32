import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, School, Sparkles } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const hasFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Run timer strictly once on mount with hardware-accelerated 60fps+ transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        onCompleteRef.current?.();
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

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
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between px-4 py-6 sm:py-10 bg-gradient-to-br from-[#02170d] via-[#052b1b] to-[#01140a] text-white select-none overflow-hidden gpu-accelerated"
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'opacity, transform',
      }}
    >
      {/* Lightweight GPU-friendly radial glow */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none" 
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Top Header: 3 Distinct, Clear Lines */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="relative z-10 text-center pt-2 space-y-1"
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
      >
        {/* Line 1: Bismillah */}
        <span className="font-serif text-amber-300 text-sm sm:text-base tracking-widest font-medium block">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>

        {/* Line 2: Usman Public School System */}
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-serif">
          Usman Public School System
        </h2>

        {/* Line 3: Campus 32 */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-emerald-300/90 font-medium">
          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
            Campus 32
          </span>
          <span>&bull;</span>
          <span>Girls Campus (Class VI - X)</span>
        </div>
      </motion.div>

      {/* Centerpiece: Animated Words with 60fps GPU acceleration */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center my-auto w-full max-w-sm sm:max-w-md px-2"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* School Crest Badge */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-4 sm:mb-5"
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        >
          <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-emerald-800 to-emerald-950 border-2 border-amber-400 shadow-xl flex items-center justify-center p-2">
            <div className="w-full h-full rounded-full border border-amber-300/40 flex items-center justify-center bg-black/20">
              <School className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 drop-shadow" />
            </div>
          </div>
        </motion.div>

        {/* Word 1: WELCOME (60fps smooth spring cascade) */}
        <div className="flex justify-center items-center tracking-wide whitespace-nowrap overflow-visible">
          {welcomeLetters.map((char, idx) => (
            <motion.span
              key={`w-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.25 + idx * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
              className="inline-block text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white drop-shadow-md mx-[0.5px] xs:mx-[1px]"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Word 2: USMANIAN (60fps Golden Gleam, perfectly responsive) */}
        <div className="flex justify-center items-center tracking-wide whitespace-nowrap overflow-visible mt-1 sm:mt-2">
          {usmanianLetters.map((char, idx) => (
            <motion.span
              key={`u-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.45 + idx * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
              className="inline-block text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black font-serif bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)] mx-[0.5px] xs:mx-[1px]"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Subtitles */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
          className="mt-3 sm:mt-4 space-y-1 px-2"
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        >
          <p className="text-amber-200/90 font-serif text-xs sm:text-sm md:text-base leading-relaxed">
            علم، کردار اور نظم و ضبط کا باوقار گہوارہ
          </p>
          <p className="text-[10px] sm:text-xs text-emerald-200/70 font-sans tracking-wide">
            Daily Punctuality & Discipline Portal
          </p>
        </motion.div>
      </div>

      {/* Bottom Action & 60fps Hardware-Accelerated Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xs flex flex-col items-center gap-2.5 pb-2"
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
      >
        {/* Pure CSS/Motion GPU Progress Bar - 60fps+ with ZERO state re-renders */}
        <div className="w-full bg-emerald-950/90 border border-emerald-800/80 rounded-full h-1.5 p-0.5 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.6, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            style={{ transform: 'translateZ(0)', willChange: 'width' }}
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

        <span className="text-[10px] text-emerald-300/60 font-mono">
          Loading Campus 32 System...
        </span>
      </motion.div>
    </motion.div>
  );
};
