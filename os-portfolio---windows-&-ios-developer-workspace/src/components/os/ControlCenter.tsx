import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { WALLPAPERS, WallpaperDef } from '../../data/defaultData';
import { WallpaperPickerModal } from './WallpaperPickerModal';
import {
  Volume2, VolumeX, Wifi, WifiOff, Sun, Moon, Settings,
  Bluetooth, BluetoothConnected, Monitor, Accessibility,
  Radio, Info, Sliders,
  ChevronRight, Battery
} from 'lucide-react';
import { soundEngine } from '../../utils/sound';

export const ControlCenter: React.FC = () => {
  const {
    isControlCenterOpen,
    toggleControlCenter,
    settings,
    updateSettings,
    brightness,
    setBrightness,
    volume,
    setVolume,
    wifiConnected,
    toggleWifi,
    nightLight,
    toggleNightLight,
    batteryLevel,
    batteryCharging,
    openWindow,
    openTour,
    t
  } = usePortfolio();

  const [bluetoothOn, setBluetoothOn] = React.useState(true);
  const [airplaneMode, setAirplaneMode] = React.useState(false);
  const [showWpPicker, setShowWpPicker] = React.useState(false);

  if (!isControlCenterOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-4 sm:right-12 w-80 sm:w-88 bg-white/90 dark:bg-[#18181b]/95 backdrop-blur-2xl rounded-2xl border border-gray-200/80 dark:border-white/20 shadow-2xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200 select-none text-gray-900 dark:text-white"
    >
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-2.5">
        <h3 className="text-xs font-bold flex items-center gap-2 text-blue-500 dark:text-blue-400">
          <Sliders className="w-3.5 h-3.5" />
          <span>{t('cc.title')}</span>
        </h3>
        <button
          onClick={() => { openTour(); toggleControlCenter(); }}
          className="text-[10px] flex items-center gap-1 text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 hover:bg-amber-200 dark:hover:bg-amber-500/20 px-2 py-1 rounded-md border border-amber-300 dark:border-amber-500/20 transition"
        >
          <Info className="w-3 h-3" />
          <span>{t('tray.tour')}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={toggleWifi}
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            wifiConnected
              ? 'bg-blue-600/80 border-blue-500/60 text-white shadow-md'
              : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          {wifiConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          <span>Wi-Fi</span>
        </button>

        <button
          onClick={() => { updateSettings({ darkMode: !settings.darkMode }); }}
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            settings.darkMode
              ? 'bg-indigo-600/80 border-indigo-500/60 text-white shadow-md'
              : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span>Theme</span>
        </button>

        <button
          onClick={() => setBluetoothOn((p) => !p)}
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            bluetoothOn
              ? 'bg-blue-600/80 border-blue-500/60 text-white shadow-md'
              : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          {bluetoothOn ? <BluetoothConnected className="w-5 h-5" /> : <Bluetooth className="w-5 h-5" />}
          <span>Bluetooth</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-300">
              <Sun className="w-3.5 h-3.5" />
              <span>Brightness</span>
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{brightness}%</span>
          </div>
          <input type="range" min="20" max="100" value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full accent-blue-500" />
        </div>

        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-300">
              {volume > 0 ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>Volume</span>
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{volume}%</span>
          </div>
          <input type="range" min="0" max="100" value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full accent-blue-500" />
        </div>
      </div>

      <div className="bg-black/5 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${nightLight ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-slate-500'}`}>
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 dark:text-slate-200">Night Light</div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400">Warm tint, reduced blue light</div>
          </div>
        </div>
        <button
          onClick={toggleNightLight}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            nightLight ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200'
          }`}
        >
          {nightLight ? 'On' : 'Off'}
        </button>
      </div>

      <div className="bg-black/5 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-gray-400 dark:text-slate-500">
            <Battery className={`w-5 h-5 ${batteryCharging ? 'text-green-500 dark:text-green-400' : batteryLevel > 20 ? 'text-gray-600 dark:text-green-400' : 'text-red-500'}`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-700 dark:text-slate-200">
              Battery {batteryCharging && '(Charging)'}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400">{batteryLevel}% remaining</div>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-700 dark:text-slate-200">{batteryLevel}%</span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => { openWindow('settings'); toggleControlCenter(); }}
          className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-slate-300 transition"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => { setShowWpPicker(true); }}
          className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-slate-300 transition"
        >
          <Monitor className="w-4 h-4" />
          <span>Wallpaper</span>
        </button>
      </div>

      {showWpPicker && <WallpaperPickerModal onClose={() => setShowWpPicker(false)} />}
    </div>
  );
};