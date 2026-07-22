import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Compass,
  Monitor,
  LayoutGrid,
  Search,
  Sliders,
  Terminal,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FolderGit2,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export const WelcomeTourModal: React.FC = () => {
  const { isTourOpen, closeTour, openWindow, personalInfo, t } = usePortfolio();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTourOpen) return null;

  const steps = [
    {
      title: t('tour.welcome'),
      subtitle: t('tour.welcomeDesc'),
      icon: <Compass className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
          <p>{t('tour.welcomeDesc')}</p>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>{personalInfo.title}</span>
            </div>
            <p className="text-slate-400">{personalInfo.tagline}</p>
          </div>
        </div>
      )
    },
    {
      title: t('tour.desktop'),
      subtitle: t('tour.desktopDesc'),
      icon: <Monitor className="w-8 h-8 text-blue-400" />,
      content: (
        <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
          <p>{t('tour.desktopDesc')}</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>{t('tour.desktopDesc')}</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: t('tour.shortcuts'),
      subtitle: t('tour.shortcutsDesc'),
      icon: <Search className="w-8 h-8 text-purple-400" />,
      content: (
        <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
          <p>{t('tour.shortcutsDesc')}</p>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-200 flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 shrink-0 text-purple-400" />
            <div>
              <div className="font-bold text-white text-xs">HotKey Shortcut:</div>
              <div className="text-[11px] opacity-90">Press <kbd className="bg-black/40 px-1.5 py-0.5 rounded border border-white/20">Ctrl+K</kbd> anywhere!</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: t('tour.apps'),
      subtitle: t('tour.appsDesc'),
      icon: <Sliders className="w-8 h-8 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
          <p>{t('tour.appsDesc')}</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {['app.about','app.skills','app.projects','app.experience','app.testimonials','app.contact','app.blog','app.terminal','app.settings','app.admin'].map((k) => (
              <div key={k} className="p-2 bg-white/5 rounded-lg border border-white/10">{t(k)}</div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: t('app.admin'),
      subtitle: t('tour.getStarted'),
      icon: <ShieldCheck className="w-8 h-8 text-rose-400" />,
      content: (
        <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
          <p>Login with <strong>admin</strong> / <strong>admin123</strong> to manage all portfolio content.</p>
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-200 font-medium">
            {t('tour.getStarted')}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#1a1a1d]/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl text-white animate-in zoom-in-95 duration-200 relative flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={closeTour}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shrink-0">
            {steps[currentStep].icon}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              {steps[currentStep].subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1">
          {steps[currentStep].content}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-blue-500 w-4' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition flex items-center gap-1 shadow-lg shadow-blue-600/30"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  closeTour();
                  openWindow('about');
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Start Exploring</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
