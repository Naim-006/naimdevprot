import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SYSTEM_APPS, WALLPAPERS } from '../../data/defaultData';
import { IconHelper } from '../common/IconHelper';
import { AppId } from '../../types';
import {
  Search, ChevronLeft, User, Award, FolderGit2,
  X, Folder, Info, Trash2, ExternalLink, Tag, Calendar, Globe, Shield, Clock, Star,
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

interface FolderGroup {
  id: string;
  name: string;
  icon: React.ElementType;
  bgGradient: string;
  apps: AppId[];
}

const FOLDERS: FolderGroup[] = [
  { id: 'profile', name: 'Profile', icon: Folder, bgGradient: 'from-blue-500 to-indigo-600', apps: ['about', 'skills'] },
  { id: 'work', name: 'Work', icon: Folder, bgGradient: 'from-purple-500 to-violet-600', apps: ['projects', 'experience', 'blog'] },
  { id: 'feedback', name: 'Contact', icon: Folder, bgGradient: 'from-pink-500 to-rose-600', apps: ['testimonials', 'contact'] },
  { id: 'system', name: 'System', icon: Folder, bgGradient: 'from-slate-500 to-slate-700', apps: ['admin', 'settings'] },
];

const STANDALONE_APPS: AppId[] = ['terminal'];

interface AppInfoData {
  developer: string;
  version: string;
  build: string;
  size: string;
  language: string;
  copyright: string;
  releaseDate: string;
  requirements: string;
  rating: number;
  category: string;
  bundleId: string;
}

const APP_INFO: Record<string, AppInfoData> = {
  about:     { developer: 'Naim Hossain', version: '2.4.1', build: '2410', size: '24.8 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Mar 12, 2026', requirements: 'iOS 16.0+', rating: 4.8, category: 'Productivity', bundleId: 'com.naim.about' },
  skills:    { developer: 'Naim Hossain', version: '3.1.0', build: '3105', size: '18.2 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Feb 8, 2026', requirements: 'iOS 15.0+', rating: 4.6, category: 'Education', bundleId: 'com.naim.skills' },
  projects:  { developer: 'Naim Hossain', version: '4.0.2', build: '4021', size: '32.5 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Jan 20, 2026', requirements: 'iOS 16.4+', rating: 4.9, category: 'Business', bundleId: 'com.naim.projects' },
  experience:{ developer: 'Naim Hossain', version: '1.8.3', build: '1832', size: '15.1 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Apr 5, 2026', requirements: 'iOS 15.0+', rating: 4.5, category: 'Professional', bundleId: 'com.naim.experience' },
  testimonials:{ developer: 'Naim Hossain', version: '2.0.1', build: '2011', size: '12.3 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Mar 30, 2026', requirements: 'iOS 16.0+', rating: 4.7, category: 'Social', bundleId: 'com.naim.testimonials' },
  contact:   { developer: 'Naim Hossain', version: '3.2.0', build: '3204', size: '20.7 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Feb 14, 2026', requirements: 'iOS 15.0+', rating: 4.4, category: 'Utilities', bundleId: 'com.naim.contact' },
  blog:      { developer: 'Naim Hossain', version: '2.1.0', build: '2103', size: '28.6 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Jan 5, 2026', requirements: 'iOS 16.0+', rating: 4.8, category: 'News', bundleId: 'com.naim.blog' },
  terminal:  { developer: 'Naim Hossain', version: '1.0.0', build: '1001', size: '8.4 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Dec 1, 2025', requirements: 'iOS 15.0+', rating: 4.2, category: 'Developer Tools', bundleId: 'com.naim.terminal' },
  settings:  { developer: 'Naim Hossain', version: '5.0.1', build: '5012', size: '22.1 MB', language: 'English', copyright: '© 2026 OS Portfolio', releaseDate: 'Nov 12, 2025', requirements: 'iOS 16.4+', rating: 4.6, category: 'System', bundleId: 'com.naim.settings' },
  admin:     { developer: 'Naim Hossain', version: '1.2.0', build: '1205', size: '16.9 MB', language: 'English', copyright: '© 2026 Naim Hossain', releaseDate: 'Oct 22, 2025', requirements: 'iOS 16.0+', rating: 3.8, category: 'Admin', bundleId: 'com.naim.admin' },
};

const AppInfoModal = React.memo(function AppInfoModal({
  appId, app, onClose,
}: {
  appId: AppId; app: typeof SYSTEM_APPS[0]; onClose: () => void;
}) {
  const info = APP_INFO[appId];
  if (!info) return null;

  const rows = [
    { label: 'Developer', value: info.developer, icon: Shield },
    { label: 'Category', value: info.category, icon: Tag },
    { label: 'Version', value: `${info.version} (Build ${info.build})`, icon: Tag },
    { label: 'Bundle ID', value: info.bundleId, icon: Globe },
    { label: 'Size', value: info.size, icon: Folder },
    { label: 'Language', value: info.language, icon: Globe },
    { label: 'Release Date', value: info.releaseDate, icon: Calendar },
    { label: 'Requirements', value: info.requirements, icon: Clock },
    { label: 'Copyright', value: info.copyright, icon: Shield },
    { label: 'Rating', value: `${info.rating} ★`, icon: Star },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-end justify-center"
    >
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#1c1c24] rounded-t-3xl border-t border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto pb-6 scrollbar-none"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5">
          <span className="text-sm font-bold text-white">App Info</span>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-4 px-5 py-5 border-b border-white/5">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.bgGradient} flex items-center justify-center shadow-xl`}>
            <IconHelper name={app.iconName} className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{app.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{info.category}</p>
            <div className="flex items-center gap-1 mt-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className={`w-3 h-3 ${i <= Math.floor(info.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
              ))}
              <span className="text-[10px] text-slate-500 ml-1">{info.rating}</span>
            </div>
          </div>
        </div>

        <div className="px-5 pt-3 space-y-0">
          {rows.map((row, i) => (
            <div key={row.label}
              className={`flex items-center justify-between py-2.5 ${i < rows.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="flex items-center gap-2">
                <row.icon className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400">{row.label}</span>
              </div>
              <span className="text-xs font-medium text-white text-right max-w-[55%] truncate">{row.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
});

interface LongPressMenu {
  x: number;
  y: number;
  target: {
    type: 'app' | 'folder';
    id: string;
    name: string;
    gradient: string;
    iconName?: string;
  };
}

const LongPressMenuPopup: React.FC<{ menu: LongPressMenu; onClose: () => void; onAction: (action: string, target: LongPressMenu['target']) => void }> = ({
  menu, onClose, onAction,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [onClose]);

  const actions = menu.target.type === 'app'
    ? [
        { id: 'open', label: 'Open', icon: ExternalLink },
        { id: 'info', label: 'App Info', icon: Info },
        { id: 'remove', label: 'Remove from Home', icon: Trash2, color: 'text-red-400' },
      ]
    : [
        { id: 'open', label: 'Open Folder', icon: Folder },
        { id: 'rename', label: 'Rename', icon: Edit3Icon },
        { id: 'remove', label: 'Remove Folder', icon: Trash2, color: 'text-red-400' },
      ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed z-[100]"
      style={{ left: Math.min(menu.x, window.innerWidth - 200), top: Math.min(menu.y, window.innerHeight - 280) }}
    >
      <div className="bg-[#1c1c24]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 w-48 overflow-hidden">
        <div className="px-3.5 py-2.5 flex items-center gap-2.5 border-b border-white/5">
          <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${menu.target.gradient} flex items-center justify-center`}>
            {menu.target.iconName ? (
              <IconHelper name={menu.target.iconName as any} className="w-3.5 h-3.5 text-white" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-white" />
            )}
          </div>
          <span className="text-xs font-bold text-white truncate">{menu.target.name}</span>
        </div>
        <div className="py-1">
          {actions.map((a) => (
            <button key={a.id} onClick={() => { onAction(a.id, menu.target); onClose(); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium transition hover:bg-white/5 active:bg-white/10 ${a.color || 'text-slate-200'}`}
            >
              <a.icon className={`w-4 h-4 ${a.color ? a.color : 'text-slate-500'}`} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Edit3Icon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const FolderAppBtn = React.memo(function FolderAppBtn({
  app, appId, onOpenApp, onLongPressApp,
}: {
  app: typeof SYSTEM_APPS[0]; appId: AppId; onOpenApp: (id: AppId) => void; onLongPressApp: (e: React.PointerEvent, id: AppId) => void;
}) {
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (
    <button
      onClick={() => onOpenApp(appId)}
      onPointerDown={(e) => { tRef.current = setTimeout(() => onLongPressApp(e, appId), 400); }}
      onPointerMove={() => { if (tRef.current) { clearTimeout(tRef.current); tRef.current = null; } }}
      onPointerUp={() => { if (tRef.current) { clearTimeout(tRef.current); tRef.current = null; } }}
      onPointerLeave={() => { if (tRef.current) { clearTimeout(tRef.current); tRef.current = null; } }}
      className="flex flex-col items-center gap-1.5 active:scale-90 transition"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.bgGradient} flex items-center justify-center shadow-lg`}>
        <IconHelper name={app.iconName} className="w-7 h-7 text-white" />
      </div>
      <span className="text-[9px] font-medium text-white/70 text-center max-w-[56px] truncate">{app.title}</span>
    </button>
  );
});

const FolderIcon = React.memo(function FolderIcon({
  folder, onOpen, onLongPress,
}: {
  folder: FolderGroup; onOpen: (id: string) => void; onLongPress: (e: React.PointerEvent, folder: FolderGroup) => void;
}) {
  const apps = folder.apps.slice(0, 4);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const movedRef = useRef(false);

  return (
    <button
      onClick={() => onOpen(folder.id)}
      onPointerDown={(e) => { movedRef.current = false; timerRef.current = setTimeout(() => onLongPress(e, folder), 400); }}
      onPointerMove={() => { movedRef.current = true; if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } }}
      onPointerUp={() => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } }}
      onPointerLeave={() => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } }}
      className="group flex flex-col items-center gap-1 transition active:scale-90"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/15 shadow-lg flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-2 gap-0.5 p-1.5 w-full h-full">
          {apps.map((appId) => {
            const app = SYSTEM_APPS.find((a) => a.id === appId);
            if (!app) return <div key={appId} className="rounded-md bg-white/5" />;
            return (
              <div key={appId} className={`rounded-md bg-gradient-to-br ${app.bgGradient} flex items-center justify-center`}>
                <IconHelper name={app.iconName} className="w-3 h-3 text-white" />
              </div>
            );
          })}
          {Array.from({ length: Math.max(0, 4 - apps.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="rounded-md bg-white/5" />
          ))}
        </div>
      </div>
      <span className="text-[10px] font-semibold text-white text-center drop-shadow-md leading-tight max-w-[64px] truncate">{folder.name}</span>
    </button>
  );
});

const AppIconBtn = React.memo(function AppIconBtn({
  app, onTap, onLongPress, size = 'normal',
}: {
  app: typeof SYSTEM_APPS[0]; onTap: () => void; onLongPress: (e: React.PointerEvent) => void; size?: 'normal' | 'small';
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const movedRef = useRef(false);
  const iconSize = size === 'small' ? 'w-12 h-12 rounded-xl' : 'w-14 h-14 rounded-2xl';
  const imgSize = size === 'small' ? 'w-6 h-6' : 'w-7 h-7';
  const labelSize = size === 'small' ? 'text-[9px]' : 'text-[10px]';

  return (
    <button
      onClick={onTap}
      onPointerDown={(e) => { movedRef.current = false; timerRef.current = setTimeout(() => onLongPress(e), 400); }}
      onPointerMove={() => { movedRef.current = true; if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } }}
      onPointerUp={() => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } }}
      onPointerLeave={() => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } }}
      className="group flex flex-col items-center gap-1 transition active:scale-90"
    >
      <div className={`${iconSize} bg-gradient-to-br ${app.bgGradient} text-white flex items-center justify-center shadow-2xl group-hover:scale-105 transition duration-200 relative`}>
        <IconHelper name={app.iconName} className={imgSize} />
        {app.badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full border border-white min-w-[16px] text-center">
            {app.badge}
          </span>
        )}
      </div>
      <span className={`${labelSize} font-semibold text-white text-center drop-shadow-md leading-tight max-w-[64px] truncate`}>{app.title}</span>
    </button>
  );
});

