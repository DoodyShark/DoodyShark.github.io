'use client';
import { useEffect, useRef } from 'react';

// Pentatonic-ish spread so any chime striking sounds pleasant next to any other.
const NOTES = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5 D5 E5 G5 A5
const CHIME_COUNT = NOTES.length;
const STRING_LENGTH = 70;
const STRIKE_THRESHOLD = 1.4; // rad/s, angular speed that counts as a "strike"

type Chime = {
  angle: number;
  angVel: number;
  phase: number;
  period: number;
  armed: boolean;
  x: number; // pivot x in viewport px
};

export default function WindChimes() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chimeElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chimesRef = useRef<Chime[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999 });
  const audioCtxRef = useRef<AudioContext | null>(null);

  const ensureAudio = () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    audioCtxRef.current = ctx;
    return ctx;
  };

  const playChime = (freq: number, velocity: number) => {
    const ctx = ensureAudio();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const peak = Math.min(0.22, 0.06 + velocity * 0.05);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    gain.connect(ctx.destination);

    [1, 2.4, 4.1].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * mult;
      const partialGain = ctx.createGain();
      partialGain.gain.value = i === 0 ? 1 : 0.28 / mult;
      osc.connect(partialGain);
      partialGain.connect(gain);
      osc.start(now);
      osc.stop(now + 1.7);
    });
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spacing = Math.min(90, window.innerWidth / (CHIME_COUNT + 1));
    const startX = window.innerWidth - spacing * CHIME_COUNT - 24;
    chimesRef.current = NOTES.map((_, i) => ({
      angle: (Math.random() - 0.5) * 0.15,
      angVel: 0,
      phase: Math.random() * Math.PI * 2,
      period: 4 + Math.random() * 3,
      armed: true,
      x: startX + spacing * i + spacing / 2,
    }));

    const onMouseMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.vx = e.clientX - m.lastX;
      m.vy = e.clientY - m.lastY;
      m.lastX = e.clientX;
      m.lastY = e.clientY;
      m.x = e.clientX;
      m.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Unlock audio on the first real user gesture (autoplay policy).
    const onFirstPointer = () => {
      ensureAudio();
      window.removeEventListener('pointerdown', onFirstPointer);
    };
    window.addEventListener('pointerdown', onFirstPointer);

    let raf = 0;
    let last = performance.now();
    const g = 9.8;
    const damping = 0.985;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      chimesRef.current.forEach((chime, i) => {
        // Ambient wind: gentle low-frequency sway, unless reduced motion is requested.
        const wind = reduceMotion ? 0 : Math.sin(t / chime.period + chime.phase) * 0.35;

        // Cursor influence: push proportional to horizontal cursor speed near this chime.
        const pivotY = 84;
        const bobY = pivotY + STRING_LENGTH * Math.cos(chime.angle);
        const bobX = chime.x + STRING_LENGTH * Math.sin(chime.angle);
        const dx = mouseRef.current.x - bobX;
        const dy = mouseRef.current.y - bobY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let cursorForce = 0;
        if (dist < 60) {
          const proximity = 1 - dist / 60;
          cursorForce = -mouseRef.current.vx * 0.006 * proximity;
        }

        const angAccel = -(g / STRING_LENGTH) * Math.sin(chime.angle) + wind * 0.4 + cursorForce;
        chime.angVel = (chime.angVel + angAccel * dt) * damping;
        chime.angle += chime.angVel * dt;

        const speed = Math.abs(chime.angVel);
        if (chime.armed && speed > STRIKE_THRESHOLD) {
          playChime(NOTES[i], Math.min(2, speed));
          chime.armed = false;
        } else if (!chime.armed && speed < STRIKE_THRESHOLD * 0.5) {
          chime.armed = true;
        }

        const el = chimeElsRef.current[i];
        if (el) el.style.transform = `rotate(${(chime.angle * 180) / Math.PI}deg)`;
      });

      mouseRef.current.vx *= 0.7;
      mouseRef.current.vy *= 0.7;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('pointerdown', onFirstPointer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-gravity-ui
      className="fixed top-0 right-0 hidden sm:block"
      style={{ zIndex: 190, pointerEvents: 'none', width: '480px', height: '180px' }}
      aria-hidden
    >
      {NOTES.map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: '84px',
            right: `${24 + (CHIME_COUNT - 1 - i) * Math.min(90, 480 / (CHIME_COUNT + 1))}px`,
            transformOrigin: 'top center',
          }}
          ref={(el) => {
            chimeElsRef.current[i] = el;
          }}
        >
          <div style={{ width: '1px', height: `${STRING_LENGTH}px`, background: 'var(--m-border)', margin: '0 auto' }} />
          <div
            style={{
              width: '18px',
              height: '22px',
              margin: '0 auto',
              borderRadius: '9px 9px 3px 3px',
              background: 'var(--m-teal)',
              opacity: 0.85,
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
