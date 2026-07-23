// ─── Session Manager ──────────────────────────────────────────────────────────
// Handles persistence of auth sessions in localStorage.
// Swap this module to use cookies, IndexedDB, or a server-side session
// without touching any other auth files.

import type { Session, User } from './types';

const SESSION_KEY = 'spd-auth-session';
const USERS_KEY   = 'spd-auth-users';

// Default session TTL — 7 days for "remember me", 1 day otherwise
const TTL_REMEMBER = 7 * 24 * 60 * 60 * 1000;
const TTL_DEFAULT  = 24 * 60 * 60 * 1000;

// ── Stored user record (includes hashed password) ────────────────────────────
export interface StoredUser extends User {
  passwordHash: string; // bcrypt-ready slot; currently stores a salted hash
}

// Very lightweight deterministic hash — sufficient for a localStorage demo.
// Replace with bcrypt/argon2 when wiring up a real backend.
function simpleHash(password: string, salt: string): string {
  const raw = `${salt}::${password}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  }
  return `sha_${Math.abs(h).toString(36)}_${salt}`;
}

function generateSalt(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function generateToken(): string {
  return `tok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

// ── User store ────────────────────────────────────────────────────────────────
function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const SessionManager = {
  // ── User registration ────────────────────────────────────────────────────
  createUser(email: string, password: string, displayName: string): StoredUser {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const salt = generateSalt();
    const user: StoredUser = {
      id: generateId(),
      email: email.toLowerCase().trim(),
      displayName: displayName.trim(),
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash(password, salt),
    };
    // Store the salt alongside by embedding it in the hash prefix
    user.passwordHash = `${salt}||${simpleHash(password, salt)}`;
    saveUsers([...users, user]);
    return user;
  },

  // ── Credential verification ──────────────────────────────────────────────
  verifyCredentials(email: string, password: string): StoredUser | null {
    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim());
    if (!user) return null;

    const [salt, expectedHash] = user.passwordHash.split('||');
    const actual = simpleHash(password, salt);
    if (`${salt}||${actual}` !== user.passwordHash) return null;

    return user;
  },

  emailExists(email: string): boolean {
    return getUsers().some(u => u.email === email.toLowerCase().trim());
  },

  // ── Session CRUD ─────────────────────────────────────────────────────────
  createSession(user: StoredUser, rememberMe = false): Session {
    const session: Session = {
      user: { id: user.id, email: user.email, displayName: user.displayName, createdAt: user.createdAt },
      token: generateToken(),
      expiresAt: Date.now() + (rememberMe ? TTL_REMEMBER : TTL_DEFAULT),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  getSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session: Session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  },
};
