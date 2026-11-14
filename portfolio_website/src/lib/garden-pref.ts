'use client';
import { useSyncExternalStore } from 'react';

// Visitor preference: show/hide the animated garden doodles.
// Stored per browser; defaults to hidden when the OS asks for reduced motion.
const KEY = 'garden-hidden';
const EVENT = 'garden-pref-change';
let memo: boolean | null = null; // fallback when localStorage is unavailable

function read(): boolean {
  if (memo !== null) return memo;
  try {
    const v = localStorage.getItem(KEY);
    if (v !== null) return v === '1';
  } catch { /* storage blocked */ }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

export function setGardenHidden(hidden: boolean) {
  try { localStorage.setItem(KEY, hidden ? '1' : '0'); } catch { memo = hidden; /* storage blocked */ }
  window.dispatchEvent(new Event(EVENT));
}

export function useGardenHidden(): boolean {
  // Server render: visible (matches the default for most visitors)
  return useSyncExternalStore(subscribe, read, () => false);
}
