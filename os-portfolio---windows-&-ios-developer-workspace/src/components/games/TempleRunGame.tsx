import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RotateCcw, Settings2, Undo2, Lightbulb, Trophy, Star } from 'lucide-react';
import { gameSounds } from '../../utils/gameSounds';
import { GameSettings } from './GameSettings';
import { getScore, saveScore } from '../../utils/gameStorage';

type Dir = 'U' | 'D' | 'L' | 'R';
type Cell = Dir | 'W' | null;
type Board = Cell[][];

const DIR_DX: Record<Dir, number> = { U: 0, D: 0, L: -1, R: 1 };
const DIR_DY: Record<Dir, number> = { U: -1, D: 1, L: 0, R: 0 };

const DIR_GRAD: Record<Dir, string> = {
  U: 'from-emerald-400 to-emerald-600',
  D: 'from-blue-400 to-blue-600',
  L: 'from-orange-400 to-orange-600',
  R: 'from-purple-400 to-purple-600',
};
const DIR_GLOW: Record<Dir, string> = {
  U: 'rgba(52,211,153,0.5)',
  D: 'rgba(96,165,250,0.5)',
  L: 'rgba(251,146,60,0.5)',
  R: 'rgba(192,132,252,0.5)',
};
const DIR_BG: Record<Dir, string> = {
  U: 'bg-emerald-50 dark:bg-emerald-950/30',
  D: 'bg-blue-50 dark:bg-blue-950/30',
  L: 'bg-orange-50 dark:bg-orange-950/30',
  R: 'bg-purple-50 dark:bg-purple-950/30',
};

// ----- Solver & Verified Level Generator -----

function solveBoard(b: Board): [number, number][] | null {
  const s = b.length;
  const flat = b.flat().filter(c => c !== null && c !== 'W');
  if (flat.length === 0) return [];

  const movable: [number, number][] = [];
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      if (canMoveSimple(x, y, b)) movable.push([x, y]);
    }
  }
  if (movable.length === 0) return null;

  // Prioritize edge arrows for faster solving
  movable.sort((a, b) => {
    const onEdgeA = a[0] === 0 || a[0] === s - 1 || a[1] === 0 || a[1] === s - 1;
    const onEdgeB = b[0] === 0 || b[0] === s - 1 || b[1] === 0 || b[1] === s - 1;
    return (onEdgeB ? 1 : 0) - (onEdgeA ? 1 : 0);
  });

  for (const [mx, my] of movable) {
    const copy = b.map(row => [...row]);
    copy[my][mx] = null;
    const result = solveBoard(copy);
    if (result !== null) return [[mx, my], ...result];
  }
  return null;
}

function canMoveSimple(x: number, y: number, b: Board): boolean {
  const cell = b[y]?.[x];
  if (!cell || cell === 'W') return false;
  const dx = DIR_DX[cell]; const dy = DIR_DY[cell];
  let cx = x + dx, cy = y + dy; const sz = b.length;
  while (cx >= 0 && cx < sz && cy >= 0 && cy < sz) {
    if (b[cy][cx] !== null) return false;
    cx += dx; cy += dy;
  }
  return true;
}

// Hand-crafted, verified-solvable levels
const LEVELS: { size: number; grid: string }[] = [
  // 3×3 — Beginner
  { size: 3, grid: '__U|_U_|D__' },       // (2,0)U→↑, (1,1)U→↑, (0,2)D→↓
  { size: 3, grid: 'R__|_U_|__L' },       // (0,0)R→→, (1,1)U→↑, (2,2)L→←
  { size: 3, grid: 'U_R|___|L__' },       // (0,0)U→↑, (2,0)R→→, (0,2)L→←
  // 4×4 — Easy
  { size: 4, grid: '___U|_U__|__D_|D___' },
  { size: 4, grid: 'R___|_U__|__D_|___L' },
  { size: 4, grid: 'U___|_R__|__L_|___D' },
  { size: 4, grid: '__UR|U___|___D|L___' },
  { size: 4, grid: 'R__U|_U_D|__L_|D___' },
  // 5×5 — Medium
  { size: 5, grid: '____U|_U___|__D__|___D_|U____' },
  { size: 5, grid: 'R____|_U___|__U__|___D_|____L' },
  { size: 5, grid: 'U___D|_R___|__U__|___L_|D___U' },
  { size: 5, grid: '__U__|U___D|_____|D___U|__D__' },
  { size: 5, grid: 'R__U_|_U__R|__D__|L__D_|_L___' },
  // 6×6 — Hard
  { size: 6, grid: '_____U|_U____|__D___|___D__|____U_|U_____' },
  { size: 6, grid: 'R_____|_U___D|__U___|___D__|____U_|_____L' },
  { size: 6, grid: 'U___D_|_R___U|__U___|___D__|D___R_|_U___D' },
  { size: 6, grid: '__U___|U__U__|_____D|D_____|__D__U|___D__' },
  { size: 6, grid: 'R___U_|_U___R|__D___|___U__|____D_|L___D_' },
  // 7×7 — Expert
  { size: 7, grid: '______U|_U_____|__D____|___D___|____U__|_____U_|U______' },
  { size: 7, grid: 'R______|_U___D_|__U____|___D___|____U__|_____U_|______L' },
  { size: 7, grid: 'U_____D|_R___U_|__U___D|___D___|____U__|D___R__|_U____U' },
  // 8×8 — Master
  { size: 8, grid: '_______U|_U______|__D_____|___D____|____U___|_____U__|______U_|U_______' },
  { size: 8, grid: 'R_______|_U_____D|__U_____|___U____|____D___|_____D__|______U_|_______L' },
  { size: 8, grid: 'U_______|_R_____U|__U_____|___U____|____D___|_____D__|D______R|_U_____U' },
].filter(lvl => solveBoard(stringToBoard(lvl.grid)) !== null); // safety filter

