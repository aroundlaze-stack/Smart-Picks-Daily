// ─── Auth Provider ────────────────────────────────────────────────────────────
// Wraps the app and exposes auth state + actions via AuthContext.
// Swap AuthService for any provider without touching this file's interface.

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { AuthService } from './AuthService';
import type {
  AuthContextValue,
  AuthResult,
  LoginCredentials,
  SignUpCredentials,
  User,
} from './types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate session on mount
  useEffect(() => {
    const session = AuthService.getActiveSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<AuthResult> => {
    const result = await AuthService.signUp(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    const result = await AuthService.login(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(
    (email: string) => AuthService.forgotPassword(email),
    [],
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    login,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
