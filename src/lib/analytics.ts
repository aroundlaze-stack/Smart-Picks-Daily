import ReactGA from "react-ga4";
import type { ConsentPreferences } from "./consent";

const GA_MEASUREMENT_ID = "G-QR3PXF2F2F";
const CLARITY_TAG_ID = "xptbci8ccp";

let gaInitialized = false;
let clarityInitialized = false;

// ─── Google Analytics ─────────────────────────────────────────────────────────

export function initializeGoogleAnalytics(): void {
  if (gaInitialized) return;
  gaInitialized = true;
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
}

// ─── Microsoft Clarity ────────────────────────────────────────────────────────

export function initializeMicrosoftClarity(): void {
  if (clarityInitialized) return;
  clarityInitialized = true;

  // Dynamically inject Clarity (removed from index.html to be consent-gated)
  /* eslint-disable */
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_TAG_ID);
  /* eslint-enable */
}

// ─── Orchestrated initialization ─────────────────────────────────────────────

/**
 * Call once when consent preferences are known (on mount or after user choice).
 * Safe to call multiple times — services are guarded by initialized flags.
 */
export function applyAnalyticsConsent(prefs: ConsentPreferences): void {
  if (prefs.googleAnalytics) initializeGoogleAnalytics();
  if (prefs.microsoftClarity) initializeMicrosoftClarity();
  // Vercel Analytics and SpeedInsights are React components — see App.tsx
}
