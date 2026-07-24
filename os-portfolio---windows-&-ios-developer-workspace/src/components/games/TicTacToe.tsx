import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Users, Cpu, Settings2 } from 'lucide-react';
import { gameSounds } from '../../utils/gameSounds';
import { GameSettings } from './GameSettings';
import { getScore, saveScore } from '../../utils/gameStorage';

type Player = 'X' | 'O'; type Board = (Player | null)[];

function checkWinner(b: Board): { winner: Player | 'draw' | null; line: number[] | null } {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,6,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) { if (b[a] && b[a] === b[b] && b[a] === b[c]) return { winner: b[a], line: [a,b,c] }; }
  return b.every(Boolean) ? { winner: 'draw', line: null } : { winner: null, line: null };
}

function minimax(b: Player[], isMax: boolean): number {
  const r = checkWinner(b);
  if (r.winner === 'O') return 10; if (r.winner === 'X') return -10; if (r.winner === 'draw') return 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) { if (b[i]) continue; b[i] = isMax ? 'O' : 'X'; const s = minimax(b, !isMax); b[i] = null; best = isMax ? Math.max(best, s) : Math.min(best, s); }
  return best;
}

function getBotMove(b: Player[]): number {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) { if (b[i]) continue; b[i] = 'O'; const s = minimax([...b], false); b[i] = null; if (s > best) { best = s; move = i; } }
  return move;
}

interface Props { onBack: () => void; }

export const TicTacToe: React.FC<Props> = ({ onBack }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [mode, setMode] = useState<'bot' | 'local'>('bot');
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const result = checkWinner(board);

  const applyMove = (idx: number, player: Player) => {
    if (board[idx] || gameOver) return;
    const nb = [...board]; nb[idx] = player; setBoard(nb); gameSounds.move();
    const r = checkWinner(nb);
    if (r.winner) {
      setWinLine(r.line); setGameOver(true);
      if (r.winner === 'draw') { gameSounds.draw(); setScores(p => ({ ...p, draw: p.draw + 1 })); }
      else { r.winner === 'X' ? gameSounds.win() : gameSounds.lose(); setScores(p => ({ ...p, [r.winner]: p[r.winner] + 1 })); }
      saveScore('tictactoe', { gamesPlayed: 1, gamesWon: r.winner === 'X' ? 1 : 0 }); return;
    }
    setTurn(player === 'X' ? 'O' : 'X');
  };

  const handleClick = useCallback((idx: number) => {
    if (board[idx] || gameOver || (mode === 'bot' && turn === 'O')) return;
    applyMove(idx, turn);
  }, [board, turn, mode, gameOver]);

  useEffect(() => {
    if (mode === 'bot' && turn === 'O' && !gameOver) {
      const t = setTimeout(() => { const m = getBotMove(board); if (m >= 0) applyMove(m, 'O'); }, 400);
      return () => clearTimeout(t);
    }
  }, [turn, mode, gameOver, board]);

  const restart = () => { setBoard(Array(9).fill(null)); setTurn('X'); setWinLine(null); setGameOver(false); gameSounds.ding(); };
  const switchMode = (m: 'bot' | 'local') => { setMode(m); restart(); };

  return (
    <div className="flex flex-col items-center gap-4 p-3 select-none">
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-1">
          <button onClick={() => switchMode('bot')} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition ${mode === 'bot' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600'}`}>
            <Cpu className="w-3 h-3" /> vs Bot
          </button>
          <button onClick={() => switchMode('local')} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition ${mode === 'local' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600'}`}>
            <Users className="w-3 h-3" /> 2P
          </button>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 transition">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      <div className={`text-xs font-semibold px-3 py-1 rounded-full ${gameOver ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : turn === 'X' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
        {gameOver ? (result.winner === 'draw' ? "It's a draw!" : mode === 'bot' ? (result.winner === 'O' ? 'Naim Bot wins!' : 'You win!') : `${result.winner} wins!`) : mode === 'bot' ? (turn === 'X' ? 'Your turn' : 'Bot thinking...') : `${turn}'s turn`}
      </div>

      <div className="grid grid-cols-3 gap-2 bg-gray-200 dark:bg-slate-700 p-2.5 rounded-2xl shadow-lg border border-gray-300 dark:border-slate-600">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} disabled={!!cell || gameOver || (mode === 'bot' && turn === 'O')}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl sm:text-4xl font-bold flex items-center justify-center transition-all ${winLine?.includes(i) ? 'scale-110 bg-emerald-200 dark:bg-emerald-800 shadow-md ring-2 ring-emerald-400' : 'bg-white dark:bg-slate-600 hover:bg-gray-50 dark:hover:bg-slate-500'} ${!cell && !gameOver ? 'cursor-pointer active:scale-95' : ''} shadow-sm border border-gray-200 dark:border-slate-500`}>
            <span className={`drop-shadow-sm ${cell === 'X' ? 'text-blue-500 dark:text-blue-400' : cell === 'O' ? 'text-red-500 dark:text-red-400' : ''}`}>{cell}</span>
          </button>
        ))}
      </div>

      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-blue-500">X: {scores.X}</span>
          <span className="text-gray-400 dark:text-slate-500">D: {scores.draw}</span>
          <span className="font-bold text-red-500">O: {scores.O}</span>
        </div>
        <button onClick={restart} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm">
          <RotateCcw className="w-3.5 h-3.5" /> New
        </button>
      </div>
      <GameSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};