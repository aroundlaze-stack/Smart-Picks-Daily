// ─── Auth Types ───────────────────────────────────────────────────────────────
// Centralised model definitions. Nothing here is coupled to any specific
// auth provider — swap AuthService to move from localStorage to Firebase,
// Supabase, Clerk, Auth0, etc.

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string; // ISO string
}

export interface Session {
  user: User;
  token: string; // opaque session token
  expiresAt: number; // Unix ms timestamp
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}
