import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import { WALLPAPERS } from '../../data/defaultData';
import { ChevronUp, Wifi, Battery } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { unlockScreen, t } = usePortfolio();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const wallpaper = WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)];

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(unlockScreen, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isUnlocking ? { opacity: 0, scale: 1.02, filter: 'blur(8px)' } : { opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      onMouseMove={(e) => setMouseY(e.clientY)}
      onClick={handleUnlock}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-cover bg-center select-none cursor-pointer"
      style={{ backgroundImage: `url(${wallpaper.url})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Top status bar */}
      <div className="relative z-10 w-full px-8 pt-6 flex items-center justify-between text-white/80 text-xs">
        <span>{timeStr}</span>
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-white/80 text-white/80" />
        </div>
      </div>

      {/* Center: Time, Date, Unlock prompt */}
      <div className="relative z-10 flex flex-col items-center gap-3 -mt-16">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-7xl sm:text-8xl font-extralight text-white tracking-tight drop-shadow-2xl"
        >
          {timeStr}
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg sm:text-xl font-medium text-white/80 drop-shadow-lg"
        >
          {dateStr}
        </motion.div>
      </div>

      {/* Bottom: Swipe up to unlock */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: mouseY > window.innerHeight - 100 ? 1.1 : 1
        }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 pb-16 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center"
        >
          <ChevronUp className="w-6 h-6 text-white/70" />
        </motion.div>
        <span className="text-sm font-medium text-white/60">{t('lock.clickOrSwipe')}</span>
      </motion.div>
    </motion.div>
  );
};
