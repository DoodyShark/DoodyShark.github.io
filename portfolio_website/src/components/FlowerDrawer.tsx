'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { spawnConfetti, type ConfettiPiece } from '@/lib/confetti';

interface Point  { x: number; y: number }
interface Stroke { points: Point[]; color: string; width: number }

// Bright varied palette for drawing
const PRESET_COLORS = [
  '#f472b6', // hot pink
  '#fb7185', // rose
  '#c084fc', // violet
  '#818cf8', // indigo
  '#38bdf8', // sky
  '#34d399', // emerald
  '#facc15', // yellow
  '#fb923c', // orange
  '#f87171', // red
  '#a3e635', // lime
  '#22d3ee', // cyan
  '#f9fafb', // near-white
  '#1e1b4b', // deep indigo
];

const WIDTHS = [2, 4, 7];

// ── Replay component shown after successful submit ────────────────
function DrawingReplay({
  strokes,
  onDone,
}: {
  strokes: Stroke[];
  onDone: () => void;
}) {
  const replayRef = useRef<HTMLCanvasElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!showSuccess) return;
    const pieces = spawnConfetti(28);
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 1600);
  }, [showSuccess]);

  useEffect(() => {
    const canvas = replayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let totalSegs = 0;
    for (const st of strokes) totalSegs += Math.max(0, st.points.length - 1);

    let progress = 0;
    let lastTime = 0;
    let raf = 0;
    const DURATION = 2000;

    const tick = (now: number) => {
      const dt = lastTime ? Math.min(now - lastTime, 100) : 16;
      lastTime = now;
      progress = Math.min(1, progress + dt / DURATION);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const target = progress * totalSegs;
      let drawn = 0;

      for (const st of strokes) {
        if (drawn >= target) break;
        if (st.points.length < 2) continue;
        ctx.beginPath();
        ctx.strokeStyle = st.color;
        ctx.lineWidth   = st.width;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.moveTo(st.points[0].x * canvas.width, st.points[0].y * canvas.height);
        for (let i = 1; i < st.points.length; i++) {
          const rem  = target - drawn;
          const p    = st.points[i];
          const prev = st.points[i - 1];
          if (rem >= 1) {
            ctx.lineTo(p.x * canvas.width, p.y * canvas.height);
            drawn++;
          } else {
            ctx.lineTo(
              (prev.x + (p.x - prev.x) * rem) * canvas.width,
              (prev.y + (p.y - prev.y) * rem) * canvas.height,
            );
            drawn++;
            break;
          }
          if (drawn >= target) break;
        }
        ctx.stroke();
      }

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShowSuccess(true), 350);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [strokes]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <canvas
          ref={replayRef}
          width={400}
          height={400}
          className="rounded-2xl"
          style={{
            maxWidth: '100%',
            aspectRatio: '1 / 1',
            background: 'var(--m-surface)',
            border: '1px solid var(--m-border)',
          }}
        />
        {/* Confetti burst when replay finishes */}
        {confetti.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-visible rounded-2xl">
            {confetti.map(p => (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: '50%',
                  width: p.size,
                  height: p.round ? p.size : p.size * 0.55,
                  borderRadius: p.round ? '50%' : '2px',
                  background: p.color,
                  '--cdx': p.cdx,
                  '--cdy': p.cdy,
                  '--crot': p.crot,
                  animation: `confetti-fly ${p.duration}s ease-out forwards`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>
      {showSuccess && (
        <div className="text-center space-y-3">
          <p className="text-base font-medium" style={{ color: 'var(--m-text)' }}>
            Your drawing has been added to the garden!
          </p>
          <button
            onClick={onDone}
            className="px-5 py-2 rounded-lg text-sm transition-colors"
            style={{ border: '1px solid var(--m-border)', color: 'var(--m-text2)' }}
          >
            Draw another
          </button>
        </div>
      )}
    </div>
  );
}

interface Props {
  apiEndpoint?: string;
}

export default function FlowerDrawer({ apiEndpoint = '/api/flowers' }: Props) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const isDrawingRef  = useRef(false);
  const strokesRef    = useRef<Stroke[]>([]);
  const currentPtsRef = useRef<Point[]>([]);
  const colorRef      = useRef(PRESET_COLORS[0]);
  const widthRef      = useRef(WIDTHS[1]);

  const [color,            setColor]           = useState(PRESET_COLORS[0]);
  const [width,            setWidth]           = useState(WIDTHS[1]);
  const [hasStrokes,       setHasStrokes]      = useState(false);
  const [planted,          setPlanted]         = useState(false);
  const [planting,         setPlanting]        = useState(false);
  const [submittedStrokes, setSubmittedStrokes] = useState<Stroke[]>([]);

  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { widthRef.current = width; }, [width]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawPts = (pts: Point[], c: string, w: number) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = c;
      ctx.lineWidth   = w;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.moveTo(pts[0].x * canvas.width, pts[0].y * canvas.height);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x * canvas.width, pts[i].y * canvas.height);
      }
      ctx.stroke();
    };

    for (const s of strokesRef.current) drawPts(s.points, s.color, s.width);
    if (currentPtsRef.current.length) {
      drawPts(currentPtsRef.current, colorRef.current, widthRef.current);
    }
  }, []);

  // Re-attach pointer events whenever the canvas mounts/remounts (incl. after "planted" resets)
  useEffect(() => {
    if (planted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top)  / rect.height,
      };
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      isDrawingRef.current  = true;
      currentPtsRef.current = [getPos(e)];
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      currentPtsRef.current = [...currentPtsRef.current, getPos(e)];
      redraw();
    };
    const onUp = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      const pts = currentPtsRef.current;
      if (pts.length >= 2) {
        strokesRef.current = [
          ...strokesRef.current,
          { points: pts, color: colorRef.current, width: widthRef.current },
        ];
        setHasStrokes(true);
      }
      currentPtsRef.current = [];
      redraw();
    };

    canvas.addEventListener('pointerdown',  onDown);
    canvas.addEventListener('pointermove',  onMove);
    canvas.addEventListener('pointerup',    onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      canvas.removeEventListener('pointerdown',   onDown);
      canvas.removeEventListener('pointermove',   onMove);
      canvas.removeEventListener('pointerup',     onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [redraw, planted]); // re-run when planted resets so canvas re-attaches

  const handleClear = () => {
    strokesRef.current    = [];
    currentPtsRef.current = [];
    setHasStrokes(false);
    redraw();
  };

  const handlePlant = async () => {
    if (!strokesRef.current.length || planting) return;
    setPlanting(true);
    try {
      const saved = [...strokesRef.current];
      await fetch(apiEndpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ strokes: saved }),
      });
      setSubmittedStrokes(saved);
      setPlanted(true);
    } catch {
      // silently fail
    } finally {
      setPlanting(false);
    }
  };

  const handleDrawAnother = () => {
    setPlanted(false);
    // clear after state update so redraw fires on the newly mounted canvas
    setTimeout(() => {
      strokesRef.current    = [];
      currentPtsRef.current = [];
      setHasStrokes(false);
      redraw();
    }, 0);
  };

  if (planted) {
    return <DrawingReplay strokes={submittedStrokes} onDone={handleDrawAnother} />;
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="rounded-2xl cursor-crosshair touch-none"
        style={{
          maxWidth: '100%',
          aspectRatio: '1 / 1',
          background: 'var(--m-surface)',
          border: '1px solid var(--m-border)',
        }}
      />

      {/* Preset colour swatches */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            title={c}
            className="w-7 h-7 rounded-full transition-all"
            style={{
              backgroundColor: c,
              border: color === c ? '2px solid var(--m-text)' : '2px solid var(--m-border)',
              transform: color === c ? 'scale(1.25)' : 'scale(1)',
              boxShadow: color === c ? '0 2px 6px rgba(0,0,0,0.25)' : 'none',
            }}
          />
        ))}

        {/* Color wheel */}
        <label
          className="w-7 h-7 rounded-full overflow-hidden cursor-pointer transition-all"
          title="Custom colour"
          style={{
            background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
            border: '2px solid var(--m-border)',
            transform: !PRESET_COLORS.includes(color) ? 'scale(1.25)' : 'scale(1)',
          }}
        >
          <input
            type="color"
            className="opacity-0 w-0 h-0"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
        </label>
      </div>

      {/* Stroke width */}
      <div className="flex gap-3 items-center">
        {WIDTHS.map(w => (
          <button
            key={w}
            onClick={() => setWidth(w)}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all"
            style={{
              border: width === w ? '2px solid var(--m-text)' : '2px solid var(--m-border)',
              background: width === w ? 'var(--m-surface)' : 'transparent',
            }}
          >
            <div
              className="rounded-full"
              style={{
                width:  w * 2.5,
                height: w * 2.5,
                background: 'var(--m-text)',
              }}
            />
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg text-sm transition-colors"
          style={{ border: '1px solid var(--m-border)', color: 'var(--m-text2)', background: 'transparent' }}
        >
          Clear
        </button>
        <button
          onClick={handlePlant}
          disabled={!hasStrokes || planting}
          className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--m-text)', color: 'var(--m-bg)' }}
        >
          {planting ? 'Saving…' : 'Plant 🌸'}
        </button>
      </div>
    </div>
  );
}
