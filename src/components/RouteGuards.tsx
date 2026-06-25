import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

function FullScreen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted text-sm">
      {children}
    </div>
  );
}

// Public-only (landing, login, signup). Logged-in users get bounced to their dashboard.
export function PublicOnly({ children }: { children: ReactNode }) {
  const { session, profile, loading } = useAuth();
  if (loading) return <FullScreen>Memuat…</FullScreen>;
  if (session && profile) {
    return <Navigate to={profile.role === "admin" ? "/app" : "/app"} replace />;
  }
  return <>{children}</>;
}

// Any authenticated user. Logged-out → landing.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <FullScreen>Memuat…</FullScreen>;
  if (!session) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// Admin-only. Non-admins → creator dashboard.
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, profile, loading } = useAuth();
  if (loading) return <FullScreen>Memuat…</FullScreen>;
  if (!session) return <Navigate to="/" replace />;
  if (profile?.role !== "admin") return <Navigate to="/app" replace />;
  return <>{children}</>;
}