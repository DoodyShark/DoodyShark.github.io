export interface ConfettiPiece {
  id: number;
  x: number;
  size: number;
  color: string;
  cdx: string;
  cdy: string;
  crot: string;
  duration: number;
  round: boolean;
}

const COLORS = [
  '#f472b6', '#fb923c', '#facc15', '#4ade80',
  '#38bdf8', '#a78bfa', '#fb7185', '#34d399',
];

let _pid = 0;

export function spawnConfetti(count = 22): ConfettiPiece[] {
  return Array.from({ length: count }, () => ({
    id: _pid++,
    x: 10 + Math.random() * 80,
    size: 6 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    cdx: `${(Math.random() - 0.5) * 220}px`,
    cdy: `${-(60 + Math.random() * 160)}px`,
    crot: `${(Math.random() - 0.5) * 720}deg`,
    duration: 0.7 + Math.random() * 0.55,
    round: Math.random() > 0.45,
  }));
}
