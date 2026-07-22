import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SYSTEM_APPS } from '../../data/defaultData';
import { IconHelper } from '../common/IconHelper';
import { SystemTray } from './SystemTray';
import { AppId } from '../../types';
import { LayoutGrid, Search } from 'lucide-react';

export const Taskbar: React.FC = () => {
  const {
    toggleStartMenu,
    isStartMenuOpen,
    windows,
    openWindow,
    focusWindow,
    activeWindowId,
    toggleSpotlight,
    t
  } = usePortfolio();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-2xl border-t border-white/10 z-40 px-4 flex items-center justify-between select-none shadow-2xl text-white">
      {/* Left empty spacer */}
      <div className="w-10 sm:w-28 hidden sm:block" />

      {/* Center Windows Taskbar Icons */}
      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
        {/* Windows Start Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStartMenu();
          }}
          className={`w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors ${
            isStartMenuOpen ? 'bg-white/15 text-blue-400' : 'text-blue-400'
          }`}
          title="Start Menu"
        >
          <LayoutGrid className="w-6 h-6 text-blue-400" />
        </button>

        {/* Pill Search Bar */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleSpotlight();
          }}
          className="w-40 h-8 bg-white/10 rounded-full border border-white/10 mx-2 flex items-center px-3 gap-2 cursor-pointer hover:bg-white/15 transition"
        >
          <Search className="w-4 h-4 opacity-50 text-white" />
          <span className="text-xs opacity-50 text-white">{t('common.search')}</span>
        </div>

        {/* Pinned & Open Apps */}
        {SYSTEM_APPS.map((app) => {
          const winState = windows[app.id as AppId];
          const isOpen = winState?.isOpen;
          const isFocused = activeWindowId === app.id && isOpen && !winState?.isMinimized;

          return (
            <button
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                if (isOpen) {
                  focusWindow(app.id as AppId);
                } else {
                  openWindow(app.id as AppId);
                }
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-md transition relative ${
                isFocused
                  ? 'bg-white/15 border-b-2 border-blue-400'
                  : isOpen
                  ? 'bg-white/10 border-b-2 border-slate-400'
                  : 'hover:bg-white/10'
              }`}
              title={app.title}
            >
              <IconHelper name={app.iconName} className={`w-5 h-5 ${isFocused ? 'text-blue-300' : 'text-slate-200'}`} />
            </button>
          );
        })}
      </div>

      {/* Right System Tray */}
      <SystemTray />
    </div>
  );
};
