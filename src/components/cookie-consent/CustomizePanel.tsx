import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Shield, BarChart2, Eye, Zap, ChevronRight } from 'lucide-react';
import { ConsentPreferences } from '../../lib/consent';
import { useConsent } from '../../context/ConsentContext';

// ─── Toggle Switch ────────────────────────────────────────────────────────────

interface ToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

function Toggle({ id, checked, disabled, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        disabled
          ? 'opacity-40 cursor-not-allowed bg-white/10'
          : checked
          ? 'bg-primary shadow-[0_0_12px_rgba(79,140,255,0.6)]'
          : 'bg-white/15 hover:bg-white/20',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300',
          checked ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  );
}

// ─── Analytics Service Row ────────────────────────────────────────────────────

interface ServiceRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}

function ServiceRow({ icon, title, description, id, checked, disabled, onChange }: ServiceRowProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/20 transition-all duration-200 group">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className={`block text-sm font-semibold mb-0.5 ${disabled ? 'text-muted-foreground' : 'text-foreground cursor-pointer'}`}
        >
          {title}
        </label>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        {disabled && (
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-primary/60 font-medium">
            <Shield size={10} aria-hidden="true" /> Always active
          </span>
        )}
      </div>
      <div className="flex-shrink-0 mt-0.5">
        <Toggle
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          label={`Toggle ${title}`}
        />
      </div>
    </div>
  );
}

// ─── Customize Panel ─────────────────────────────────────────────────────────

export function CustomizePanel() {
  const { showCustomize, closeCustomize, saveCustom, preferences } = useConsent();

  const [draft, setDraft] = useState<ConsentPreferences>(preferences);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Sync draft when panel opens
  useEffect(() => {
    if (showCustomize) setDraft(preferences);
  }, [showCustomize, preferences]);

  // ESC to close
  useEffect(() => {
    if (!showCustomize) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCustomize();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showCustomize, closeCustomize]);

  // Focus trap
  useEffect(() => {
    if (!showCustomize || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus the close button on open
    closeRef.current?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showCustomize]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (showCustomize) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showCustomize]);

  const toggle = useCallback(
    (key: keyof ConsentPreferences) => (val: boolean) => {
      setDraft(prev => ({ ...prev, [key]: val }));
    },
    [],
  );

  const handleSave = () => saveCustom(draft);

  return (
    <AnimatePresence>
      {showCustomize && (
        <>
          {/* Backdrop */}
          <motion.div
            key="customize-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            onClick={closeCustomize}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="customize-panel"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
            aria-modal="true"
            role="dialog"
            aria-label="Customize cookie preferences"
          >
            <div
              ref={panelRef}
              className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/25 bg-[rgba(5,8,22,0.93)] shadow-[0_0_60px_rgba(79,140,255,0.18),0_0_0_1px_rgba(79,140,255,0.08)] backdrop-blur-2xl"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(79,140,255,0.3) transparent' }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[rgba(5,8,22,0.95)] backdrop-blur-xl rounded-t-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                    <Shield size={16} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground font-display">Cookie Preferences</h2>
                    <p className="text-[10px] text-muted-foreground">Choose what you allow</p>
                  </div>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeCustomize}
                  aria-label="Close preferences panel"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                  Essential cookies are always active as they're required for the site to function. You can toggle the optional analytics services below.
                </p>

                {/* Essential — always on */}
                <ServiceRow
                  id="pref-essential"
                  icon={<Shield size={16} aria-hidden="true" />}
                  title="Essential Cookies"
                  description="Required for core site functionality, navigation, and security. Cannot be disabled."
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />

                <ServiceRow
                  id="pref-ga"
                  icon={<BarChart2 size={16} aria-hidden="true" />}
                  title="Google Analytics"
                  description="Helps us understand which pages and products visitors find most useful. Data is anonymized."
                  checked={draft.googleAnalytics}
                  onChange={toggle('googleAnalytics')}
                />

                <ServiceRow
                  id="pref-clarity"
                  icon={<Eye size={16} aria-hidden="true" />}
                  title="Microsoft Clarity"
                  description="Session heatmaps and scroll analysis to improve page layouts. No personal data is stored."
                  checked={draft.microsoftClarity}
                  onChange={toggle('microsoftClarity')}
                />

                <ServiceRow
                  id="pref-vercel"
                  icon={<ChevronRight size={16} aria-hidden="true" />}
                  title="Vercel Analytics"
                  description="Privacy-first visitor analytics. Aggregated, never tied to an individual."
                  checked={draft.vercelAnalytics}
                  onChange={toggle('vercelAnalytics')}
                />

                <ServiceRow
                  id="pref-perf"
                  icon={<Zap size={16} aria-hidden="true" />}
                  title="Performance Analytics"
                  description="Core Web Vitals and load-time data via Vercel Speed Insights to keep the site fast."
                  checked={draft.performanceAnalytics}
                  onChange={toggle('performanceAnalytics')}
                />
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 px-6 py-4 border-t border-white/[0.07] bg-[rgba(5,8,22,0.95)] backdrop-blur-xl rounded-b-2xl flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={closeCustomize}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(79,140,255,0.4)] hover:shadow-[0_0_28px_rgba(79,140,255,0.6)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
