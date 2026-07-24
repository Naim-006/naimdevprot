import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import { WALLPAPERS, WallpaperDef } from '../../data/defaultData';
import { X, Monitor, Lock, Layers } from 'lucide-react';

interface Props {
  onClose: () => void;
}

type Target = 'home' | 'lock' | 'both';

export const WallpaperPickerModal: React.FC<Props> = ({ onClose }) => {
  const { settings, updateSettings, t } = usePortfolio();
  const [selectedWp, setSelectedWp] = useState<WallpaperDef | null>(null);

  const handleSelect = (wp: WallpaperDef) => setSelectedWp(wp);

  const apply = (tgt: Target) => {
    if (!selectedWp) return;
    if (tgt === 'home' || tgt === 'both') updateSettings({ wallpaper: selectedWp.id });
    if (tgt === 'lock' || tgt === 'both') updateSettings({ lockWallpaper: selectedWp.id });
    onClose();
  };

  const isGradient = (url: string) => url.startsWith('radial-gradient') || url.startsWith('linear-gradient');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-2 md:p-4 pt-16 md:pt-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-white/10 w-full max-w-2xl shadow-2xl p-5 space-y-4 my-auto text-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            Change Wallpaper
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-slate-400 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-black/20 dark:scrollbar-thumb-white/10">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => handleSelect(wp)}
              className={`relative h-14 md:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                selectedWp?.id === wp.id ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30'
              }`}
              style={isGradient(wp.url) ? { background: wp.url } : undefined}
              title={wp.name}
            >
              {!isGradient(wp.url) && <img src={wp.url} alt={wp.name} loading="lazy" className="w-full h-full object-cover" />}
            </button>
          ))}
        </div>

        {selectedWp && (
          <div className="space-y-3 bg-gray-100/70 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/10">
            <div className="h-20 md:h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10"
              style={isGradient(selectedWp.url) ? { background: selectedWp.url } : undefined}>
              {!isGradient(selectedWp.url) && <img src={selectedWp.url} alt="" loading="lazy" className="w-full h-full object-cover" />}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => apply('home')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition">
                <Monitor className="w-3.5 h-3.5" /> Home
              </button>
              <button onClick={() => apply('lock')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition">
                <Lock className="w-3.5 h-3.5" /> Lock
              </button>
              <button onClick={() => apply('both')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition">
                <Layers className="w-3.5 h-3.5" /> Both
              </button>
            </div>
          </div>
        )}

        <div className="text-[10px] text-gray-500 dark:text-slate-500 text-center border-t border-gray-200 dark:border-white/10 pt-3">
          Home: <span className="text-gray-700 dark:text-slate-300">{WALLPAPERS.find((w) => w.id === settings.wallpaper)?.name || 'None'}</span>
          &nbsp;| Lock: <span className="text-gray-700 dark:text-slate-300">{WALLPAPERS.find((w) => w.id === settings.lockWallpaper)?.name || 'None'}</span>
        </div>
      </motion.div>
    </div>
  );
};
