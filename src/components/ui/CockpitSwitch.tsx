import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TRANSITION_MS = 380;

/** Applies the theme class to <html>, persists to localStorage, and adds a
 *  short "theme-transitioning" class so CSS can animate the colour change. */
function applyTheme(isDark: boolean) {
  const html = document.documentElement;

  // Kick off smooth transition
  html.classList.add('theme-transitioning');
  setTimeout(() => html.classList.remove('theme-transitioning'), TRANSITION_MS);

  if (isDark) {
    html.classList.remove('light');
  } else {
    html.classList.add('light');
  }
}

/**
 * Aircraft cockpit-style dark/light mode toggle.
 * Shows a metallic flip-switch with an LED indicator above it.
 */
export function CockpitSwitch() {
  const [isDark, setIsDark] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('spd-theme');
    const dark = saved ? saved === 'dark' : true;
    setIsDark(dark);
    // Apply without transition on initial load (no flash)
    if (dark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('spd-theme', next ? 'dark' : 'light');
    applyTheme(next);
  };

  const ledColor   = isDark ? '#60a5fa' : '#fbbf24';
  const ledShadow  = isDark
    ? '0 0 8px 3px rgba(96,165,250,0.85)'
    : '0 0 8px 3px rgba(251,191,36,0.85)';
  const labelColor = isDark ? '#93c5fd' : '#fcd34d';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="select-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
    >
      {/* ── Mounting plate ── */}
      <div
        style={{
          width: 36,
          background: 'linear-gradient(180deg,#52525b 0%,#27272a 100%)',
          border: '1px solid #3f3f46',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.10), 0 4px 12px rgba(0,0,0,0.55)',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '7px 0 5px',
        }}
      >
        {/* LED */}
        <div
          style={{
            width: 10,
            height: 6,
            borderRadius: 9999,
            background: ledColor,
            boxShadow: ledShadow,
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        />

        {/* Switch housing */}
        <div
          style={{
            width: 22,
            height: 34,
            background: 'linear-gradient(180deg,#18181b 0%,#09090b 100%)',
            borderRadius: 4,
            border: '1px solid #3f3f46',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.65)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Lever */}
          <motion.div
            animate={{ y: isDark ? 8 : -8 }}
            transition={{ type: 'spring', stiffness: 520, damping: 28 }}
            style={{
              position: 'absolute',
              width: 16,
              height: 18,
              borderRadius: 3,
              background:
                'linear-gradient(135deg,#e4e4e7 0%,#a1a1aa 55%,#71717a 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow:
                '0 2px 5px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.22)',
            }}
          />
        </div>

        {/* Mode micro-label */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 5.5,
            fontWeight: 700,
            letterSpacing: '0.07em',
            color: labelColor,
            transition: 'color 0.3s',
          }}
        >
          {isDark ? 'DARK' : 'LITE'}
        </div>
      </div>
    </button>
  );
}
