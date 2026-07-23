import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SYSTEM_APPS, WALLPAPERS } from '../../data/defaultData';
import { IconHelper } from '../common/IconHelper';
import { AppId } from '../../types';
import {
  Wifi,
  Battery,
  Search,
  ChevronLeft,
  User,
  Award,
  FolderGit2,
  Info,
  X
} from 'lucide-react';
import { SpotlightModal } from './SpotlightModal';
import { WelcomeTourModal } from './WelcomeTourModal';
import { AboutApp } from '../apps/AboutApp';
import { SkillsApp } from '../apps/SkillsApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ExperienceApp } from '../apps/ExperienceApp';
import { TestimonialsApp } from '../apps/TestimonialsApp';
import { ContactApp } from '../apps/ContactApp';
import { BlogApp } from '../apps/BlogApp';
import { TerminalApp } from '../apps/TerminalApp';
import { SettingsApp } from '../apps/SettingsApp';
import { AdminApp } from '../apps/AdminApp';

export const MobileView: React.FC = () => {
  const {
    personalInfo,
    projects,
    settings,
    brightness,
    nightLight,
    toggleSpotlight,
    openTour,
    t
  } = usePortfolio();

  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [timeStr, setTimeStr] = useState('');
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [recentApps, setRecentApps] = useState<AppId[]>([]);
  const swipeStartRef = useRef(0);
  const appSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeWp = WALLPAPERS.find((w) => w.id === settings.wallpaper) || WALLPAPERS[0];
  const featuredProject = projects.find((p) => p.featured) || projects[0];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none font-sans flex flex-col justify-between"
      style={activeWp.url.startsWith('radial-gradient') || activeWp.url.startsWith('linear-gradient')
        ? { backgroundImage: activeWp.url }
        : { backgroundImage: `url(${activeWp.url})` }
      }
    >
      {/* Dark Tint Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-none" />

      {/* Brightness Overlay */}
      {brightness < 100 && (
        <div
          className="absolute inset-0 bg-black pointer-events-none z-[90] transition-opacity duration-150"
          style={{ opacity: (100 - brightness) / 110 }}
        />
      )}

      {/* Night Light Warm Overlay */}
      {nightLight && (
        <div className="absolute inset-0 bg-amber-500/10 mix-blend-color-burn pointer-events-none z-[89] transition-opacity duration-200" />
      )}

      {/* iOS Status Bar & Dynamic Island */}
      <div className="relative z-30 pt-2 px-6 flex items-center justify-between text-white text-xs font-semibold">
        <span>{timeStr}</span>

        {/* Dynamic Island */}
        <div className="bg-black text-white px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-800 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-tight">{personalInfo.name} OS</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={openTour}
            className="p-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30"
            title="Portfolio Tour"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-white text-white" />
        </div>
      </div>

      {/* Main Home Screen Grid & iOS Widgets */}
      <div className="relative z-20 flex-1 px-5 pt-4 pb-20 overflow-y-auto space-y-6 scrollbar-none">
        {/* iOS Weather/Clock & Developer Widget */}
        <div className="grid grid-cols-2 gap-4">
          {/* Widget 1: Personal Status */}
          <div
            onClick={() => setActiveAppId('about')}
            className="bg-white/20 dark:bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/20 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">PROFILE</span>
              <User className="w-4 h-4 text-amber-300" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{personalInfo.name.split(' ')[0]}</div>
              <div className="text-[10px] text-blue-200 line-clamp-1">{personalInfo.title}</div>
            </div>

            <div className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full w-max backdrop-blur-md">
              {personalInfo.metrics.yearsExp}+ Years Exp
            </div>
          </div>

          {/* Widget 2: Featured Project */}
          <div
            onClick={() => setActiveAppId('projects')}
            className="bg-gradient-to-br from-purple-600/80 via-indigo-600/80 to-slate-900/90 backdrop-blur-xl p-4 rounded-3xl border border-white/20 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition space-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase opacity-80 flex items-center gap-1">
                <FolderGit2 className="w-3 h-3 text-purple-300" />
                Featured
              </span>
              <Award className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>

            <div>
              <div className="text-xs font-bold truncate">{featuredProject?.title}</div>
              <div className="text-[10px] text-purple-200 line-clamp-2 mt-0.5">{featuredProject?.shortDesc}</div>
            </div>

            <div className="text-[9px] text-purple-300 font-mono">Tap to View Project →</div>
          </div>
        </div>

        {/* Spotlight Search Toggle Bar */}
        <div
          onClick={toggleSpotlight}
          className="bg-white/20 dark:bg-black/30 backdrop-blur-md text-white text-xs px-4 py-2 rounded-2xl flex items-center justify-between border border-white/20 shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-200" />
            <span className="text-slate-200 font-medium">{t('common.search')}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">Spotlight</span>
        </div>

        {/* App Icons Grid */}
        <div className="grid grid-cols-4 gap-6 pt-2">
          {SYSTEM_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveAppId(app.id as AppId)}
              className="group flex flex-col items-center gap-1.5 transition transform active:scale-95"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.bgGradient} text-white flex items-center justify-center shadow-2xl group-hover:scale-105 transition duration-200 relative`}
              >
                <IconHelper name={app.iconName} className="w-7 h-7" />
                {app.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-white text-center drop-shadow-md leading-tight line-clamp-1">
                {app.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* iOS Bottom Dock Container */}
      <div className="relative z-30 pb-4 px-6">
        <div className="bg-white/20 dark:bg-black/40 backdrop-blur-2xl p-3 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-around">
          {SYSTEM_APPS.slice(0, 4).map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveAppId(app.id as AppId)}
              className="group transition transform active:scale-95"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.bgGradient} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition`}
              >
                <IconHelper name={app.iconName} className="w-6 h-6" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spotlight Search Modal */}
      <SpotlightModal />

      {/* Welcome Tour Modal */}
      <WelcomeTourModal />

      {/* App Switcher Modal (swipe up & hold from bottom) */}
      {showAppSwitcher && (
        <div
          onClick={() => setShowAppSwitcher(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-end pb-24"
        >
          <div className="w-full max-w-lg mx-auto px-4 space-y-4">
            <div className="text-center text-xs text-slate-400 mb-4 tracking-widest uppercase">App Switcher</div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
              {recentApps.length > 0 ? recentApps.map((appId) => {
                const app = SYSTEM_APPS.find((a) => a.id === appId);
                if (!app) return null;
                return (
                  <motion.div
                    key={appId}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => { setActiveAppId(appId); setShowAppSwitcher(false); }}
                    className="snap-center shrink-0 w-48 bg-[#1e1e24]/90 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col items-center gap-3 cursor-pointer active:scale-95 transition"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.bgGradient} flex items-center justify-center shadow-lg`}>
                      <IconHelper name={app.iconName} className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white text-center">{app.title}</span>
                  </motion.div>
                );
              }) : (
                <div className="w-full text-center text-slate-500 text-sm py-10">No recent apps</div>
              )}
            </div>
          </div>
          <div className="w-32 h-1 bg-slate-500 rounded-full mt-6" onClick={() => setShowAppSwitcher(false)} />
        </div>
      )}

      {/* Full-Screen iOS App Sheet Modal with Gestures */}
      <AnimatePresence>
        {activeAppId && (
          <motion.div
            ref={appSheetRef}
            initial={{ y: '100%' }}
            animate={{ y: Math.max(0, swipeOffset) }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onPointerDown={(e) => {
              swipeStartRef.current = e.clientY;
            }}
            onPointerMove={(e) => {
              const delta = e.clientY - swipeStartRef.current;
              if (delta > 0) setSwipeOffset(delta);
            }}
            onPointerUp={(e) => {
              const delta = e.clientY - swipeStartRef.current;
              if (delta > 120) {
                // Track as recent app
                if (activeAppId) {
                  setRecentApps((prev) => {
                    const filtered = prev.filter((a) => a !== activeAppId);
                    return [activeAppId, ...filtered].slice(0, 6);
                  });
                }
                setActiveAppId(null);
              }
              setSwipeOffset(0);
            }}
            className="fixed inset-0 z-50 bg-[#121212] text-white flex flex-col"
          >
            {/* iOS Modal Header Bar */}
            <div className="px-4 py-3 bg-[#1e1e24] border-b border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  if (activeAppId) {
                    setRecentApps((prev) => {
                      const filtered = prev.filter((a) => a !== activeAppId);
                      return [activeAppId, ...filtered].slice(0, 6);
                    });
                  }
                  setActiveAppId(null);
                }}
                className="flex items-center gap-1 text-xs font-bold text-blue-400"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Home</span>
              </button>

              <span className="text-xs font-bold text-white capitalize">
                {SYSTEM_APPS.find((a) => a.id === activeAppId)?.title || activeAppId}
              </span>

              <button
                onClick={() => {
                  if (activeAppId) {
                    setRecentApps((prev) => {
                      const filtered = prev.filter((a) => a !== activeAppId);
                      return [activeAppId, ...filtered].slice(0, 6);
                    });
                  }
                  setActiveAppId(null);
                }}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>

            {/* App Body Content */}
            <div className="flex-1 overflow-y-auto pb-8 bg-[#121212] text-white">
              {activeAppId === 'about' && <AboutApp />}
              {activeAppId === 'skills' && <SkillsApp />}
              {activeAppId === 'projects' && <ProjectsApp />}
              {activeAppId === 'experience' && <ExperienceApp />}
              {activeAppId === 'testimonials' && <TestimonialsApp />}
              {activeAppId === 'contact' && <ContactApp />}
              {activeAppId === 'blog' && <BlogApp />}
              {activeAppId === 'terminal' && <TerminalApp />}
              {activeAppId === 'settings' && <SettingsApp />}
              {activeAppId === 'admin' && <AdminApp />}
            </div>

            {/* iOS Bottom Swipe Dismiss Bar Indicator */}
            <div
              onPointerDown={(e) => {
                swipeStartRef.current = e.clientY;
              }}
              onPointerMove={(e) => {
                const delta = e.clientY - swipeStartRef.current;
                if (delta < -60) {
                  // Swipe up for app switcher
                  if (activeAppId) {
                    setRecentApps((prev) => {
                      const filtered = prev.filter((a) => a !== activeAppId);
                      return [activeAppId, ...filtered].slice(0, 6);
                    });
                  }
                  setShowAppSwitcher(true);
                }
              }}
              className="py-2 flex items-center justify-center bg-[#1e1e24] cursor-pointer active:bg-[#2a2a30] transition-colors"
            >
              <div
                className="w-32 h-1 bg-slate-500 rounded-full"
                style={{ width: `${Math.max(32, 128 - swipeOffset)}px` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
