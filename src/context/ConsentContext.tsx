import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ALL_OFF_PREFS,
  ALL_ON_PREFS,
  ConsentPreferences,
  ConsentStatus,
  getConsentPreferences,
  getConsentStatus,
  saveConsentStatus,
} from '../lib/consent';

// ─── Context Shape ────────────────────────────────────────────────────────────

interface ConsentContextValue {
  /** Whether the initial consent banner is visible */
  showBanner: boolean;
  /** Whether the customize panel is visible */
  showCustomize: boolean;
  /** Whether consent has been given at least once */
  hasConsented: boolean;
  /** Current per-service preferences */
  preferences: ConsentPreferences;
  /** Accept all analytics */
  acceptAll: () => void;
  /** Accept essential only (all analytics off) */
  acceptEssential: () => void;
  /** Save custom preferences */
  saveCustom: (prefs: ConsentPreferences) => void;
  /** Open the customize panel */
  openCustomize: () => void;
  /** Close the customize panel */
  closeCustomize: () => void;
  /** Re-open the full consent flow (from footer link) */
  openPreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(ALL_OFF_PREFS);

  // On mount: decide whether to show the banner
  useEffect(() => {
    const status = getConsentStatus();
    if (status) {
      // User already chose — restore saved preferences
      const saved = getConsentPreferences();
      if (saved) setPreferences(saved);
      setHasConsented(true);
    } else {
      // First visit — show banner after a short delay so the page renders first
      const t = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const commit = useCallback((status: ConsentStatus, prefs: ConsentPreferences) => {
    saveConsentStatus(status, prefs);
    setPreferences(prefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowCustomize(false);
  }, []);

  const acceptAll = useCallback(() => {
    commit('accepted', ALL_ON_PREFS);
  }, [commit]);

  const acceptEssential = useCallback(() => {
    commit('essential', ALL_OFF_PREFS);
  }, [commit]);

  const saveCustom = useCallback(
    (prefs: ConsentPreferences) => {
      commit('custom', prefs);
    },
    [commit],
  );

  const openCustomize = useCallback(() => setShowCustomize(true), []);
  const closeCustomize = useCallback(() => setShowCustomize(false), []);

  const openPreferences = useCallback(() => {
    setShowBanner(true);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        showBanner,
        showCustomize,
        hasConsented,
        preferences,
        acceptAll,
        acceptEssential,
        saveCustom,
        openCustomize,
        closeCustomize,
        openPreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>');
  return ctx;
}
