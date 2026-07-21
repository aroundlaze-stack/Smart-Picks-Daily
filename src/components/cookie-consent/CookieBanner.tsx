import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'wouter';
import { Shield, Cookie } from 'lucide-react';
import { useConsent } from '../../context/ConsentContext';
import { CustomizePanel } from './CustomizePanel';

export function CookieBanner() {
  const { showBanner, acceptAll, acceptEssential, openCustomize } = useConsent();
  const acceptRef = useRef<HTMLButtonElement>(null);

  // Move focus to primary button when banner appears
  useEffect(() => {
    if (showBanner) {
      const t = setTimeout(() => acceptRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [showBanner]);

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            key="cookie-banner"
            role="dialog"
            aria-modal="false"
            aria-label="Privacy & Performance consent"
            aria-live="polite"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] w-[calc(100vw-2rem)] max-w-2xl"
          >
            {/* Outer glow ring */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(79,140,255,0.18), 0 0 40px rgba(79,140,255,0.14), 0 24px 48px rgba(0,0,0,0.5)',
              }}
            />

            {/* Panel */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(5, 8, 22, 0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(79, 140, 255, 0.22)',
              }}
            >
              {/* Top blue accent line */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(79,140,255,0.7) 40%, rgba(124,58,237,0.5) 70%, transparent)',
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    aria-hidden="true"
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(79,140,255,0.12)',
                      border: '1px solid rgba(79,140,255,0.25)',
                    }}
                  >
                    <Cookie size={18} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground font-display leading-tight">
                      Privacy &amp; Performance
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-lg">
                      Smart Picks Daily uses privacy-friendly analytics to improve product
                      recommendations, understand visitor behavior and enhance your browsing
                      experience. No personal information is sold.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
                  {/* Accept All — primary */}
                  <button
                    ref={acceptRef}
                    type="button"
                    onClick={acceptAll}
                    className="relative flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group overflow-hidden"
                    style={{
                      background: 'hsl(219 100% 65%)',
                      boxShadow: '0 0 20px rgba(79,140,255,0.35)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(79,140,255,0.6)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(79,140,255,0.35)';
                    }}
                  >
                    Accept All
                  </button>

                  {/* Essential Only — secondary */}
                  <button
                    type="button"
                    onClick={acceptEssential}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-medium text-foreground/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:text-foreground hover:border-primary/40"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(79,140,255,0.15)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                    }}
                  >
                    Essential Only
                  </button>

                  {/* Customize — tertiary */}
                  <button
                    type="button"
                    onClick={openCustomize}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:text-primary"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(79,140,255,0.3)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(79,140,255,0.06)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    Customize
                  </button>

                  {/* Privacy Policy — link */}
                  <div className="hidden sm:block flex-1" />
                  <Link
                    href="/privacy"
                    className="text-xs text-muted-foreground/70 hover:text-primary underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-primary/50 transition-colors text-center sm:text-right focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded"
                  >
                    Privacy Policy
                  </Link>
                </div>

                {/* Small shield note */}
                <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
                  <Shield size={10} aria-hidden="true" />
                  Your choice is saved locally and never shared.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customize dialog — rendered outside banner so it persists even when banner is gone */}
      <CustomizePanel />
    </>
  );
}
