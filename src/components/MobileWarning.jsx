import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileWarning({ onDismiss }) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(onDismiss, 300); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-8 text-center shadow-2xl"
          >
            {/* Icon */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-tgteal to-tgmagenta flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-4">
              Optimized for Large Displays
            </h2>

            {/* Message */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              This slideshow is designed for conference booth displays and large screens.
              For the best experience, please visit us at the booth or view on a desktop device.
            </p>

            {/* Branding */}
            <div className="mb-6 text-sm text-gray-400">
              <span className="font-semibold text-tgteal">TechGuilds</span> × <span className="font-semibold text-tgmagenta">Kajoo AI</span>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDismiss}
                className="w-full px-6 py-3 bg-gradient-to-r from-tgteal to-tgmagenta text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                View Anyway
              </button>
              <p className="text-xs text-gray-500">
                Note: Content may overflow on mobile devices
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
