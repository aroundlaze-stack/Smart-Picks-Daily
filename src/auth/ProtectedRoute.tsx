// ─── Protected Route ──────────────────────────────────────────────────────────
// Wrap any <Route> component with this to require authentication.
// Unauthenticated users are redirected to /login with a `redirect` query param
// so they return to the intended page after signing in.

import { ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Override the redirect target. Defaults to /login */
  loginPath?: string;
}

export function ProtectedRoute({ children, loginPath = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Show nothing while hydrating from storage to avoid flash of redirect
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const to = `${loginPath}?redirect=${encodeURIComponent(location)}`;
    return <Redirect to={to} />;
  }

  return <>{children}</>;
}
