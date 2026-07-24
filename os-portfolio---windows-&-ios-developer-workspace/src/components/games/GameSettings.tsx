import React from 'react';
import { Volume2, VolumeX, Settings2, X } from 'lucide-react';
import { gameSounds } from '../../utils/gameSounds';

interface GameSettingsProps {
  open: boolean;
  onClose: () => void;
  difficulty?: number;
  onDifficultyChange?: (d: number) => void;
  extraControls?: React.ReactNode;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ open, onClose, difficulty, onDifficultyChange, extraControls }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-500" />
            Game Settings
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Sound Effects</span>
            <button onClick={() => gameSounds.setEnabled(!gameSounds.getEnabled())}
              className={`relative w-11 h-6 rounded-full transition-colors ${gameSounds.getEnabled() ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${gameSounds.getEnabled() ? 'translate-x-5' : 'translate-x-0'}`}>
                {gameSounds.getEnabled() ? <Volume2 className="w-3 h-3 text-blue-600" /> : <VolumeX className="w-3 h-3 text-gray-400" />}
              </div>
            </button>
          </div>
          {difficulty !== undefined && onDifficultyChange && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Difficulty</span>
                <span className="text-[10px] font-bold text-amber-500">{['Easy', 'Medium', 'Hard', 'Expert'][difficulty] || 'Medium'}</span>
              </div>
              <input type="range" min="0" max="3" value={difficulty} onChange={(e) => onDifficultyChange(parseInt(e.target.value))} className="w-full accent-amber-500" />
            </div>
          )}
          {extraControls}
        </div>
      </div>
    </div>
  );
};