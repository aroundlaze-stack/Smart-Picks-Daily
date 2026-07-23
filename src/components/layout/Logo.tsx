import { Link } from 'wouter';

/**
 * SPD Triad Mark — three outer nodes connected to a glowing centre hub.
 * Represents precision, intelligence, and connected selection.
 * Works on both dark and light backgrounds; no hardcoded theme colours.
 */
export function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group z-50" aria-label="Smart Picks Daily — Home">
      {/* ── SPD Triad icon mark ── */}
      <div className="relative flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 44 44"
          fill="none"
          className="w-9 h-9 group-hover:scale-105 transition-transform duration-300"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="spd-hub" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="spd-line-a" x1="22" y1="9" x2="22" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="spd-line-b" x1="12" y1="31" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="spd-line-c" x1="32" y1="31" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
            </linearGradient>
            <filter id="spd-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer triangle frame — very subtle */}
          <polygon
            points="22,5 10,36 34,36"
            fill="none"
            stroke="url(#spd-hub)"
            strokeWidth="0.7"
            strokeLinejoin="round"
            opacity="0.22"
          />

          {/* Connection lines: outer nodes → centre hub */}
          {/* Top → Centre */}
          <line x1="22" y1="11.5" x2="22" y2="19.5" stroke="url(#spd-line-a)" strokeWidth="1.5" strokeLinecap="round" />
          {/* BL → Centre */}
          <line x1="13" y1="31.5" x2="19.5" y2="24" stroke="url(#spd-line-b)" strokeWidth="1.5" strokeLinecap="round" />
          {/* BR → Centre */}
          <line x1="31" y1="31.5" x2="24.5" y2="24" stroke="url(#spd-line-c)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Outer nodes */}
          {/* Top: electric blue */}
          <circle cx="22" cy="8" r="4" fill="#3B82F6" />
          <circle cx="22" cy="8" r="2" fill="white" opacity="0.55" />
          {/* Bottom-left: nebula purple */}
          <circle cx="11" cy="33" r="3.4" fill="#7C3AED" />
          <circle cx="11" cy="33" r="1.6" fill="white" opacity="0.50" />
          {/* Bottom-right: stellar cyan */}
          <circle cx="33" cy="33" r="3.4" fill="#06B6D4" />
          <circle cx="33" cy="33" r="1.6" fill="white" opacity="0.50" />

          {/* Centre hub: gradient glow */}
          <circle cx="22" cy="22" r="5" fill="url(#spd-hub)" filter="url(#spd-glow)" opacity="0.9" />
          {/* Centre inner highlight */}
          <circle cx="22" cy="22" r="2.2" fill="white" opacity="0.90" />
        </svg>
      </div>

      {showText && (
        <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
          Smart Picks <span className="text-primary">Daily</span>
        </span>
      )}
    </Link>
  );
}
