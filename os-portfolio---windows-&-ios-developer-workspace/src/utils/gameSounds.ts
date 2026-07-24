let audioCtx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  if (!enabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export const gameSounds = {
  setEnabled(v: boolean) { enabled = v; },
  getEnabled() { return enabled; },
  click() { playTone(600, 0.08, 'sine', 0.15); },
  select() { playTone(800, 0.1, 'sine', 0.2); },
  move() { playTone(500, 0.12, 'triangle', 0.15); },
  capture() { playTone(300, 0.15, 'sawtooth', 0.12); },
  check() { playTone(880, 0.2, 'square', 0.1); },
  win() { playTone(523, 0.15, 'sine', 0.2); setTimeout(() => { playTone(659, 0.15, 'sine', 0.2); }, 150); setTimeout(() => { playTone(784, 0.25, 'sine', 0.2); }, 300); },
  lose() { playTone(400, 0.2, 'sawtooth', 0.15); setTimeout(() => { playTone(300, 0.3, 'sawtooth', 0.15); }, 200); },
  draw() { playTone(440, 0.2, 'triangle', 0.15); setTimeout(() => { playTone(440, 0.2, 'triangle', 0.15); }, 250); },
  tick() { playTone(1000, 0.03, 'sine', 0.08); },
  ding() { playTone(1200, 0.12, 'sine', 0.2); },
  flip() { playTone(700, 0.06, 'triangle', 0.1); },
  eat() { playTone(200, 0.1, 'sawtooth', 0.1); },
  match() { playTone(660, 0.1, 'sine', 0.2); setTimeout(() => { playTone(880, 0.15, 'sine', 0.2); }, 100); },
};