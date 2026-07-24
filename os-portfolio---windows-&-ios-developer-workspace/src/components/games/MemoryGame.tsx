import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Star, Settings2, Timer } from 'lucide-react';
import { gameSounds } from '../../utils/gameSounds';
import { GameSettings } from './GameSettings';
import { getScore, saveScore } from '../../utils/gameStorage';

const EMOJIS = ['🐶','🐱','🐸','🦊','🐻','🐼','🐨','🐯'];
const PAIRS = EMOJIS.length * 2;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

interface MemoryGameProps { onBack: () => void; }

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState(() => shuffle([...EMOJIS, ...EMOJIS]));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [best, setBest] = useState(() => getScore('memory').highScore);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { if (matched.size === PAIRS && !won) { setWon(true); gameSounds.win(); saveScore('memory', { highScore: moves, gamesPlayed: 1, gamesWon: 1 }); } }, [matched.size, won, moves]);
  useEffect(() => { if (won) return; const t = setInterval(() => setTimer(p => p + 1), 1000); return () => clearInterval(t); }, [won]);

  const handleClick = useCallback((idx: number) => {
    if (locked || flipped.includes(idx) || matched.has(idx) || won) return;
    const nf = [...flipped, idx]; setFlipped(nf); gameSounds.flip();
    if (nf.length === 2) {
      setLocked(true); setMoves(m => m + 1);
      if (cards[nf[0]] === cards[nf[1]]) { setMatched(prev => new Set([...prev, ...nf])); setFlipped([]); setLocked(false); gameSounds.match(); }
      else { setTimeout(() => { setFlipped([]); setLocked(false); }, 700); }
    }
  }, [flipped, locked, matched, cards, won]);

  const restart = () => { setCards(shuffle([...EMOJIS, ...EMOJIS])); setFlipped([]); setMatched(new Set()); setMoves(0); setLocked(false); setWon(false); setTimer(0); gameSounds.ding(); };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center gap-3 p-3 select-none">
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-gray-900 dark:text-white">Moves: {moves}</span>
          <span className="text-gray-400 dark:text-slate-500 flex items-center gap-1"><Timer className="w-3 h-3" /> {fmt(timer)}</span>
          <span className="text-gray-400 dark:text-slate-500 flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Best: {best || '-'}</span>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 transition">
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((emoji, i) => {
          const isFlipped = flipped.includes(i) || matched.has(i);
          return (
            <button key={i} onClick={() => handleClick(i)} disabled={matched.has(i) || locked || won}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl text-2xl flex items-center justify-center transition-all duration-200 ${isFlipped ? 'bg-white dark:bg-slate-700 scale-100 border border-gray-200 dark:border-slate-600 shadow-sm' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 border border-indigo-400/50 shadow-md cursor-pointer active:scale-95'} ${matched.has(i) ? 'opacity-60 scale-95' : ''}`}>
              {isFlipped ? <span className="drop-shadow-sm">{emoji}</span> : <span className="text-white text-xs font-bold opacity-40">?</span>}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400 dark:text-slate-500">{matched.size}/{PAIRS} matched</span>
        <button onClick={restart} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm">
          <RotateCcw className="w-3.5 h-3.5" /> New
        </button>
      </div>
      {won && (
        <div className="w-full text-center p-3 rounded-xl bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-800 animate-in fade-in zoom-in-95">
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">All pairs matched! 🎉</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">{moves} moves · {fmt(timer)}</p>
        </div>
      )}
      <GameSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};