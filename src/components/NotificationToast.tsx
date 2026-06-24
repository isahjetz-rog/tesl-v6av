import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface ToastItem {
  name: string;
  country: string;
  countryCode: string;
  car: string;
  fee: string;
  status: string;
}

const LIVE_NOTIFICATIONS: ToastItem[] = [
  { name: 'Mei L.', country: 'Singapore', countryCode: 'sg', car: 'Tesla Model Y 2025', fee: '$319', status: 'Car confirmed & dispatched!' },
  { name: 'Fatima A.', country: 'UAE', countryCode: 'ae', car: 'Tesla Model 3 2025', fee: '$299', status: 'Car dispatched 🚚' },
  { name: 'Emma W.', country: 'Canada', countryCode: 'ca', car: 'Tesla Model Y 2025', fee: '$249', status: 'Vehicle en route 🚚' },
  { name: 'Raj P.', country: 'India', countryCode: 'in', car: 'Tesla Model 3 2024', fee: '299', status: 'Delivery confirmed ✓' },
  { name: 'Fatima A.', country: 'UAE', countryCode: 'ae', car: 'Tesla Cybertruck 2025', fee: '$349', status: 'Car dispatched 🚚' },
  { name: 'Hans M.', country: 'Germany', countryCode: 'de', car: 'Tesla Cybertruck 2025', fee: '$399', status: 'Vehicle en route 🚚' },
  { name: 'Lucas B.', country: 'Brazil', countryCode: 'br', car: 'Tesla Model Y 2025', fee: '$399', status: 'Delivery confirmed ✓' },
  { name: 'Amara N.', country: 'South Africa', countryCode: 'za', car: 'Tesla Model X 2025', fee: '$349', status: 'Shipment confirmed ✓' },
  { name: 'Liam M.', country: 'Ireland', countryCode: 'ie', car: 'Tesla Model Y 2025', fee: '$399', status: 'Delivery confirmed ✓' },
];

export default function NotificationToast() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tick down progress bar over 5 seconds
    const duration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          setIsVisible(false);
          return 100;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [index]);

  useEffect(() => {
    if (!isVisible) {
      // Small timeout to cycle to the next notification and animate back in
      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
        setProgress(100);
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const current = LIVE_NOTIFICATIONS[index];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-auto w-full bg-neutral-900/95 border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden relative"
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox Icon Indicator */}
              <div className="bg-red-600/10 text-red-500 rounded-full p-2 mt-0.5 border border-red-500/20 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              {/* Text Information column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between space-x-2">
                  <span className="text-white text-xs font-bold font-sans">
                    {current.name}{' '}
                    <span className="text-neutral-400 font-normal lowercase text-[10px] ml-1">
                      {current.countryCode} {current.country}
                    </span>
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Just paid delivery fee for
                </p>
                <p className="text-red-500 text-xs font-bold mt-0.5 uppercase tracking-wide">
                  {current.car}
                </p>
                
                <div className="flex items-center space-x-1.5 mt-2 text-emerald-400 font-semibold text-[11px]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    {current.status} ({current.fee} fee paid)
                  </span>
                </div>
              </div>
            </div>

            {/* Red Progress Indicator bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-75" style={{ width: `${progress}%` }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
