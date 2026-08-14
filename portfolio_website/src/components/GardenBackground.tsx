'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Point { x: number; y: number }
interface Stroke { points: Point[]; color: string; width: number }
interface Drawing { _id: string; strokes: Stroke[] }

interface ActiveDrawing {
  drawing: Drawing;
  cx: number;
  cy: number;
  scale: number;
  opacity: number;
  layer: 'back' | 'front';
  phase: 'drawing' | 'holding' | 'erasing';
  progress: number; // 0→1 within the current phase
}

const DRAW_MS   = 2200;
const HOLD_MS   = 2800;
const ERASE_MS  = 2000;
const MAX_BACK  = 10;
const MAX_FRONT = 4;
const SPAWN_MS  = 550;
const SCALE_MIN = 65;
const SCALE_MAX = 155;
const FRONT_CHANCE = 0.25; // 25% of spawns go to the front layer

export default function GardenBackground() {
  const pathname = usePathname();
  const backRef  = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    drawings:    [] as Drawing[],
    active:      [] as ActiveDrawing[],
    lastTime:    0,
    spawnTimer:  SPAWN_MS, // first spawn immediately
    raf:         0,
  });

  // Determine which API(s) to draw from based on the current section
  useEffect(() => {
    const isPersonal = pathname.includes('/personal');
    const isCareer   = pathname.includes('/career');
    const urls: string[] = isPersonal ? ['/api/flowers']
                         : isCareer   ? ['/api/drawings']
                         :              ['/api/flowers', '/api/drawings'];

    Promise.all(urls.map(u => fetch(u).then(r => r.json()).catch(() => [])))
      .then(results => { stateRef.current.drawings = results.flat(); })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const back  = backRef.current;
    const front = frontRef.current;
    if (!back || !front) return;

    // ── Sizing ────────────────────────────────────────────────
    const sizeBack = () => {
      back.width  = back.offsetWidth  || window.innerWidth;
      back.height = back.offsetHeight || window.innerHeight;
    };
    const sizeFront = () => {
      front.width  = window.innerWidth;
      front.height = window.innerHeight;
    };

    sizeBack();
    sizeFront();

    const ro = new ResizeObserver(sizeBack);
    ro.observe(back);
    window.addEventListener('resize', sizeFront);

    const s = stateRef.current;

    // ── Spawn ─────────────────────────────────────────────────
    const spawn = (layer: 'back' | 'front') => {
      if (!s.drawings.length) return;
      const drawing = s.drawings[Math.floor(Math.random() * s.drawings.length)];
      const canvas  = layer === 'back' ? back : front;
      const scale   = SCALE_MIN + Math.random() * (SCALE_MAX - SCALE_MIN);
      const margin  = scale * 0.55;
      const cx = margin + Math.random() * Math.max(1, canvas.width  - margin * 2);
      const cy = margin + Math.random() * Math.max(1, canvas.height - margin * 2);
      s.active.push({
        drawing, cx, cy, scale, layer,
        opacity:  0.55 + Math.random() * 0.35,
        phase:    'drawing',
        progress: 0,
      });
    };

    // ── Draw one active item onto its canvas ──────────────────
    const renderDrawing = (ctx: CanvasRenderingContext2D, ad: ActiveDrawing) => {
      const { drawing, cx, cy, scale, opacity, phase, progress } = ad;
      const strokes = drawing.strokes;

      let totalSegs = 0;
      for (const st of strokes) totalSegs += Math.max(0, st.points.length - 1);
      if (totalSegs === 0) return;

      // drawing: 0→totalSegs   holding: totalSegs   erasing: totalSegs→0
      const targetSegs =
        phase === 'drawing' ? progress * totalSegs
        : phase === 'holding' ? totalSegs
        : (1 - progress) * totalSegs;   // reverse draw

      ctx.save();
      ctx.globalAlpha = opacity;

      let drawn = 0;
      for (const st of strokes) {
        if (drawn >= targetSegs) break;
        if (st.points.length < 2) continue;

        ctx.beginPath();
        ctx.strokeStyle = st.color;
        ctx.lineWidth   = Math.max(0.5, st.width * (scale / 400));
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        const p0 = st.points[0];
        ctx.moveTo(cx + (p0.x - 0.5) * scale, cy + (p0.y - 0.5) * scale);

        for (let i = 1; i < st.points.length; i++) {
          const rem  = targetSegs - drawn;
          const p    = st.points[i];
          const prev = st.points[i - 1];

          if (rem >= 1) {
            ctx.lineTo(cx + (p.x - 0.5) * scale, cy + (p.y - 0.5) * scale);
            drawn++;
          } else {
            const px = cx + (prev.x + (p.x - prev.x) * rem - 0.5) * scale;
            const py = cy + (prev.y + (p.y - prev.y) * rem - 0.5) * scale;
            ctx.lineTo(px, py);
            drawn++;
            break;
          }
          if (drawn >= targetSegs) break;
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    // ── Animation loop ────────────────────────────────────────
    const tick = (now: number) => {
      const dt = s.lastTime ? Math.min(now - s.lastTime, 100) : 16;
      s.lastTime = now;

      const backCtx  = back.getContext('2d');
      const frontCtx = front.getContext('2d');
      if (!backCtx || !frontCtx) { s.raf = requestAnimationFrame(tick); return; }

      backCtx.clearRect(0,  0, back.width,  back.height);
      frontCtx.clearRect(0, 0, front.width, front.height);

      // Spawn
      if (s.drawings.length > 0) {
        s.spawnTimer += dt;
        if (s.spawnTimer >= SPAWN_MS) {
          s.spawnTimer = 0;
          const backCount  = s.active.filter(a => a.layer === 'back').length;
          const frontCount = s.active.filter(a => a.layer === 'front').length;
          const goFront = Math.random() < FRONT_CHANCE && frontCount < MAX_FRONT;
          if (goFront) spawn('front');
          else if (backCount < MAX_BACK) spawn('back');
        }
      }

      // Update + render
      s.active = s.active.filter(ad => {
        if (ad.phase === 'drawing') {
          ad.progress += dt / DRAW_MS;
          if (ad.progress >= 1) { ad.progress = 0; ad.phase = 'holding'; }
        } else if (ad.phase === 'holding') {
          ad.progress += dt / HOLD_MS;
          if (ad.progress >= 1) { ad.progress = 0; ad.phase = 'erasing'; }
        } else {
          ad.progress += dt / ERASE_MS;
          if (ad.progress >= 1) return false;
        }
        const ctx = ad.layer === 'back' ? backCtx : frontCtx;
        renderDrawing(ctx, ad);
        return true;
      });

      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      window.removeEventListener('resize', sizeFront);
    };
  }, []);

  return (
    <>
      {/* Back layer — inside the layout flow, behind section content */}
      <canvas
        ref={backRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Front layer — fixed above all content */}
      <canvas
        ref={frontRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 30 }}
      />
    </>
  );
}
