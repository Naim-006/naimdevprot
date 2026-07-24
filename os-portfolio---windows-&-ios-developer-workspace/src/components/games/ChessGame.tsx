import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { getAdaptiveBestMove } from '../../data/chessEngine';
import { usePortfolio } from '../../context/PortfolioContext';
import { saveChessGame, loadChessGame, removeChessGame } from '../../utils/gameStorage';
import { gameSounds } from '../../utils/gameSounds';
import { GameSettings } from './GameSettings';
import { PIECE_COMPONENTS } from '../../data/chessPieces';
import { RotateCcw, Undo2, Brain, Settings2, Trophy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const THOUGHTS = [
  'Hmm, interesting...', 'Calculating...', "You're good!", 'Let me think...',
  'I see what you did there!', 'Strategizing...', 'Not bad!', 'Analyzing the board...',
];

const LIGHT = '#F0D9B5'; const DARK = '#B58863';
const LIGHT_LAST = '#CDC478'; const DARK_LAST = '#BAB05C';
const LIGHT_SEL = '#829769'; const DARK_SEL = '#6B7F51';

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

interface ChessGameProps { onBack: () => void; containerWidth?: number; }

export const ChessGame: React.FC<ChessGameProps> = ({ onBack, containerWidth = 500 }) => {
  const { personalInfo } = usePortfolio();
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [selected, setSelected] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [botThinking, setBotThinking] = useState(false);
  const [thought, setThought] = useState('');
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [statusText, setStatusText] = useState('');
  const [moveLog, setMoveLog] = useState<string[]>([]);
  const [capturedW, setCapturedW] = useState<string[]>([]);
  const [capturedB, setCapturedB] = useState<string[]>([]);
  const [showPromotion, setShowPromotion] = useState(false);
  const [promoSquare, setPromoSquare] = useState<Square | null>(null);
  const [won, setWon] = useState(0);
  const [lost, setLost] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoveLog, setShowMoveLog] = useState(false);
  const [playerTime, setPlayerTime] = useState(300);
  const [botTime, setBotTime] = useState(300);
  const [gameStarted, setGameStarted] = useState(false);
  const thoughtTimer = useRef<ReturnType<typeof setInterval>>();
  const logEndRef = useRef<HTMLDivElement>(null);
  const cellSize = Math.max(28, Math.min(Math.floor((containerWidth - 24) / 8), 64));

  useEffect(() => {
    const saved = loadChessGame('current');
    if (saved) { try { const g = new Chess(); g.load(saved); syncGame(g); } catch {} }
  }, []);
  useEffect(() => () => { if (thoughtTimer.current) clearInterval(thoughtTimer.current); }, []);
  useEffect(() => { logEndRef.current?.scrollIntoView(); }, [moveLog]);
  useEffect(() => {
    if (!gameStarted || game.isGameOver()) return;
    const timer = setInterval(() => { if (botThinking) setBotTime(t => Math.max(0, t - 1)); else setPlayerTime(t => Math.max(0, t - 1)); }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, game.isGameOver(), botThinking]);

  const syncGame = (g: Chess) => {
    setGame(g); setFen(g.fen()); setMoveLog(g.history());
    if (g.isGameOver()) {
      setGameStarted(false);
      if (g.isCheckmate()) {
        const w = g.turn() === 'w' ? 'Black' : 'White';
        setStatusText(w === 'White' ? 'You Win! 🎉' : 'Naim Bot Wins! 🤖');
        if (w === 'White') { setWon(p => p + 1); gameSounds.win(); } else { setLost(p => p + 1); gameSounds.lose(); }
      } else { setStatusText('Draw! 🤝'); gameSounds.draw(); }
    } else { setStatusText(g.isCheck() ? 'Check! ⚡' : g.turn() === 'w' ? 'Your turn' : 'Bot thinking...'); if (g.turn() === 'b') triggerBotMove(g.fen()); }
  };

  const handleClick = useCallback((sq: Square) => {
    if (botThinking || game.isGameOver() || showPromotion || game.turn() !== 'w') return;
    if (!gameStarted) setGameStarted(true);
    if (selected) {
      if (validMoves.includes(sq)) {
        const p = game.get(selected); const isProm = p?.type === 'p' && (sq[1] === '8' || sq[1] === '1');
        if (isProm) { setPromoSquare(sq); setShowPromotion(true); return; }
        executeMove(selected, sq, 'q'); return;
      }
      setSelected(null); setValidMoves([]); gameSounds.click(); return;
    }
    const piece = game.get(sq);
    if (piece && piece.color === 'w') { setSelected(sq); setValidMoves(game.moves({ square: sq, verbose: true }).map(m => m.to as Square)); gameSounds.select(); }
  }, [selected, validMoves, botThinking, game, showPromotion, gameStarted]);

  const executeMove = (from: Square, to: Square, promotion?: string) => {
    try {
      const g = new Chess(game.fen());
      const captured = g.get(to);
      g.move({ from, to, promotion: (promotion || 'q') as any });
      if (captured) { setCapturedB(p => [...p, captured.type.toUpperCase()]); gameSounds.capture(); } else gameSounds.move();
      if (g.isCheck()) gameSounds.check();
      setLastMove({ from, to }); syncGame(g); saveChessGame('current', g.fen());
    } catch {}
  };

  const handlePromotion = (piece: string) => { if (selected && promoSquare) executeMove(selected, promoSquare, piece); setShowPromotion(false); setPromoSquare(null); };

  const triggerBotMove = (currentFen: string) => {
    setBotThinking(true); let idx = 0;
    thoughtTimer.current = setInterval(() => { setThought(THOUGHTS[idx % THOUGHTS.length]); idx++; }, 1500);
    setTimeout(() => {
      if (thoughtTimer.current) clearInterval(thoughtTimer.current);
      const best = getAdaptiveBestMove(currentFen); if (!best) { setBotThinking(false); return; }
      const g = new Chess(currentFen);
      try {
        const captured = g.get(best.split('-')[0] as Square) || g.get(best.split('x')?.[1]?.[0] + best.split('x')?.[1]?.[1] as Square);
        g.move(best);
        if (captured) { setCapturedW(p => [...p, captured.type.toUpperCase()]); gameSounds.capture(); } else gameSounds.move();
        if (g.isCheck()) gameSounds.check();
        setLastMove(null); syncGame(g); saveChessGame('current', g.fen());
      } catch {}
      setBotThinking(false);
    }, 800 + Math.random() * 1200);
  };

  const undo = () => { if (botThinking || moveLog.length < 2) return; gameSounds.click(); const g = new Chess(game.fen()); g.undo(); g.undo(); syncGame(g); setLastMove(null); setSelected(null); setValidMoves([]); saveChessGame('current', g.fen()); };
  const restart = () => { gameSounds.ding(); const g = new Chess(); setGame(g); setFen(g.fen()); setMoveLog([]); setCapturedW([]); setCapturedB([]); setSelected(null); setValidMoves([]); setBotThinking(false); setStatusText(''); setLastMove(null); setPlayerTime(300); setBotTime(300); setGameStarted(false); removeChessGame('current'); };
  const resultEmoji = () => { if (statusText.includes('You Win')) return '🎉'; if (statusText.includes('Naim Bot Wins')) return '🤖'; if (statusText.includes('Draw')) return '🤝'; return botThinking ? '🤔' : ''; };

  const renderPiece = (type: string, color: string, sz: number) => {
    const Comp = PIECE_COMPONENTS[type];
    return Comp ? <Comp size={sz} isWhite={color === 'w'} /> : null;
  };

  const renderCaptured = (pieces: string[], isWhite: boolean) => {
    const order: Record<string, number> = { Q: 0, R: 1, B: 2, N: 3, P: 4 };
    return [...pieces].sort((a, b) => (order[a] ?? 5) - (order[b] ?? 5)).map((p, i) => (
      <div key={i} className="flex items-center justify-center" style={{ width: 14, height: 14 }}>
        {renderPiece(p.toLowerCase(), isWhite ? 'w' : 'b', 12)}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="w-full flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 dark:border-amber-500/20">
        <div className="relative shrink-0">
          <img src={personalInfo.avatarUrl} alt="Naim" className="w-9 h-9 rounded-full object-cover border-2 border-amber-400/60" />
          <span className="absolute -bottom-1 -right-0.5 text-xs">{resultEmoji() || '🧑‍💻'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-gray-900 dark:text-white">Naim Bot</span>
            {botThinking && <Brain className="w-3 h-3 text-amber-500 animate-pulse" />}
            <span className="text-[10px] text-amber-500 font-mono ml-auto">{formatTime(botTime)}</span>
          </div>
          <p className="text-[9px] text-gray-500 dark:text-slate-400 truncate">{botThinking ? thought : statusText || 'Your turn'}</p>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 transition">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full flex items-center gap-2 px-1">
        <span className="text-xs font-bold text-gray-900 dark:text-white">You</span>
        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">{formatTime(playerTime)}</span>
        <div className="flex-1" />
        <div className="flex gap-0.5 items-center">{renderCaptured(capturedB, false)}</div>
      </div>

      <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-600" style={{ width: cellSize * 8, height: cellSize * 8 }}>
        {game.board().map((row, ri) => (
          <div key={ri} className="flex" style={{ height: cellSize }}>
            {row.map((piece, ci) => {
              const sq = (String.fromCharCode(97 + ci) + (8 - ri)) as Square;
              const isLight = (ri + ci) % 2 === 0;
              const isSel = selected === sq;
              const isValid = validMoves.includes(sq);
              const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
              const isCheck = game.isCheck() && piece?.type === 'k' && piece?.color === 'w';
              return (
                <button key={sq} onClick={() => handleClick(sq)} style={{ width: cellSize, height: cellSize }} className="relative flex items-center justify-center outline-none">
                  <div className="absolute inset-0" style={{ backgroundColor: isSel ? (isLight ? LIGHT_SEL : DARK_SEL) : isLast ? (isLight ? LIGHT_LAST : DARK_LAST) : isLight ? LIGHT : DARK }} />
                  {isValid && <div className={`absolute rounded-full z-10 ${piece ? 'w-3 h-3 ring-2' : 'w-3 h-3'}`}
                    style={{ borderColor: piece ? '#4ade80' : 'transparent', backgroundColor: piece ? 'transparent' : 'rgba(74,222,128,0.5)', boxShadow: piece ? '0 0 4px rgba(74,222,128,0.6)' : '0 0 3px rgba(74,222,128,0.4)' }} />}
                  {isCheck && <div className="absolute inset-0 z-10 rounded-full animate-pulse" style={{ margin: cellSize * 0.15, background: 'radial-gradient(circle, rgba(255,50,50,0.5), transparent)' }} />}
                  {piece && <div className="relative z-20" style={{ filter: piece.color === 'w' ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' : 'drop-shadow(0 0 1px rgba(255,255,255,0.2))' }}>
                    {renderPiece(piece.type, piece.color, cellSize * 0.72)}
                  </div>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="w-full flex justify-between px-0.5 text-[9px] text-gray-400 dark:text-slate-500 font-mono">
        <span>a b c d e f g h</span><span>1 2 3 4 5 6 7 8</span>
      </div>

      {capturedW.length > 0 && <div className="w-full flex items-center gap-1 px-1">
        <span className="text-[9px] text-gray-400 dark:text-slate-500">Captured:</span>
        <div className="flex gap-0.5 items-center">{renderCaptured(capturedW, true)}</div>
      </div>}

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button onClick={undo} disabled={botThinking || moveLog.length < 2}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-40 transition shadow-sm">
          <Undo2 className="w-3.5 h-3.5" /> Undo
        </button>
        <button onClick={restart}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm">
          <RefreshCw className="w-3.5 h-3.5" /> New Game
        </button>
        <button onClick={() => setShowMoveLog(p => !p)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition shadow-sm">
          {showMoveLog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />} Moves
        </button>
      </div>

      {showMoveLog && (
        <div className="w-full max-h-32 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-2.5 shadow-sm">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-[10px] font-mono">
            {moveLog.reduce((rows: React.ReactNode[], move, i) => {
              if (i % 2 === 0) { const turn = Math.floor(i / 2) + 1; rows.push(<span key={`n${i}`} className="text-gray-400 dark:text-slate-500 text-right">{turn}.</span>); rows.push(<span key={`w${i}`} className="text-gray-900 dark:text-white font-semibold">{move}</span>); rows.push(<span key={`b${i}`} className="text-gray-600 dark:text-slate-300">{moveLog[i + 1] || ''}</span>); }
              return rows;
            }, [])}
          </div>
          <div ref={logEndRef} />
        </div>
      )}

      <div className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
        <span className="text-[10px] text-gray-500 dark:text-slate-400">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">You {won}</span>
          <span className="text-gray-300 dark:text-slate-600 mx-2">:</span>
          <span className="font-bold text-red-500 dark:text-red-400">{lost} Naim Bot</span>
        </span>
      </div>

      {showPromotion && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-slate-700">
            <div className="text-xs font-bold text-gray-600 dark:text-slate-300 text-center mb-3">Promote pawn to:</div>
            <div className="flex gap-2">
              {(['q', 'r', 'b', 'n'] as const).map((p) => (
                <button key={p} onClick={() => handlePromotion(p)}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 hover:border-amber-400 hover:scale-110 transition"
                  title={{ q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' }[p]}>
                  {renderPiece(p, 'w', 30)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <GameSettings open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};