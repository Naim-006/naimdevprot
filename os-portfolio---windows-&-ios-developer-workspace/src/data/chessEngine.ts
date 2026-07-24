import { Chess, Square } from 'chess.js';

const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
};

const PAWN_TABLE = [
  [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],
  [10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],
  [0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0],
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],
  [-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],
  [-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
  [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50],
];

const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
  [-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],
  [-10,0,5,10,10,5,0,-10],[-10,10,5,10,10,5,10,-10],
  [-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20],
];

const ROOK_TABLE = [
  [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],
  [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0],
];

const QUEEN_TABLE = [
  [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
  [-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],
  [0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
  [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20],
];

const KING_TABLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
  [20,20,0,0,0,0,20,20],[20,30,10,0,0,0,10,30,20],
];

const PST: Record<string, number[][]> = {
  p: PAWN_TABLE, n: KNIGHT_TABLE, b: BISHOP_TABLE,
  r: ROOK_TABLE, q: QUEEN_TABLE, k: KING_TABLE,
};

function evaluateBoard(game: Chess): number {
  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const val = PIECE_VALUES[piece.type] || 0;
      const table = PST[piece.type];
      const posVal = table ? table[piece.color === 'w' ? r : 7 - r][c] : 0;
      score += (piece.color === 'w' ? 1 : -1) * (val + posVal);
    }
  }
  return score;
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    const evalScore = evaluateBoard(game);
    if (game.isCheckmate()) return isMaximizing ? -100000 + depth : 100000 - depth;
    if (game.isDraw() || game.isStalemate()) return 0;
    return evalScore;
  }
  const moves = game.moves({ verbose: true });
  moves.sort((a, b) => (b.captured ? PIECE_VALUES[b.captured] || 0 : 0) - (a.captured ? PIECE_VALUES[a.captured] || 0 : 0));
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move.san);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move.san);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestMove(fen: string, depth: number): string | null {
  const game = new Chess(fen);
  if (game.isGameOver()) return null;
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0].san;
  moves.sort((a, b) => (b.captured ? PIECE_VALUES[b.captured] || 0 : 0) - (a.captured ? PIECE_VALUES[a.captured] || 0 : 0));
  const isWhite = game.turn() === 'w';
  let bestMove = moves[0].san;
  let bestScore = isWhite ? -Infinity : Infinity;
  for (const move of moves) {
    game.move(move.san);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
    game.undo();
    if (isWhite ? score > bestScore : score < bestScore) { bestScore = score; bestMove = move.san; }
  }
  return bestMove;
}

export function getAdaptiveBestMove(fen: string): string | null {
  const game = new Chess(fen);
  const totalPieces = game.board().flat().filter(Boolean).length;
  const depth = totalPieces <= 8 ? 4 : 3;
  return getBestMove(fen, depth);
}

export { Chess };