function boardToString(board: Board): string {
  return board.map(row => row.map(c => c || '_').join('')).join('|');
}

function stringToBoard(s: string): Board {
  return s.split('|').map(row => row.split('').map(c => c === '_' ? null : c as Cell));
}

// Endless generator: places arrows on edges pointing outward (always solvable)
function generateEndlessPuzzle(size: number): Board {
  const board: Board = Array.from({ length: size }, () => Array(size).fill(null));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x === 0 && Math.random() < 0.35) board[y][x] = 'L';
      if (x === size - 1 && Math.random() < 0.35) board[y][x] = 'R';
      if (y === 0 && Math.random() < 0.35) board[y][x] = 'U';
      if (y === size - 1 && Math.random() < 0.35) board[y][x] = 'D';
    }
  }
  if (board.flat().filter(Boolean).length < 3) {
    board[0][0] = 'U'; board[size - 1][1] = 'R'; board[1][size - 1] = 'D';
  }
  return board;
}

interface Props { onBack: () => void; }

export const TempleRunGame: React.FC<Props> = ({ onBack }) => {
  const [level, setLevel] = useState(0);
  const [board, setBoard] = useState<Board>([]);
  const [size, setSize] = useState(4);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [stars, setStars] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(0);
  const [undoStack, setUndoStack] = useState<{ board: Board; moves: number }[]>([]);
  const [particles, setParticles] = useState<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);
  const [shakeCell, setShakeCell] = useState<{ x: number; y: number } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [levelSelect, setLevelSelect] = useState(false);
  const [completed, setCompleted] = useState<Record<number, number>>({});
  const [unlocked, setUnlocked] = useState<Record<number, boolean>>({ 0: true });
  const [highScore, setHighScore] = useState(0);
  const [arrowCount, setArrowCount] = useState(0);
  const [initialCount, setInitialCount] = useState(0);
  const [isEndless, setIsEndless] = useState(false);
  const [endlessScore, setEndlessScore] = useState(0);
  const timerRef = useRef(0);

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem('arrow_escape_progress');
      if (saved) {
        const { completed: c, unlocked: u } = JSON.parse(saved);
        if (c) setCompleted(c);
        if (u) setUnlocked(u);
      }
    } catch {}
    const hs = getScore('arrow_escape').highScore;
    setHighScore(hs);
  }, []);

  const saveProgress = (lvl: number, starsCount: number) => {
    const newCompleted = { ...completed, [lvl]: Math.max(starsCount, completed[lvl] || 0) };
    const newUnlocked = { ...unlocked, [lvl + 1]: true };
    setCompleted(newCompleted);
    setUnlocked(newUnlocked);
    localStorage.setItem('arrow_escape_progress', JSON.stringify({ completed: newCompleted, unlocked: newUnlocked }));
    saveScore('arrow_escape', { highScore: starsCount, gamesPlayed: 1, gamesWon: 1 });
  };

  const loadLevel = useCallback((idx: number) => {
    let b: Board;
    let sz: number;
    if (idx < LEVELS.length) {
      const lvl = LEVELS[idx];
      sz = lvl.size;
      b = stringToBoard(lvl.grid);
    } else {
      sz = 5 + Math.floor(Math.random() * 3);
      b = generateEndlessPuzzle(sz);
    }
    setLevel(idx);
    setBoard(b.map(r => [...r]));
    setSize(sz);
    setMoves(0); setTimer(0); setWon(false); setLost(false); setCombo(0);
    setComboTimer(0); setUndoStack([]); setParticles([]); setShakeCell(null);
    setIsEndless(idx >= LEVELS.length);
    setEndlessScore(0);
    const count = b.flat().filter(c => c !== null && c !== 'W').length;
    setArrowCount(count);
    setInitialCount(count);
    timerRef.current = 0;
  }, []);

  useEffect(() => { loadLevel(0); }, []);

  // Timer
  useEffect(() => {
    if (won || lost) return;
    const t = setInterval(() => { timerRef.current++; setTimer(timerRef.current); }, 1000);
    return () => clearInterval(t);
  }, [won, lost, level]);

  // Combo timer
  useEffect(() => {
    if (comboTimer <= 0) return;
    const t = setTimeout(() => { setComboTimer(p => p - 1); if (comboTimer <= 1) setCombo(0); }, 200);
    return () => clearTimeout(t);
  }, [comboTimer]);

  // Particles
  useEffect(() => {
    if (particles.length === 0) return;
    const t = setInterval(() => {
      setParticles(p => p.map(pt => ({ ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy, vy: pt.vy + 0.1, life: pt.life - 1 })).filter(pt => pt.life > 0));
    }, 30);
    return () => clearInterval(t);
  }, [particles.length]);

  const canMove = (bx: number, by: number, b: Board): boolean => {
    const cell = b[by]?.[bx];
    if (!cell || cell === 'W') return false;
    const dx = DIR_DX[cell];
    const dy = DIR_DY[cell];
    let x = bx + dx, y = by + dy;
    const s = b.length;
    while (x >= 0 && x < s && y >= 0 && y < s) {
      if (b[y][x] !== null) return false;
      x += dx; y += dy;
    }
    return true;
  };

  const getMoveableCells = (b: Board): [number, number][] => {
    const s = b.length;
    const result: [number, number][] = [];
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        if (canMove(x, y, b)) result.push([x, y]);
      }
    }
    return result;
  };

  const handleCellClick = useCallback((x: number, y: number) => {
    if (won || lost) return;
    const b = board.map(r => [...r]);
    if (!canMove(x, y, b)) {
      setShakeCell({ x, y });
      setTimeout(() => setShakeCell(null), 300);
      gameSounds.click();
      return;
    }

    setUndoStack(prev => [...prev, { board: board.map(r => [...r]), moves }]);
    const cell = b[y][x] as Dir;
    b[y][x] = null;
    setBoard(b);
    gameSounds.move();

    const newMoves = moves + 1;
    setMoves(newMoves);

    // Combo
    setCombo(p => p + 1);
    setComboTimer(5);
    if (combo >= 2) gameSounds.match();

    // Particles
    const px = x * 48 + 24;
    const py = y * 48 + 24;
    const arr: typeof particles = [];
    const colors = ['#f59e0b', '#3b82f6', '#ef4444', '#22c55e', '#a855f7'];
    for (let i = 0; i < 8; i++) {
      arr.push({ x: px, y: py, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8 - 2, life: 20 + Math.random() * 15, color: colors[i % colors.length] });
    }
    setParticles(p => [...p, ...arr]);

    // Check win
    const remaining = b.flat().filter(c => c !== null && c !== 'W').length;
    setArrowCount(remaining);
    if (remaining === 0) {
      setWon(true);
      gameSounds.win();
      const starCount = newMoves <= initialCount * 0.6 ? 3 : newMoves <= initialCount * 0.85 ? 2 : 1;
      setStars(starCount);
      if (level < LEVELS.length) saveProgress(level, starCount);
      saveScore('arrow_escape', { highScore: starCount, gamesPlayed: 1, gamesWon: 1 });
      // Confetti
      const confetti: typeof particles = [];
      for (let i = 0; i < 30; i++) {
        confetti.push({ x: Math.random() * 400, y: Math.random() * 200, vx: (Math.random() - 0.5) * 10, vy: -5 - Math.random() * 5, life: 40 + Math.random() * 30, color: colors[i % colors.length] });
      }
      setParticles(p => [...p, ...confetti]);
    } else {
      // Check if any moves left
      if (getMoveableCells(b).length === 0) {
        setLost(true);
        gameSounds.lose();
      }
    }
  }, [board, moves, won, lost, combo, initialCount, level, completed, unlocked]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setBoard(prev.board);
    setMoves(prev.moves);
    gameSounds.click();
    setWon(false); setLost(false);
    const count = prev.board.flat().filter(c => c !== null && c !== 'W').length;
    setArrowCount(count);
  }, [undoStack]);

  const restart = useCallback(() => {
    gameSounds.ding();
    loadLevel(level);
  }, [level, loadLevel]);

  const nextLevel = useCallback(() => {
    const next = level + 1;
    if (next < LEVELS.length || isEndless) {
      loadLevel(next);
    }
  }, [level, loadLevel, isEndless]);

  const selectLevel = useCallback((idx: number) => {
    if (unlocked[idx]) {
      loadLevel(idx);
      setLevelSelect(false);
    }
  }, [unlocked, loadLevel]);

  const gridSize = Math.min(size, 8);
  const cellPx = Math.floor(Math.min(360, window.innerWidth - 32) / gridSize);
  const gSize = cellPx * gridSize;

  const movableCells = useMemo(() => getMoveableCells(board), [board]);
  const movableSet = useMemo(() => new Set(movableCells.map(([x, y]) => `${x},${y}`)), [movableCells]);

  return (
    <div className="flex flex-col items-center gap-1.5 select-none p-1 max-w-[400px] mx-auto">
      {/* HUD */}
      {!levelSelect && (
        <div className="w-full flex items-center justify-between px-1">
          <button onClick={() => setLevelSelect(true)} className="text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:underline">
            {isEndless ? '∞ Endless' : `Level ${level + 1}/${LEVELS.length}`}
          </button>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-gray-900 dark:text-white">{moves}</span>
            <span className="text-gray-400 dark:text-slate-500 text-[10px] font-mono">{timer}s</span>
            <span className="text-gray-400 dark:text-slate-500 text-[10px]">{arrowCount} left</span>
          </div>
          <div className="flex items-center gap-0.5">
            {combo >= 2 && <span className="text-[10px] font-bold text-orange-400 animate-pulse">{combo}x🔥</span>}
            <button onClick={() => setShowSettings(true)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 transition">
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {levelSelect ? (
        /* Level Select */
        <div className="w-full max-w-[360px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Select Level</h2>
            <button onClick={() => setLevelSelect(false)} className="text-xs font-bold text-blue-500 dark:text-blue-400">Close</button>
          </div>
          <div className="grid grid-cols-6 gap-1.5 max-h-[300px] overflow-y-auto p-1">
            {Array.from({ length: LEVELS.length + 5 }).map((_, i) => {
              const isUnlocked = unlocked[i];
              const starsCount = completed[i] || 0;
              return (
                <button key={i} onClick={() => selectLevel(i)}
                  disabled={!isUnlocked}
                  className={`relative p-2 rounded-xl text-xs font-bold transition ${
                    level === i
                      ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                      : isUnlocked
                      ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 hover:border-amber-300'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
                  }`}>
                  {i + 1}
                  {starsCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-[9px]">{'⭐'.repeat(starsCount)}</span>
                  )}
                </button>
              );
            })}
          </div>
          <button onClick={() => { setIsEndless(true); loadLevel(LEVELS.length); setLevelSelect(false); }}
            className="mt-2 w-full py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition shadow-sm">
            ∞ Endless Mode
          </button>
        </div>
      ) : (
        <>
          {/* Board */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-600 shadow-lg"
            style={{ width: gSize, height: gSize, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            
            {/* Subtle inner grid */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
                `,
                backgroundSize: `${cellPx}px ${cellPx}px`,
              }} />

            {/* Cells */}
            {board.map((row, y) => (
              row.map((cell, x) => {
                const isWall = cell === 'W';
                if (isWall) {
                  return (
                    <div key={`${x}-${y}`} className="absolute" style={{ left: x * cellPx, top: y * cellPx, width: cellPx, height: cellPx }}>
                      <div className="m-1 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-700 shadow-inner" style={{ width: cellPx - 8, height: cellPx - 8 }} />
                    </div>
                  );
                }
                if (!cell) return null;
                const dir = cell as Dir;
                const isMovable = movableSet.has(`${x},${y}`);
                const isShaking = shakeCell?.x === x && shakeCell?.y === y;
                return (
                  <button key={`${x}-${y}`} onClick={() => handleCellClick(x, y)}
                    className={`absolute flex items-center justify-center ${isShaking ? 'animate-shake' : ''}`}
                    style={{ left: x * cellPx, top: y * cellPx, width: cellPx, height: cellPx }}>
                    <div className={`relative flex items-center justify-center rounded-xl transition-all duration-200 ${
                      isMovable
                        ? `cursor-pointer ${DIR_BG[dir]} border-2 border-transparent hover:scale-110 hover:z-10 hover:shadow-xl active:scale-95`
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                      style={{
                        width: cellPx - 10,
                        height: cellPx - 10,
                        boxShadow: isMovable ? `0 2px 8px rgba(0,0,0,0.08)` : 'none',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}>
                      {/* Directional gradient background */}
                      {isMovable && (
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${DIR_GRAD[dir]} opacity-[0.08]`} />
                      )}
                      {/* Arrow SVG */}
                      <svg viewBox="0 0 24 24" className={`relative z-10 ${isMovable ? 'drop-shadow-sm' : ''}`}
                        style={{
                          width: cellPx * 0.45,
                          height: cellPx * 0.45,
                          transform: dir === 'D' ? 'rotate(180deg)' : dir === 'L' ? 'rotate(-90deg)' : dir === 'R' ? 'rotate(90deg)' : 'rotate(0deg)',
                          filter: isMovable ? `drop-shadow(0 1px 2px ${DIR_GLOW[dir]})` : 'none',
                        }}>
                        <path d="M12 4l-8 8h5v8h6v-8h5z" fill={isMovable ? (dir === 'U' ? '#10b981' : dir === 'D' ? '#3b82f6' : dir === 'L' ? '#f97316' : '#a855f7') : '#94a3b8'} />
                        <path d="M12 4l-8 8h5v8h6v-8h5z" fill="none" stroke={isMovable ? (dir === 'U' ? '#059669' : dir === 'D' ? '#2563eb' : dir === 'L' ? '#ea580c' : '#9333ea') : 'none'} strokeWidth="0.5" />
                      </svg>
                      {/* Glow ring on hover */}
                      {isMovable && (
                        <div className="absolute inset-0 rounded-xl border-2 border-transparent hover:border-current transition-all duration-200 pointer-events-none"
                          style={{ color: DIR_GLOW[dir] }} />
                      )}
                    </div>
                  </button>
                );
              })
            ))}

            {/* Particles */}
            {particles.map((p, i) => (
              <div key={`p${i}`} className="absolute rounded-full pointer-events-none" style={{
                left: p.x,
                top: p.y,
                width: 5, height: 5,
                background: p.color,
                opacity: p.life / 40,
                boxShadow: `0 0 4px ${p.color}`,
              }} />
            ))}

            {/* Win overlay */}
            {won && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1 z-20">
                <span className="text-white font-bold text-lg drop-shadow">🎉 Level Complete!</span>
                <div className="flex gap-1 my-1">
                  {[1, 2, 3].map(s => (
                    <Star key={s} className={`w-6 h-6 ${s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                  ))}
                </div>
                <div className="flex gap-1 text-[10px] text-slate-400">
                  <span>{moves} moves</span><span className="text-slate-600">·</span><span>{timer}s</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {isEndless ? (
                    <button onClick={nextLevel} className="px-5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md active:scale-95 transition-all">
                      ▶ Next Level
                    </button>
                  ) : level < LEVELS.length - 1 ? (
                    <button onClick={nextLevel} className="px-5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md active:scale-95 transition-all">
                      ▶ Next Level
                    </button>
                  ) : (
                    <button onClick={() => { setIsEndless(true); loadLevel(LEVELS.length); }}
                      className="px-5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md active:scale-95 transition-all">
                      ▶ Continue to Endless
                    </button>
                  )}
                  <button onClick={restart} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white/20 text-white hover:bg-white/30 transition">
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Lose overlay */}
            {lost && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1 z-20">
                <span className="text-white font-bold text-lg drop-shadow">😵 No Moves Left!</span>
                <p className="text-slate-400 text-xs">Try undoing some moves</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={undo} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md active:scale-95 transition-all">
                    Undo Last Move
                  </button>
                  <button onClick={restart} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white shadow-md active:scale-95 transition-all">
                    Restart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button onClick={undo} disabled={undoStack.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-40 transition shadow-sm active:scale-95">
              <Undo2 className="w-3.5 h-3.5" /> Undo
            </button>
            <button onClick={restart}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm active:scale-95">
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
            <button onClick={() => setLevelSelect(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition shadow-sm active:scale-95">
              Levels
            </button>
          </div>

          <div className="text-[9px] text-gray-400 dark:text-slate-500 text-center leading-relaxed px-2">
            Click an arrow to slide it in its direction<br/>
            Clear path = moves out · Blocked = stays
          </div>
        </>
      )}

      <GameSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};