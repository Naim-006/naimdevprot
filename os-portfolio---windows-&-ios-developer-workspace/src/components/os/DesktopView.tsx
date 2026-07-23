import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SYSTEM_APPS, WALLPAPERS } from '../../data/defaultData';
import { IconHelper } from '../common/IconHelper';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ControlCenter } from './ControlCenter';
import { SpotlightModal } from './SpotlightModal';
import { WelcomeTourModal } from './WelcomeTourModal';
import { WindowContainer } from './Window';
import { WallpaperPickerModal } from './WallpaperPickerModal';
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
import { AppId } from '../../types';
import {
  RefreshCw, Terminal, Image, Shield, FolderGit2, Info,
  Folder, FileText, Trash2
} from 'lucide-react';

interface DesktopItem {
  id: string;
  type: 'folder' | 'file';
  name: string;
  icon: string;
}

export const DesktopView: React.FC = () => {
  const {
    settings,
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    closeStartMenu,
    toggleSpotlight,
    brightness,
    nightLight,
    updateSettings,
    openTour,
    showToast,
    t
  } = usePortfolio();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const activeWindowIdRef = useRef(activeWindowId);
  activeWindowIdRef.current = activeWindowId;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSpotlight();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        showToast(t('notif.desktopRefreshed'), '');
      }
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        if (activeWindowIdRef.current) {
          closeWindow(activeWindowIdRef.current);
        }
      }
      if (e.key === 'Escape') {
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Match current wallpaper
  const activeWp = WALLPAPERS.find((w) => w.id === settings.wallpaper) || WALLPAPERS[0];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const addDesktopFolder = () => {
    const newFolder: DesktopItem = {
      id: `folder-${Date.now()}`,
      type: 'folder',
      name: `${t('folder.newName')} (${desktopItems.filter((d) => d.type === 'folder').length + 1})`,
      icon: 'Folder'
    };
    setDesktopItems((prev) => [...prev, newFolder]);
    showToast(t('folder.newName'), '');
    closeContextMenu();
  };

  const isGradient = activeWp.url.startsWith('radial-gradient') || activeWp.url.startsWith('linear-gradient');

  return (
    <div
      onClick={() => {
        closeStartMenu();
        closeContextMenu();
        setSelectedItemId(null);
      }}
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden bg-[#0b1d3a] bg-cover bg-center select-none font-sans text-white"
      style={isGradient ? { backgroundImage: activeWp.url } : { backgroundImage: `url(${activeWp.url})` }}
    >
      {/* Dark Overlay Tint */}
      {!isGradient && <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-none" />}

      {/* Brightness Screen Filter Overlay */}
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

      {/* Desktop Grid - App Icons + Custom Items */}
      <div className="relative z-10 p-8 grid grid-flow-col grid-rows-8 gap-x-6 gap-y-2 w-max">
        {/* Custom desktop items (folders/files) */}
        {desktopItems.map((item) => (
          <div
            key={item.id}
            onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}
            onDoubleClick={(e) => { e.stopPropagation(); showToast(item.name, ''); }}
            className={`group flex flex-col items-center justify-center gap-1 w-20 cursor-pointer select-none p-1.5 rounded-xl transition ${
              selectedItemId === item.id ? 'bg-blue-500/20 ring-1 ring-blue-400/50' : 'hover:bg-white/5'
            }`}
          >
            <div className="w-12 h-12 bg-amber-500/15 backdrop-blur-md border border-amber-500/30 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200">
              {item.type === 'folder' ? (
                <Folder className="w-6 h-6 text-amber-400" />
              ) : (
                <FileText className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <input
              value={item.name}
              onChange={(e) => {
                setDesktopItems((prev) =>
                  prev.map((d) => (d.id === item.id ? { ...d, name: e.target.value } : d))
                );
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-center bg-transparent border-none outline-none text-white w-full truncate font-medium"
            />
          </div>
        ))}

        {/* System app shortcuts */}
        {SYSTEM_APPS.map((app) => (
          <div
            key={app.id}
            onDoubleClick={() => openWindow(app.id as AppId)}
            onClick={(e) => { e.stopPropagation(); setSelectedItemId(app.id); }}
            className={`group flex flex-col items-center justify-center gap-1 w-20 cursor-pointer select-none p-1.5 rounded-xl transition ${
              selectedItemId === app.id ? 'bg-blue-500/20 ring-1 ring-blue-400/50' : 'hover:bg-white/5'
            }`}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${app.bgGradient} bg-opacity-80 backdrop-blur-md border border-white/20 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200`}>
              <IconHelper name={app.iconName} className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] text-center shadow-black drop-shadow-md font-medium text-white line-clamp-2">
              {app.title}
            </span>
          </div>
        ))}
      </div>

      {/* Active Windows Render Layer */}
      <WindowContainer id="about"><AboutApp /></WindowContainer>
      <WindowContainer id="skills"><SkillsApp /></WindowContainer>
      <WindowContainer id="projects"><ProjectsApp /></WindowContainer>
      <WindowContainer id="experience"><ExperienceApp /></WindowContainer>
      <WindowContainer id="testimonials"><TestimonialsApp /></WindowContainer>
      <WindowContainer id="contact"><ContactApp /></WindowContainer>
      <WindowContainer id="blog"><BlogApp /></WindowContainer>
      <WindowContainer id="terminal"><TerminalApp /></WindowContainer>
      <WindowContainer id="settings"><SettingsApp /></WindowContainer>
      <WindowContainer id="admin"><AdminApp /></WindowContainer>

      {/* Start Menu Flyout */}
      <StartMenu />

      {/* Control Center Flyout */}
      <ControlCenter />

      {/* Spotlight Search Modal */}
      <SpotlightModal />

      {/* Welcome Portfolio Tour Modal */}
      <WelcomeTourModal />

      {/* Context Menu (Right Click) */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            top: Math.min(contextMenu.y, window.innerHeight - 320),
            left: Math.min(contextMenu.x, window.innerWidth - 200),
          }}
          className="fixed bg-[#1f1f23]/95 backdrop-blur-2xl rounded-xl border border-white/20 shadow-2xl p-2 z-50 min-w-44 space-y-1 text-xs select-none animate-in fade-in zoom-in-95 text-white"
        >
          <button
            onClick={() => { showToast(t('notif.desktopRefreshed'), ''); closeContextMenu(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 font-medium transition"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span>{t('ctx.refresh')}</span>
          </button>

          <button
            onClick={addDesktopFolder}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 font-medium transition"
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span>{t('ctx.newFolder')}</span>
          </button>

          <div className="my-1 border-t border-white/10" />

          <button
            onClick={() => { openWindow('terminal'); closeContextMenu(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 font-medium transition"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>{t('ctx.openTerminal')}</span>
          </button>

          <button
            onClick={() => { openWindow('projects'); closeContextMenu(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 font-medium transition"
          >
            <FolderGit2 className="w-4 h-4 text-purple-400" />
            <span>{t('ctx.viewProjects')}</span>
          </button>

          <div className="my-1 border-t border-white/10" />

          <button
            onClick={() => { setShowWallpaperPicker(true); closeContextMenu(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 font-medium transition"
          >
            <Image className="w-4 h-4 text-amber-400" />
            <span>Change Wallpaper</span>
          </button>

          <button
            onClick={() => { openWindow('admin'); closeContextMenu(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-rose-400 font-medium transition"
          >
            <Shield className="w-4 h-4" />
            <span>{t('ctx.admin')}</span>
          </button>

          {selectedItemId && desktopItems.find((d) => d.id === selectedItemId) && (
            <>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => {
                  setDesktopItems((prev) => prev.filter((item) => item.id !== selectedItemId));
                  setSelectedItemId(null);
                  showToast(t('folder.deleted'), '');
                  closeContextMenu();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-rose-400 font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('ctx.deleteItem')}</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Wallpaper Picker Modal */}
      {showWallpaperPicker && <WallpaperPickerModal onClose={() => setShowWallpaperPicker(false)} />}

      {/* Windows Taskbar */}
      <Taskbar />
    </div>
  );
};
