import React, { useState } from 'react';
import { Gamepad2, Swords, Grid3X3, Brain, Sparkles, ArrowLeft, Trophy, Zap, TrendingUp, Medal } from 'lucide-react';
import { ChessGame } from '../games/ChessGame';
import { TicTacToe } from '../games/TicTacToe';
import { TempleRunGame } from '../games/TempleRunGame';
import { MemoryGame } from '../games/MemoryGame';
import { getScore } from '../../utils/gameStorage';

type GameId = 'chess' | 'tictactoe' | 'templerun' | 'memory';

const GAMES: { id: GameId; title: string; desc: string; icon: React.ElementType; bgGradient: string; featured?: boolean }[] = [
  { id: 'chess', title: 'Play with Naim', desc: 'Chess vs smart AI bot', icon: Swords, bgGradient: 'from-amber-500 to-orange-600', featured: true },
  { id: 'tictactoe', title: 'Tic-Tac-Toe', desc: 'Vs bot or pass-and-play', icon: Grid3X3, bgGradient: 'from-blue-500 to-cyan-500' },
  { id: 'templerun', title: 'Arrow Escape', desc: 'Slide arrows off the board!', icon: Zap, bgGradient: 'from-emerald-500 to-teal-600', featured: true },
  { id: 'memory', title: 'Memory Cards', desc: 'Match the pairs', icon: Brain, bgGradient: 'from-purple-500 to-pink-500' },
];

export const GameHubApp: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const handleBack = () => setActiveGame(null);
  const allScores = GAMES.map(g => ({ id: g.id, score: getScore(g.id) }));
  const totalPlayed = allScores.reduce((s, x) => s + x.score.gamesPlayed, 0);
  const totalWins = allScores.reduce((s, x) => s + x.score.gamesWon, 0);

  if (activeGame === 'chess') return <div className="p-3 max-w-lg mx-auto"><button onClick={handleBack} className="flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-400 mb-2"><ArrowLeft className="w-4 h-4" /> Back</button><ChessGame onBack={handleBack} containerWidth={typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 500) : 500} /></div>;
  if (activeGame === 'tictactoe') return <div className="p-3 max-w-md mx-auto"><button onClick={handleBack} className="flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-400 mb-2"><ArrowLeft className="w-4 h-4" /> Back</button><TicTacToe onBack={handleBack} /></div>;
  if (activeGame === 'templerun') return <div className="p-3 max-w-md mx-auto"><button onClick={handleBack} className="flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-400 mb-2"><ArrowLeft className="w-4 h-4" /> Back</button><TempleRunGame onBack={handleBack} /></div>;
  if (activeGame === 'memory') return <div className="p-3 max-w-md mx-auto"><button onClick={handleBack} className="flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-400 mb-2"><ArrowLeft className="w-4 h-4" /> Back</button><MemoryGame onBack={handleBack} /></div>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-amber-500">
          <Gamepad2 className="w-7 h-7" /><h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Game Hub</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400">Take a break and have some fun!</p>
      </div>
      <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 rounded-xl px-4 py-2 border border-gray-200 dark:border-slate-700/50">
        <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> {totalWins} wins</span>
        <span className="text-gray-300 dark:text-slate-600">|</span>
        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-blue-400" /> {totalPlayed} games</span>
        <span className="text-gray-300 dark:text-slate-600">|</span>
        <span className="flex items-center gap-1"><Medal className="w-3 h-3 text-purple-400" /> {GAMES.length} games</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GAMES.map(game => {
          const Icon = game.icon; const s = allScores.find(x => x.id === game.id)?.score;
          return (
            <button key={game.id} onClick={() => setActiveGame(game.id)}
              className={`group text-left bg-white dark:bg-slate-800/80 rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all p-4 flex items-start gap-4 active:scale-[0.98] ${game.featured ? 'border-amber-300 dark:border-amber-600' : 'border-gray-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'}`}>
              <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${game.bgGradient} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{game.title}</h3>
                  {game.featured && <Sparkles className="w-3 h-3 text-amber-400" />}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{game.desc}</p>
                {s && s.gamesPlayed > 0 && <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400 dark:text-slate-500"><Trophy className="w-3 h-3 text-amber-400" /><span>Best: {s.highScore} · Played: {s.gamesPlayed}</span></div>}
              </div>
              <Sparkles className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition shrink-0 mt-1" />
            </button>
          );
        })}
      </div>
      <div className="text-center"><p className="text-[10px] text-gray-400 dark:text-slate-500">Scores saved locally · No data sent · Just fun!</p></div>
    </div>
  );
};