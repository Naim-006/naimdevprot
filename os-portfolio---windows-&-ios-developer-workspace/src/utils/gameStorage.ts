const PREFIX = 'os_portfolio_gamehub_';

export interface GameScore {
  highScore: number;
  gamesPlayed: number;
  gamesWon: number;
  lastPlayed: string;
}

export function getScore(gameId: string): GameScore {
  try {
    const raw = localStorage.getItem(PREFIX + gameId);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { highScore: 0, gamesPlayed: 0, gamesWon: 0, lastPlayed: '' };
}

export function saveScore(gameId: string, score: Partial<GameScore>) {
  const current = getScore(gameId);
  const updated = { ...current, ...score, lastPlayed: new Date().toISOString() };
  if (score.highScore !== undefined && score.highScore > current.highScore) {
    updated.highScore = score.highScore;
  }
  localStorage.setItem(PREFIX + gameId, JSON.stringify(updated));
}

export function saveChessGame(id: string, state: string) {
  localStorage.setItem(PREFIX + 'chess_' + id, state);
}

export function loadChessGame(id: string): string | null {
  return localStorage.getItem(PREFIX + 'chess_' + id);
}

export function removeChessGame(id: string) {
  localStorage.removeItem(PREFIX + 'chess_' + id);
}