import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { LANG_META, LangCode } from '../../i18n/translations';
import { Wifi, WifiOff, Volume2, VolumeX, Battery, Calendar as CalendarIcon, X, Bell, ChevronUp, Info, Globe } from 'lucide-react';

export const SystemTray: React.FC = () => {
  const {
    isCalendarOpen,
    toggleCalendar,
    toggleControlCenter,
    notifications,
    dismissNotification,
    wifiConnected,
    volume,
    batteryLevel,
    batteryCharging,
    currentLanguage,
    setLanguage,
    t,
    openTour
  } = usePortfolio();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [fullDateStr, setFullDateStr] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'calendar' | 'notifications'>('calendar');

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
      setFullDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLangOpen(false);
    toggleCalendar();
  };

  return (
    <div className="flex items-center gap-1.5 select-none relative text-white" onClick={(e) => e.stopPropagation()}>
      {/* Toast Notifications Popups (auto-dismiss) */}
      {notifications.length > 0 && (
        <div className="fixed bottom-14 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-[#1a1a1a]/95 backdrop-blur-xl p-4 rounded-xl border border-blue-500/40 shadow-2xl space-y-1 relative animate-in fade-in slide-in-from-right-5 duration-200 text-white pointer-events-auto"
            >
              <button
                onClick={() => dismissNotification(n.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Bell className="w-3.5 h-3.5" />
                <span>{n.title}</span>
                <span className="text-[10px] text-slate-400 ml-auto mr-4">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">{n.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Language Switcher */}
      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 text-xs font-bold transition ${
            langOpen ? 'bg-white/15 text-blue-300' : 'text-slate-300'
          }`}
          title={t('tray.inputLang')}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{currentLanguage}</span>
          <ChevronUp className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-0' : 'rotate-180'}`} />
        </button>

        {langOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-12 right-72 w-40 bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-xl border border-white/20 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            {(Object.keys(LANG_META) as LangCode[]).map((code) => (
              <button
                key={code}
                onClick={() => { setLanguage(code); setLangOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                  currentLanguage === code
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'hover:bg-white/10 text-slate-200'
                }`}
              >
                <span className="font-bold">{code}</span>
                <span>{LANG_META[code].local}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tour Button */}
      <button
        onClick={(e) => { e.stopPropagation(); openTour(); }}
        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 text-xs font-medium text-amber-300 transition"
        title={t('tray.tour')}
      >
        <Info className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline text-[11px]">{t('tray.tour')}</span>
      </button>

      {/* Control Center Trigger (WiFi, Volume, Battery) */}
      <div
        onClick={(e) => { e.stopPropagation(); toggleControlCenter(); setLangOpen(false); }}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer transition border border-transparent hover:border-white/10"
        title={t('tray.quickSettings')}
      >
        {wifiConnected ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
        {volume > 0 ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-200">
          <Battery
            className={`w-3.5 h-3.5 ${batteryCharging ? 'text-green-300' : batteryLevel > 20 ? 'text-green-400' : 'text-rose-400'}`}
          />
          <span>{batteryLevel}%</span>
        </div>
      </div>

      {/* Clock / Calendar Trigger */}
      <div
        onClick={handleCalendarClick}
        className={`flex flex-col items-end px-2.5 py-0.5 rounded-lg hover:bg-white/10 cursor-pointer transition ${
          isCalendarOpen ? 'bg-white/10' : ''
        }`}
      >
        <span className="text-xs font-semibold leading-tight">{timeStr}</span>
        <span className="text-[10px] text-slate-300 leading-tight">{dateStr}</span>
      </div>

      {/* Combined Calendar + Notifications Flyout */}
      {isCalendarOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-14 right-4 w-88 bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 text-white overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setNotifTab('calendar')}
              className={`flex-1 py-2.5 text-xs font-bold transition ${
                notifTab === 'calendar'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('tray.calendar')}
            </button>
            <button
              onClick={() => setNotifTab('notifications')}
              className={`flex-1 py-2.5 text-xs font-bold transition relative ${
                notifTab === 'notifications'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('tray.notifications')}
              {notifications.length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Calendar Tab */}
          {notifTab === 'calendar' && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold">{fullDateStr}</span>
                </div>
                <span className="text-[10px] text-blue-400 font-semibold">{timeStr}</span>
              </div>

              {/* Mini Calendar Grid */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-xs font-bold text-center mb-2">{monthNames[currentMonth]} {currentYear}</div>
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((d) => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
                  ))}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === today.getDate();
                    return (
                      <div
                        key={day}
                        className={`text-center text-xs py-1.5 rounded-lg ${
                          isToday
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500">{t('tray.liveTime')}</div>
            </div>
          )}

          {/* Notifications Tab */}
          {notifTab === 'notifications' && (
            <div className="p-2 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{t('tray.noNotifications')}</span>
                  <span className="text-[10px] text-slate-500">{t('tray.allCaughtUp')}</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-rose-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
