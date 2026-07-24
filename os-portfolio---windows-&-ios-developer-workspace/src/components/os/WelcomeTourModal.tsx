import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Compass, MousePointerClick, Keyboard, Sparkles, X, ChevronRight, ChevronLeft } from 'lucide-react';

export const WelcomeTourModal: React.FC = () => {
  const { isTourOpen, closeTour } = usePortfolio();
  const [step, setStep] = useState(0);

  if (!isTourOpen) return null;

  const steps = [
    {
      icon: <Compass className="w-6 h-6 text-blue-400" />,
      title: 'Welcome!',
      body: 'This is an interactive OS-style portfolio. Everything you see — windows, taskbar, apps — is built with React and runs in your browser.',
      hint: 'Feel free to explore at your own pace.'
    },
    {
      icon: <MousePointerClick className="w-6 h-6 text-amber-400" />,
      title: 'How to Navigate',
      body: 'Double-click any app icon on the desktop or click pinned apps in the taskbar. Drag windows by their title bar, resize from edges, and close with the X button.',
      hint: 'Right-click the desktop for quick actions.'
    },
    {
      icon: <Keyboard className="w-6 h-6 text-emerald-400" />,
      title: 'Quick Tips',
      body: 'Press Ctrl+K to search everything. Use Alt+F4 to close windows. Click an open taskbar app to minimize/restore it.',
      hint: 'All your data lives in the cloud — sign in to the Admin panel to manage it.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white/95 dark:bg-[#1a1a1d]/95 border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden relative text-gray-900 dark:text-white">
        <button onClick={closeTour} className="absolute top-4 right-4 text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition z-10 p-1">
          <X className="w-4 h-4" />
        </button>
        <div className="p-6 pt-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/10 flex items-center justify-center">
            {steps[step].icon}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{steps[step].title}</h2>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{steps[step].body}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 italic">{steps[step].hint}</p>
          </div>
        </div>
        <div className="px-6 pb-5 pt-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-5 bg-blue-500' : 'w-1.5 bg-gray-300 dark:bg-white/20'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-xs font-medium text-gray-700 dark:text-slate-200 transition flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-lg shadow-blue-600/30 flex items-center gap-1">
                Next <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button onClick={closeTour}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Got it
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
