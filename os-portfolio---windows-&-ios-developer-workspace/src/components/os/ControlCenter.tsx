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
      className="fixed bottom-14 right-4 sm:right-12 w-80 sm:w-88 bg-[#18181b]/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200 select-none text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <h3 className="text-xs font-bold flex items-center gap-2 text-blue-400">
          <Sliders className="w-3.5 h-3.5" />
          <span>{t('cc.title')}</span>
        </h3>
        <button
          onClick={() => { openTour(); toggleControlCenter(); }}
          className="text-[10px] flex items-center gap-1 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-md border border-amber-500/20 transition"
        >
          <Info className="w-3 h-3" />
          <span>{t('tray.tour')}</span>
        </button>
      </div>

      {/* Quick Toggles Grid (3 columns, Win11 style) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Wi-Fi */}
        <button
          onClick={toggleWifi}
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            wifiConnected
              ? 'bg-blue-600/80 border-blue-500/60 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          {wifiConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5 text-rose-400" />}
          <span className="text-[10px] font-bold">{t('cc.wifi')}</span>
          <span className={`text-[8px] ${wifiConnected ? 'text-blue-200' : 'text-slate-500'}`}>
            {wifiConnected ? t('cc.connected') : t('cc.off')}
          </span>
        </button>

        {/* Bluetooth */}
        <button
          onClick={() => setBluetoothOn(!bluetoothOn)}
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            bluetoothOn
              ? 'bg-blue-600/80 border-blue-500/60 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          {bluetoothOn ? <BluetoothConnected className="w-5 h-5" /> : <Bluetooth className="w-5 h-5" />}
          <span className="text-[10px] font-bold">{t('cc.bluetooth')}</span>
          <span className={`text-[8px] ${bluetoothOn ? 'text-blue-200' : 'text-slate-500'}`}>
            {bluetoothOn ? t('cc.on') : t('cc.off')}
          </span>
        </button>

        {/* Night Light */}
        <button
          onClick={toggleNightLight}
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            nightLight
              ? 'bg-amber-600/80 border-amber-500/60 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          {nightLight ? <Moon className="w-5 h-5 text-amber-200" /> : <Moon className="w-5 h-5 text-slate-400" />}
          <span className="text-[10px] font-bold">{t('cc.nightLight')}</span>
          <span className={`text-[8px] ${nightLight ? 'text-amber-200' : 'text-slate-500'}`}>
            {nightLight ? t('cc.on') : t('cc.off')}
          </span>
        </button>

        {/* Airplane Mode */}
        <button
          onClick={() => setAirplaneMode(!airplaneMode)}
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            airplaneMode
              ? 'bg-amber-600/80 border-amber-500/60 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          <Monitor className={`w-5 h-5 ${airplaneMode ? 'text-amber-200' : ''}`} />
          <span className="text-[10px] font-bold">{t('cc.airplane')}</span>
          <span className={`text-[8px] ${airplaneMode ? 'text-amber-200' : 'text-slate-500'}`}>
            {airplaneMode ? t('cc.on') : t('cc.off')}
          </span>
        </button>

        {/* Accessibility */}
        <button
          className="p-3 rounded-xl border border-white/10 text-xs font-semibold flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-400 transition"
        >
          <Accessibility className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('cc.accessibility')}</span>
          <span className="text-[8px] text-slate-500">{t('cc.off')}</span>
        </button>

        {/* Battery Saver */}
        <button
          className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
            batteryCharging
              ? 'bg-green-600/80 border-green-500/60 text-white shadow-md'
              : batteryLevel < 20
              ? 'bg-rose-600/80 border-rose-500/60 text-white shadow-md'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          <Battery className={`w-5 h-5 ${batteryCharging ? 'text-green-200' : ''}`} />
          <span className="text-[10px] font-bold">{batteryCharging ? t('cc.charging') : t('cc.battery')}</span>
          <span className={`text-[8px] ${batteryCharging ? 'text-green-200' : 'text-slate-500'}`}>{batteryLevel}%</span>
        </button>
      </div>

      {/* Brightness Slider */}
      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-300 mb-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('cc.brightness')}</span>
          <span className="ml-auto text-amber-400 font-bold">{brightness}%</span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
        />
      </div>

      {/* Volume Slider */}
      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-300 mb-1.5">
          {volume > 0 ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          <span>{t('cc.volume')}</span>
          <span className="ml-auto text-blue-400 font-bold">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            const val = Number(e.target.value);
            setVolume(val);
            if (val > 0 && settings.soundEnabled) soundEngine.playClick(true);
          }}
          className="w-full accent-blue-500 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
        />
      </div>

      {/* Bottom row: Sound toggle + Wallpaper */}
      <div className="grid grid-cols-2 gap-2">
        {/* Sound Effects */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold">
            <Radio className="w-3 h-3 text-purple-400" />
            <span>{t('cc.sound')}</span>
          </div>
          <button
            onClick={() => {
              const nextVal = !settings.soundEnabled;
              updateSettings({ soundEnabled: nextVal });
              if (nextVal) soundEngine.playNotification(true);
            }}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold transition border ${
              settings.soundEnabled
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-white/10 border-white/20 text-slate-400'
            }`}
          >
            {settings.soundEnabled ? t('cc.on') : t('cc.off')}
          </button>
        </div>

        {/* Wallpaper Quick Picker */}
        <button onClick={() => setShowWpPicker(true)}
          className="bg-white/5 border border-white/10 rounded-xl p-2.5 hover:bg-white/10 transition text-left">
          <div className="text-[9px] font-bold text-slate-400 mb-1">{t('cc.wallpaper')}</div>
          <div className="flex gap-1">
            {WALLPAPERS.slice(0, 5).map((wp) => {
              const isGrad = wp.url.startsWith('radial-gradient') || wp.url.startsWith('linear-gradient');
              return (
                <div key={wp.id}
                  className={`flex-1 h-7 rounded-md overflow-hidden border ${settings.wallpaper === wp.id ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-white/10'}`}
                  style={isGrad ? { background: wp.url } : undefined}
                >
                  {!isGrad && <img src={wp.url} alt="" className="w-full h-full object-cover" />}
                </div>
              );
            })}
          </div>
        </button>
      </div>

      {showWpPicker && <WallpaperPickerModal onClose={() => setShowWpPicker(false)} />}

      {/* All Settings Footer */}
      <div className="pt-1">
        <button
          onClick={() => { openWindow('settings'); toggleControlCenter(); }}
          className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white rounded-xl transition flex items-center justify-center gap-2"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t('cc.allSettings')}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