const FolderView = React.memo(function FolderView({
  folder, onClose, onOpenApp, onLongPressApp,
}: {
  folder: FolderGroup; onClose: () => void; onOpenApp: (id: AppId) => void; onLongPressApp: (e: React.PointerEvent, id: AppId) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      onClick={onClose} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center"
    >
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-8"
      >
        <span className="text-sm font-bold text-white/70 tracking-wider">{folder.name}</span>
        <div className="bg-black/50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl px-8 py-6">
          <div className="grid grid-cols-3 gap-6">
            {folder.apps.map((appId) => {
              const app = SYSTEM_APPS.find((a) => a.id === appId);
              if (!app) return null;
              return (
                <FolderAppBtn key={appId} app={app} appId={appId} onOpenApp={onOpenApp} onLongPressApp={onLongPressApp} />
              );
            })}
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition active:scale-90">
          <X className="w-4 h-4 text-white/50" />
        </button>
      </motion.div>
    </motion.div>
  );
});

export const MobileView: React.FC = () => {
  const { personalInfo, projects, settings, brightness, nightLight, toggleSpotlight, openTour, t } = usePortfolio();

  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [timeStr, setTimeStr] = useState('');
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [recentApps, setRecentApps] = useState<AppId[]>([]);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [longPressMenu, setLongPressMenu] = useState<LongPressMenu | null>(null);
  const [infoAppId, setInfoAppId] = useState<AppId | null>(null);
  const [hiddenApps, setHiddenApps] = useState<AppId[]>([]);
  const [removedToast, setRemovedToast] = useState<{ appId: AppId; name: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const activeWp = useMemo(() => WALLPAPERS.find((w) => w.id === settings.wallpaper) || WALLPAPERS[0], [settings.wallpaper]);
  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const openFolderRaw = FOLDERS.find((f) => f.id === openFolderId);
  const openFolder = useMemo(() => {
    if (!openFolderRaw) return null;
    return { ...openFolderRaw, apps: openFolderRaw.apps.filter((id) => !hiddenApps.includes(id)) };
  }, [openFolderRaw, hiddenApps]);
  const visibleFolders = useMemo(() => FOLDERS.map((f) => ({
    ...f, apps: f.apps.filter((id) => !hiddenApps.includes(id))
  })).filter((f) => f.apps.length > 0), [hiddenApps]);
  const visibleStandalone = useMemo(() => STANDALONE_APPS.filter((id) => !hiddenApps.includes(id)), [hiddenApps]);
  const visibleDockApps = useMemo(() => SYSTEM_APPS.slice(0, 4).filter((a) => !hiddenApps.includes(a.id as AppId)), [hiddenApps]);



  const openApp = useCallback((id: AppId) => { setActiveAppId(id); setOpenFolderId(null); }, []);
  const closeApp = useCallback(() => {
    if (activeAppId) {
      setRecentApps((prev) => { const f = prev.filter((a) => a !== activeAppId); return [activeAppId, ...f].slice(0, 6); });
    }
    setActiveAppId(null); setSwipeOffset(0);
  }, [activeAppId]);

  const handleLongPressApp = useCallback((e: React.PointerEvent, appId: AppId) => {
    const app = SYSTEM_APPS.find((a) => a.id === appId);
    if (!app) return;
    setLongPressMenu({
      x: e.clientX, y: e.clientY,
      target: { type: 'app', id: appId, name: app.title, gradient: app.bgGradient, iconName: app.iconName },
    });
  }, []);

  const handleLongPressFolder = useCallback((e: React.PointerEvent, folder: FolderGroup) => {
    setLongPressMenu({
      x: e.clientX, y: e.clientY - 20,
      target: { type: 'folder', id: folder.id, name: folder.name, gradient: folder.bgGradient },
    });
  }, []);

  const handleMenuAction = useCallback((action: string, target: LongPressMenu['target']) => {
    setLongPressMenu(null);
    if (target.type === 'app') {
      if (action === 'open') openApp(target.id as AppId);
      else if (action === 'info') setInfoAppId(target.id as AppId);
      else if (action === 'remove') {
        const appId = target.id as AppId;
        setHiddenApps((prev) => [...prev, appId]);
        setRemovedToast({ appId, name: target.name });
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setRemovedToast(null), 5000);
      }
    } else {
      if (action === 'open') setOpenFolderId(target.id);
    }
  }, [openApp]);

  const wpStyle = useMemo(() => ({
    backgroundImage: activeWp.url.startsWith('radial') || activeWp.url.startsWith('linear') ? activeWp.url : `url(${activeWp.url})`,
  }), [activeWp.url]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none font-sans flex flex-col justify-between" style={wpStyle}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-none" />
      {brightness < 100 && <div className="absolute inset-0 bg-black pointer-events-none z-[90] transition-opacity duration-150" style={{ opacity: (100 - brightness) / 110 }} />}
      {nightLight && <div className="absolute inset-0 bg-amber-500/10 mix-blend-color-burn pointer-events-none z-[89] transition-opacity duration-200" />}

      {/* Status Bar */}
      <div className="relative z-30 pt-2 px-6 flex items-center justify-between text-white text-xs font-semibold">
       
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 px-5 pt-4 pb-20 overflow-y-auto space-y-6 scrollbar-none">
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => openApp('about')}
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
            <div className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full w-max backdrop-blur-md">{personalInfo.metrics.yearsExp}+ Years Exp</div>
          </div>
          <div onClick={() => openApp('projects')}
            className="bg-gradient-to-br from-purple-600/80 via-indigo-600/80 to-slate-900/90 backdrop-blur-xl p-4 rounded-3xl border border-white/20 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition space-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase opacity-80 flex items-center gap-1"><FolderGit2 className="w-3 h-3 text-purple-300" /> Featured</span>
              <Award className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold truncate">{featuredProject?.title}</div>
              <div className="text-[10px] text-purple-200 line-clamp-2 mt-0.5">{featuredProject?.shortDesc}</div>
            </div>
            <div className="text-[9px] text-purple-300 font-mono">Tap to View →</div>
          </div>
        </div>

        <div onClick={toggleSpotlight}
          className="bg-white/20 dark:bg-black/30 backdrop-blur-md text-white text-xs px-4 py-2.5 rounded-2xl flex items-center justify-between border border-white/20 shadow-sm cursor-pointer active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-2"><Search className="w-4 h-4 text-slate-200" /><span className="text-slate-200 font-medium">{t('common.search')}</span></div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-medium">Spotlight</span>
        </div>

        {/* Folders + Standalone Apps Grid */}
        <div className="grid grid-cols-4 gap-5 pt-1">
          {visibleFolders.map((folder) => (
            <div key={folder.id} className="flex justify-center">
              <FolderIcon folder={folder} onOpen={setOpenFolderId} onLongPress={handleLongPressFolder} />
            </div>
          ))}
          {visibleStandalone.map((appId) => {
            const app = SYSTEM_APPS.find((a) => a.id === appId);
            if (!app) return null;
            return (
              <div key={appId} className="flex justify-center">
                <AppIconBtn app={app} onTap={() => openApp(appId)} onLongPress={(e) => handleLongPressApp(e, appId)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dock */}
      <div className="relative z-30 pb-4 px-6">
        <div className="bg-white/20 dark:bg-black/40 backdrop-blur-2xl p-3 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-around">
          {visibleDockApps.map((app) => (
            <button key={app.id} onClick={() => openApp(app.id as AppId)}
              className="group transition transform active:scale-95"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.bgGradient} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition`}>
                <IconHelper name={app.iconName} className="w-6 h-6" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Uninstalled Message */}
      <AnimatePresence>
        {removedToast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="absolute bottom-24 left-4 right-4 z-50 flex justify-center pointer-events-none"
          >
            <div className="bg-[#1c1c24]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl px-5 py-3 pointer-events-auto">
              <p className="text-xs text-white text-center"><span className="font-semibold">{removedToast.name}</span> uninstalled</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SpotlightModal />
      <WelcomeTourModal />

      {/* Long Press Menu */}
      <AnimatePresence>
        {longPressMenu && (
          <LongPressMenuPopup menu={longPressMenu} onClose={() => setLongPressMenu(null)} onAction={handleMenuAction} />
        )}
      </AnimatePresence>

      {/* Folder View */}
      <AnimatePresence>
        {openFolder && <FolderView folder={openFolder} onClose={() => setOpenFolderId(null)} onOpenApp={openApp} onLongPressApp={handleLongPressApp} />}
      </AnimatePresence>

      {/* App Info Modal */}
      <AnimatePresence>
        {infoAppId && SYSTEM_APPS.find((a) => a.id === infoAppId) && (
          <AppInfoModal appId={infoAppId} app={SYSTEM_APPS.find((a) => a.id === infoAppId)!} onClose={() => setInfoAppId(null)} />
        )}
      </AnimatePresence>

      {/* App Switcher */}
      <AnimatePresence>
        {showAppSwitcher && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAppSwitcher(false)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-end pb-24"
          >
            <div className="w-full max-w-lg mx-auto px-4 space-y-4">
              <div className="text-center text-xs text-slate-400 mb-4 tracking-widest uppercase">App Switcher</div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
                {recentApps.length > 0 ? recentApps.map((id) => {
                  const app = SYSTEM_APPS.find((a) => a.id === id);
                  if (!app) return null;
                  return (
                    <motion.div key={id} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      onClick={() => { setActiveAppId(id); setShowAppSwitcher(false); }}
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
            <div className="w-32 h-1 bg-slate-500 rounded-full mt-6 cursor-pointer" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen App Sheet */}
      <AnimatePresence>
        {activeAppId && (
          <motion.div ref={appSheetRef}
            initial={{ y: '100%' }} animate={{ y: Math.max(0, swipeOffset) }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onPointerDown={(e) => { swipeStartRef.current = e.clientY; }}
            onPointerMove={(e) => { const d = e.clientY - swipeStartRef.current; if (d > 0) setSwipeOffset(d); }}
            onPointerUp={(e) => { if (e.clientY - swipeStartRef.current > 120) closeApp(); setSwipeOffset(0); }}
            className="fixed inset-0 z-50 bg-[#121212] text-white flex flex-col"
          >
            <div className="px-4 py-3 bg-[#1e1e24] border-b border-white/10 flex items-center justify-between">
              <button onClick={closeApp} className="flex items-center gap-1 text-xs font-bold text-blue-400">
                <ChevronLeft className="w-4 h-4" /><span>Home</span>
              </button>
              <span className="text-xs font-bold text-white capitalize">{SYSTEM_APPS.find((a) => a.id === activeAppId)?.title || activeAppId}</span>
              <button onClick={closeApp} className="text-xs font-bold text-slate-400 hover:text-white">Done</button>
            </div>
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
            <div onPointerDown={(e) => { swipeStartRef.current = e.clientY; }}
              onPointerMove={(e) => {
                if (e.clientY - swipeStartRef.current < -60 && activeAppId) {
                  setRecentApps((prev) => { const f = prev.filter((a) => a !== activeAppId); return [activeAppId, ...f].slice(0, 6); });
                  setShowAppSwitcher(true);
                }
              }}
              className="py-2 flex items-center justify-center bg-[#1e1e24] cursor-pointer active:bg-[#2a2a30] transition-colors"
            >
              <div className="w-32 h-1 bg-slate-500 rounded-full" style={{ width: `${Math.max(32, 128 - swipeOffset)}px` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
