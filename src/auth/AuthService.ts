// ─── Auth Service ─────────────────────────────────────────────────────────────
// Pure service layer — no React, no hooks, no JSX.
// Replace the body of each method to point at Firebase, Supabase, Clerk,
// Auth0, or any other provider without touching the UI layer.

import { SessionManager } from './SessionManager';
import type { AuthResult, LoginCredentials, Session, SignUpCredentials } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  return null;
}

export const AuthService = {
  // ── Sign up ──────────────────────────────────────────────────────────────
  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    await new Promise(r => setTimeout(r, 700)); // simulate network latency

    const emailErr = validateEmail(credentials.email);
    if (emailErr) return { success: false, error: emailErr };

    const pwErr = validatePassword(credentials.password);
    if (pwErr) return { success: false, error: pwErr };

    if (!credentials.displayName.trim()) {
      return { success: false, error: 'Display name is required.' };
    }

    try {
      const stored = SessionManager.createUser(
        credentials.email,
        credentials.password,
        credentials.displayName,
      );
      const session = SessionManager.createSession(stored, false);
      return { success: true, user: session.user };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Sign up failed.' };
    }
  },

  // ── Login ────────────────────────────────────────────────────────────────
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await new Promise(r => setTimeout(r, 600)); // simulate network latency

    const emailErr = validateEmail(credentials.email);
    if (emailErr) return { success: false, error: emailErr };
    if (!credentials.password) return { success: false, error: 'Password is required.' };

    const stored = SessionManager.verifyCredentials(credentials.email, credentials.password);
    if (!stored) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const session = SessionManager.createSession(stored, credentials.rememberMe ?? false);
    return { success: true, user: session.user };
  },

  // ── Logout ───────────────────────────────────────────────────────────────
  logout(): void {
    SessionManager.clearSession();
  },

  // ── Forgot password ──────────────────────────────────────────────────────
  // In production: trigger a real password-reset email via your provider.
  // Here we validate the email format and confirm it exists.
  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(r => setTimeout(r, 800)); // simulate network latency

    const emailErr = validateEmail(email);
    if (emailErr) return { success: false, error: emailErr };

    // Always return success to avoid user enumeration. Internally log existence.
    const exists = SessionManager.emailExists(email);
    console.info('[AuthService] Password reset requested. Email registered:', exists);

    return { success: true };
  },

  // ── Session hydration ─────────────────────────────────────────────────────
  getActiveSession(): Session | null {
    return SessionManager.getSession();
  },
};
