import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, X, CheckCircle2, AlertCircle, Delete } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const TARGET_PIN = '0246';

  // Handle hardware keyboard typing
  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setHasError(false);
      setIsSuccess(false);
      setErrorMessage('');
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  const handleDigitInput = (digit: string) => {
    if (pin.length >= 4 || isSuccess) return;
    setHasError(false);
    setErrorMessage('');

    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      validatePin(newPin);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin(prev => prev.slice(0, -1));
      setHasError(false);
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    setPin('');
    setHasError(false);
    setErrorMessage('');
  };

  const validatePin = (inputPin: string) => {
    if (inputPin === TARGET_PIN) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setPin('');
        setIsSuccess(false);
      }, 700);
    } else {
      setHasError(true);
      setErrorMessage('Access Denied. Incorrect Security PIN.');
      setTimeout(() => {
        setPin('');
      }, 600);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-emerald-800/20 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header Banner with Circular Logo */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-900 text-white p-5 relative border-b-2 border-amber-500">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-800/60 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-white flex-shrink-0 shadow-md">
                <img
                  src="/upss-logo.jpg"
                  alt="Usman Public School System"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://yt3.googleusercontent.com/5hpubYiQhsYGv5Z0TQeT4QC2eG1W84B9IpUHQh0vZFmPfnkDTeiY04SWdsgJm04yfbFpbxaYew=s900-c-k-c0x00ffffff-no-rj';
                  }}
                />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-amber-100">Management Security</h3>
                <p className="text-xs text-emerald-200">Campus 32 Administrator Verification</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-xs text-center text-slate-600 mb-5">
              Please enter the 4-digit administration authorization PIN to unlock student management features:
            </p>

            {/* PIN Display Boxes with Animated Feedback */}
            <motion.div
              animate={hasError ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex justify-center items-center gap-3 mb-6"
            >
              {[0, 1, 2, 3].map((index) => {
                const filled = pin.length > index;
                return (
                  <motion.div
                    key={index}
                    animate={
                      isSuccess
                        ? { scale: [1, 1.15, 1], backgroundColor: '#ecfdf5' }
                        : filled
                        ? { scale: [1, 1.1, 1] }
                        : {}
                    }
                    className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-150 border-2 ${
                      isSuccess
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : hasError
                        ? 'border-rose-500 bg-rose-50 text-rose-600'
                        : filled
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {filled ? (
                      <span className="inline-block w-3.5 h-3.5 rounded-full bg-emerald-800"></span>
                    ) : (
                      <span className="text-slate-300 text-lg">&bull;</span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Error or Success Message */}
            <div className="h-6 mb-4 flex items-center justify-center text-center">
              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {isSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified successfully! Access granted.</span>
                </div>
              )}
            </div>

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <motion.button
                  key={digit}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleDigitInput(digit)}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 font-semibold text-lg border border-slate-200/80 hover:border-emerald-300 transition shadow-xs flex items-center justify-center cursor-pointer"
                >
                  {digit}
                </motion.button>
              ))}

              {/* Clear button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleClear}
                className="h-12 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-500 font-medium text-xs border border-slate-200 transition cursor-pointer"
                title="Clear all"
              >
                Clear
              </motion.button>

              {/* Zero */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleDigitInput('0')}
                className="h-12 rounded-xl bg-slate-100 hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 font-semibold text-lg border border-slate-200/80 hover:border-emerald-300 transition shadow-xs flex items-center justify-center cursor-pointer"
              >
                0
              </motion.button>

              {/* Backspace button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleBackspace}
                className="h-12 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition flex items-center justify-center cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Footer security badge */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Authorized Administrative Personnel Only</span>
              </span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
