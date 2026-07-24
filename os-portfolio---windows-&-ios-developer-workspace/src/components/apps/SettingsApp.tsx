import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { WALLPAPERS } from '../../data/defaultData';
import {
  Settings, Volume2, VolumeX, Monitor, Smartphone, RefreshCw, Layers, ShieldAlert,
  Sun, Moon, Palette, Image, ChevronRight, Check
} from 'lucide-react';
import { soundEngine } from '../../utils/sound';
import { WallpaperPickerModal } from '../os/WallpaperPickerModal';

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, setOSMode, resetAllData } = usePortfolio();
  const [showPicker, setShowPicker] = useState(false);
  const [modeRestricted, setModeRestricted] = useState<'desktop' | null>(null);

  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

  const currentWp = WALLPAPERS.find((w) => w.id === settings.wallpaper);
  const currentLockWp = WALLPAPERS.find((w) => w.id === settings.lockWallpaper);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white p-7 rounded-2xl shadow-xl border border-white/10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
              <Settings className="w-5 h-5 text-blue-300" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-xs text-slate-400 ml-[3.25rem]">Display, sound, appearance, and system preferences</p>
        </div>
      </div>

      {/* --- APPEARANCE --- */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-3">
          <Palette className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appearance</h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/50 overflow-hidden">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Switch between dark and light appearance</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center ${
                settings.darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}>
                {settings.darkMode ? <Moon className="w-3 h-3 text-indigo-600" /> : <Sun className="w-3 h-3 text-amber-500" />}
              </div>
            </button>
          </div>

          {/* Wallpaper */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Wallpaper</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Home & Lock screen background</p>
                </div>
              </div>
              <button onClick={() => setShowPicker(true)}
                className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition shadow-sm">
                <ChevronRight className="w-3 h-3" />
                Change
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Home</div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{currentWp?.name || 'None'}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Lock</div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{currentLockWp?.name || 'None'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPicker && <WallpaperPickerModal onClose={() => setShowPicker(false)} />}

      {/* --- SYSTEM --- */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-3">
          <Monitor className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">System</h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/50 overflow-hidden">
          {/* OS Display Mode */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">OS Display Mode</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose how the interface is rendered</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  if (isMobileDevice) { setModeRestricted('desktop'); return; }
                  setOSMode('desktop');
                }}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  settings.osMode === 'desktop'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-[10px] font-semibold leading-tight">Desktop</span>
              </button>

              <button
                onClick={() => setOSMode('mobile')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  settings.osMode === 'mobile'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-[10px] font-semibold leading-tight">Mobile</span>
              </button>

              <button
                onClick={() => setOSMode('auto')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  settings.osMode === 'auto'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Layers className="w-5 h-5" />
                <span className="text-[10px] font-semibold leading-tight">Auto</span>
              </button>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
              {settings.osMode === 'auto' ? 'Automatically matches your screen width' :
               settings.osMode === 'desktop' ? 'Desktop layout with windows & taskbar' :
               'Mobile layout with home screen & dock'}
            </div>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sound Effects</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Click audio, window open sounds & notifications</p>
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !settings.soundEnabled;
                updateSettings({ soundEnabled: nextVal });
                if (nextVal) soundEngine.playNotification(true);
              }}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}>
                {settings.soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-600" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- ADVANCED --- */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-3">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Advanced</h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset System Data</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Restore all portfolio data to factory defaults</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to restore all portfolio data to default?')) {
                  resetAllData();
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restore Default Data
            </button>
          </div>
        </div>
      </div>

      {/* Mode Restriction Dialog */}
      {modeRestricted === 'desktop' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Desktop Mode</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              To view the Windows Desktop interface, please enable <strong>Desktop Mode</strong> (or <strong>Request Desktop Site</strong>) in your browser settings on this device.
            </p>
            <button onClick={() => setModeRestricted(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};