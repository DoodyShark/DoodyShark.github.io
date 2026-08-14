'use client';
import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const FALL_SELECTOR = 'img, h1, h2, h3, h4, p, li, button, a, blockquote, td, th';

type Captured = {
  original: HTMLElement;
  clone: HTMLElement;
  body: Matter.Body;
  width: number;
  height: number;
};

export default function GravityToggle() {
  const [active, setActive] = useState(false);
  const engineRef = useRef<Matter.Engine | null>(null);
  const rafRef = useRef<number | null>(null);
  const capturedRef = useRef<Captured[]>([]);
  const wallsRef = useRef<Matter.Body[]>([]);
  const dragLayerRef = useRef<HTMLDivElement | null>(null);

  const teardown = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    for (const c of capturedRef.current) {
      c.clone.remove();
      c.original.style.visibility = '';
    }
    capturedRef.current = [];
    wallsRef.current = [];
    dragLayerRef.current?.remove();
    dragLayerRef.current = null;
    document.body.style.overflow = '';
  };

  const buildWalls = (engine: Matter.Engine) => {
    if (wallsRef.current.length) Matter.World.remove(engine.world, wallsRef.current);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const thickness = 200;
    const walls = [
      Matter.Bodies.rectangle(w / 2, h + thickness / 2, w * 2, thickness, { isStatic: true }), // floor
      Matter.Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 2, { isStatic: true }), // left
      Matter.Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 2, { isStatic: true }), // right
    ];
    Matter.World.add(engine.world, walls);
    wallsRef.current = walls;
  };

  const enable = () => {
    const main = document.querySelector('main');
    if (!main) return;

    const candidates = Array.from(main.querySelectorAll<HTMLElement>(FALL_SELECTOR));
    const selected = candidates.filter((el) => {
      if (candidates.some((other) => other !== el && other.contains(el))) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 4 && rect.height > 4 && rect.top < window.innerHeight && rect.bottom > 0;
    });
    if (!selected.length) return;

    const engine = Matter.Engine.create();
    engine.gravity.y = 1;
    engine.gravity.scale = 0.01;
    engineRef.current = engine;
    buildWalls(engine);

    const captured: Captured[] = selected.map((el) => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);

      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.margin = '0';
      clone.style.zIndex = '150';
      clone.style.transition = 'none';
      clone.style.pointerEvents = 'none';
      // Carry over a few visual computed styles the clone might otherwise lose outside its original context.
      clone.style.color = cs.color;
      clone.style.fontSize = cs.fontSize;
      clone.style.fontWeight = cs.fontWeight;
      clone.style.background = cs.backgroundColor;
      document.body.appendChild(clone);

      el.style.visibility = 'hidden';

      const body = Matter.Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          restitution: 0.35,
          friction: 0.4,
          frictionAir: 0.012,
          angle: (Math.random() - 0.5) * 0.2,
        }
      );
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      // A little random toss on activation — the page's own elements sit almost flush against
      // each other, so without this everything just wedges in place a few pixels down.
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 14, y: -(6 + Math.random() * 10) });

      return { original: el, clone, body, width: rect.width, height: rect.height };
    });

    Matter.World.add(engine.world, captured.map((c) => c.body));
    capturedRef.current = captured;
    document.body.style.overflow = 'hidden';

    // Transparent capture layer so you can grab and drag any fallen element around —
    // dragging one naturally shoves whatever else is in its way, same as the rest of the sim.
    const dragLayer = document.createElement('div');
    dragLayer.style.position = 'fixed';
    dragLayer.style.inset = '0';
    dragLayer.style.zIndex = '195';
    dragLayer.style.cursor = 'grab';
    document.body.appendChild(dragLayer);
    dragLayerRef.current = dragLayer;

    const mouse = Matter.Mouse.create(dragLayer);
    mouse.pixelRatio = window.devicePixelRatio || 1;
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.15, damping: 0.15, render: { visible: false } },
    });
    Matter.World.add(engine.world, mouseConstraint);
    Matter.Events.on(mouseConstraint, 'startdrag', () => { dragLayer.style.cursor = 'grabbing'; });
    Matter.Events.on(mouseConstraint, 'enddrag', () => { dragLayer.style.cursor = 'grab'; });

    const tick = () => {
      Matter.Engine.update(engine, 1000 / 60);
      for (const c of capturedRef.current) {
        const { position, angle } = c.body;
        c.clone.style.top = `${position.y - c.height / 2}px`;
        c.clone.style.left = `${position.x - c.width / 2}px`;
        c.clone.style.transform = `rotate(${angle}rad)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const onResize = () => {
      if (active && engineRef.current) buildWalls(engineRef.current);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active]);

  // Reset automatically if this component ever unmounts mid-effect.
  useEffect(() => {
    return () => teardown();
  }, []);

  const toggle = () => {
    if (active) {
      teardown();
      setActive(false);
    } else {
      enable();
      setActive(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={active ? 'Reset gravity' : 'Enable gravity — just for fun'}
      data-gravity-ui
      className="fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform"
      style={{
        zIndex: 210,
        background: 'var(--m-surface)',
        border: '1.5px solid var(--m-border)',
        color: 'var(--m-text)',
      }}
    >
      {active ? '↺' : '🪐'}
    </button>
  );
}
