import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SYSTEM_APPS } from '../../data/defaultData';
import { IconHelper } from '../common/IconHelper';
import { AppId } from '../../types';
import { Search, Terminal, Code2, ArrowRight, FolderGit2, Mail, UserCheck } from 'lucide-react';

export const SpotlightModal: React.FC = () => {
  const {
    isSpotlightOpen,
    toggleSpotlight,
    openWindow,
    projects,
    skills,
    blogs,
    t
  } = usePortfolio();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd/Ctrl + K or Escape to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSpotlight();
      } else if (e.key === 'Escape' && isSpotlightOpen) {
        toggleSpotlight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpotlightOpen, toggleSpotlight]);

  if (!isSpotlightOpen) return null;

  const filteredApps = SYSTEM_APPS.filter(app => 
    app.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.techStack.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredSkills = skills.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={toggleSpotlight}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#1c1c1f]/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl text-white animate-in zoom-in-95 duration-150"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('spot.placeholder')}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-white/10 border border-white/20 rounded text-slate-300 font-mono">
            ESC
          </kbd>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Actions / Apps */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              {t('spot.apps')} ({filteredApps.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    openWindow(app.id as AppId);
                    toggleSpotlight();
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
                    <IconHelper name={app.iconName} className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-white truncate">{app.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Match */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                {t('spot.projects')} ({filteredProjects.length})
              </div>
              <div className="space-y-1.5">
                {filteredProjects.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      openWindow('projects');
                      toggleSpotlight();
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/12 border border-white/10 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FolderGit2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-white group-hover:text-blue-300 transition">{p.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.shortDesc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Match */}
          {filteredSkills.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                {t('spot.skills')} ({filteredSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filteredSkills.slice(0, 8).map((s) => (
                  <span
                    key={s.id}
                    onClick={() => {
                      openWindow('skills');
                      toggleSpotlight();
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-blue-600/30 border border-white/15 rounded-lg text-slate-200 text-xs cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Code2 className="w-3 h-3 text-blue-400" />
                    <span>{s.name}</span>
                    <span className="text-[9px] opacity-60">({s.proficiency}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Type <strong className="text-white">Cmd/Ctrl + K</strong> anytime</span>
          </div>
          <span>{t('common.search')}</span>
        </div>
      </div>
    </div>
  );
};
