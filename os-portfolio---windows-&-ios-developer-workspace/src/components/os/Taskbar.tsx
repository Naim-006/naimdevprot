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
    minimizeWindow,
    activeWindowId,
    toggleSpotlight,
    t
  } = usePortfolio();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-t border-gray-200/60 dark:border-white/10 z-40 px-4 flex items-center justify-between select-none shadow-2xl text-gray-900 dark:text-white">
      <div className="w-10 sm:w-28 hidden sm:block" />

      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStartMenu();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
            isStartMenuOpen ? 'bg-black/10 dark:bg-white/15 text-blue-500 dark:text-blue-400' : 'text-blue-500 dark:text-blue-400 hover:bg-black/10 dark:hover:bg-white/10'
          }`}
          title="Start Menu"
        >
          <LayoutGrid className="w-6 h-6" />
        </button>

        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleSpotlight();
          }}
          className="w-40 h-8 rounded-full border mx-2 flex items-center px-3 gap-2 cursor-pointer transition bg-black/5 dark:bg-white/10 border-gray-300/60 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/15"
        >
          <Search className="w-4 h-4 opacity-50 text-gray-500 dark:text-white" />
          <span className="text-xs opacity-50 text-gray-500 dark:text-white">{t('common.search')}</span>
        </div>

        {SYSTEM_APPS.map((app) => {
          const winState = windows[app.id as AppId];
          const isOpen = winState?.isOpen;
          const isFocused = activeWindowId === app.id && isOpen && !winState?.isMinimized;

          return (
            <button
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                if (isOpen && isFocused) {
                  minimizeWindow(app.id as AppId);
                } else if (isOpen) {
                  focusWindow(app.id as AppId);
                } else {
                  openWindow(app.id as AppId);
                }
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-md transition relative ${
                isFocused
                  ? 'bg-black/10 dark:bg-white/15 border-b-2 border-blue-400'
                  : isOpen
                  ? 'bg-black/10 dark:bg-white/10 border-b-2 border-gray-400 dark:border-slate-400'
                  : 'hover:bg-black/10 dark:hover:bg-white/10'
              }`}
              title={app.title}
            >
              <IconHelper name={app.iconName} className={`w-5 h-5 ${isFocused ? 'text-blue-500 dark:text-blue-300' : 'text-gray-600 dark:text-slate-200'}`} />
            </button>
          );
        })}
      </div>

      <SystemTray />
    </div>
  );
};