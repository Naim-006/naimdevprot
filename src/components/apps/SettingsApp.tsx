import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { WALLPAPERS } from '../../data/defaultData';
import { Settings, Volume2, VolumeX, Monitor, Smartphone, RefreshCw, Check, Layers, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../../utils/sound';
import { WallpaperPickerModal } from '../os/WallpaperPickerModal';

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, setOSMode, resetAllData, t } = usePortfolio();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-300" />
          <span>System Preferences & Personalization</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Customize desktop wallpaper, interactive audio feedback, display mode, and OS diagnostics.
        </p>
      </div>

      {/* OS Mode Switcher */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-500" />
          <span>OS Display Mode</span>
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setOSMode('desktop')}
            className={`p-4 rounded-xl border text-center transition flex flex-col items-center gap-2 ${
              settings.osMode === 'desktop'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Monitor className="w-6 h-6" />
            <span className="text-xs">Windows Desktop</span>
          </button>

          <button
            onClick={() => setOSMode('mobile')}
            className={`p-4 rounded-xl border text-center transition flex flex-col items-center gap-2 ${
              settings.osMode === 'mobile'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Smartphone className="w-6 h-6" />
            <span className="text-xs">iOS Home Screen</span>
          </button>

          <button
            onClick={() => setOSMode('auto')}
            className={`p-4 rounded-xl border text-center transition flex flex-col items-center gap-2 ${
              settings.osMode === 'auto'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Layers className="w-6 h-6" />
            <span className="text-xs">Auto Responsive</span>
          </button>
        </div>
      </div>

      {/* Wallpapers */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Wallpapers</h2>
          <button onClick={() => setShowPicker(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">
            Change Wallpaper
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Home: <span className="text-slate-700 dark:text-slate-200 font-semibold">{WALLPAPERS.find((w) => w.id === settings.wallpaper)?.name || 'None'}</span></span>
          <span>Lock: <span className="text-slate-700 dark:text-slate-200 font-semibold">{WALLPAPERS.find((w) => w.id === settings.lockWallpaper)?.name || 'None'}</span></span>
        </div>
      </div>

      {showPicker && <WallpaperPickerModal onClose={() => setShowPicker(false)} />}

      {/* Sound Effects & Audio */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
            {settings.soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">OS Sound Synthesizer</h3>
            <p className="text-xs text-slate-500">Enable click audio, window open sound effects, and chime notifications.</p>
          </div>
        </div>

        <button
          onClick={() => {
            const nextVal = !settings.soundEnabled;
            updateSettings({ soundEnabled: nextVal });
            if (nextVal) soundEngine.playNotification(true);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            settings.soundEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          {settings.soundEnabled ? 'Audio On' : 'Audio Muted'}
        </button>
      </div>

      {/* Danger Zone / Reset Data */}
      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-6 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Reset System Data</span>
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          Revert all dynamic edits back to the initial pre-populated developer portfolio data.
        </p>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to restore all portfolio data to default?')) {
              resetAllData();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restore Default Dataset</span>
        </button>
      </div>
    </div>
  );
};
