import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SYSTEM_APPS } from '../../data/defaultData';
import { IconHelper } from '../common/IconHelper';
import { Search, Power, Settings, Shield, User, ExternalLink } from 'lucide-react';
import { AppId } from '../../types';

export const StartMenu: React.FC = () => {
  const { isStartMenuOpen, closeStartMenu, openWindow, personalInfo, t } = usePortfolio();
  const [search, setSearch] = useState('');

  if (!isStartMenuOpen) return null;

  const filteredApps = SYSTEM_APPS.filter((app) =>
    app.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-2xl border border-gray-200/80 dark:border-white/20 shadow-2xl p-6 z-50 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-200 select-none text-gray-900 dark:text-white"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
        <input
          type="text"
          placeholder={t('start.searchApps')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-black/5 dark:bg-white/10 border border-gray-300/60 dark:border-white/15 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium opacity-60 px-1">
          <span>Pinned Applications</span>
          <span className="text-[10px]">All Apps ({SYSTEM_APPS.length})</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                openWindow(app.id as AppId);
                closeStartMenu();
              }}
              className="group flex flex-col items-center gap-2 p-2.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition transform hover:-translate-y-0.5"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-black/5 dark:bg-white/10 border border-gray-300/60 dark:border-white/20 text-blue-500 dark:text-blue-300 flex items-center justify-center shadow-md group-hover:bg-black/10 dark:group-hover:bg-white/20 transition relative`}
              >
                <IconHelper name={app.iconName} className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                {app.badge && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white/20">
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-gray-600 dark:text-slate-200 text-center line-clamp-1">
                {app.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
        <div
          onClick={() => {
            openWindow('about');
            closeStartMenu();
          }}
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <img
            src={personalInfo.avatarUrl}
            alt={personalInfo.name}
            loading="lazy"
            className="w-9 h-9 rounded-full object-cover border border-blue-400/40"
          />
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
              <span>{personalInfo.name}</span>
              <User className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400">{t('app.about')}</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              openWindow('settings');
              closeStartMenu();
            }}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              openWindow('admin');
              closeStartMenu();
            }}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-black/10 dark:hover:bg-white/10 transition"
            title="Admin Console"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};