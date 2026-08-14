'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function HoverAdminTrigger() {
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onStripEnter = () => {
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setVisible(true), 2500);
  };

  const onStripLeave = () => {
    clearTimeout(showTimer.current);
    // start hiding after a delay so user can move to the button
    hideTimer.current = setTimeout(() => setVisible(false), 3500);
  };

  const onButtonEnter = () => {
    // cancel the hide timer while mouse is on the button
    clearTimeout(hideTimer.current);
  };

  const onButtonLeave = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 1500);
  };

  return (
    <>
      {/* Invisible hover strip — left edge, full height */}
      <div
        className="fixed left-0 top-0 bottom-0 w-5 z-[220] cursor-default"
        onMouseEnter={onStripEnter}
        onMouseLeave={onStripLeave}
      />

      {/* Admin pill — slides in from left */}
      <div
        className="fixed left-4 top-1/2 -translate-y-1/2 z-[220] transition-all duration-300"
        style={{ transform: `translateY(-50%) translateX(${visible ? '0' : 'calc(-100% - 1rem)'})`, opacity: visible ? 1 : 0 }}
        onMouseEnter={onButtonEnter}
        onMouseLeave={onButtonLeave}
      >
        <Link
          href="/admin"
          className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-r-xl text-xs font-medium shadow-xl whitespace-nowrap"
          style={{
            background: 'var(--m-bg2)',
            border: '1px solid var(--m-border)',
            borderLeft: 'none',
            color: 'var(--m-text2)',
          }}
        >
          🔒 Admin
        </Link>
      </div>
    </>
  );
}
