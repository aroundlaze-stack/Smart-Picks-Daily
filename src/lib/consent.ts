// ─── Consent Types ──────────────────────────────────────────────────────────

export type ConsentPreferences = {
  googleAnalytics: boolean;
  microsoftClarity: boolean;
  vercelAnalytics: boolean;
  performanceAnalytics: boolean;
};

export type ConsentStatus = 'accepted' | 'essential' | 'custom' | null;

// ─── Storage Keys ────────────────────────────────────────────────────────────

const CONSENT_STATUS_KEY = 'spd_cookie_consent_status';
const CONSENT_PREFS_KEY = 'spd_cookie_consent_prefs';

// ─── Default Preferences ─────────────────────────────────────────────────────

export const ALL_ON_PREFS: ConsentPreferences = {
  googleAnalytics: true,
  microsoftClarity: true,
  vercelAnalytics: true,
  performanceAnalytics: true,
};

export const ALL_OFF_PREFS: ConsentPreferences = {
  googleAnalytics: false,
  microsoftClarity: false,
  vercelAnalytics: false,
  performanceAnalytics: false,
};

// ─── Storage Helpers ─────────────────────────────────────────────────────────

export function getConsentStatus(): ConsentStatus {
  try {
    const val = localStorage.getItem(CONSENT_STATUS_KEY);
    if (val === 'accepted' || val === 'essential' || val === 'custom') return val;
  } catch {
    // localStorage may be unavailable (SSR, private browsing restrictions)
  }
  return null;
}

export function getConsentPreferences(): ConsentPreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentPreferences;
  } catch {
    return null;
  }
}

export function saveConsentStatus(status: ConsentStatus, prefs: ConsentPreferences): void {
  try {
    if (status) localStorage.setItem(CONSENT_STATUS_KEY, status);
    localStorage.setItem(CONSENT_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // silent fail
  }
}

export function clearConsent(): void {
  try {
    localStorage.removeItem(CONSENT_STATUS_KEY);
    localStorage.removeItem(CONSENT_PREFS_KEY);
  } catch {
    // silent fail
  }
}
