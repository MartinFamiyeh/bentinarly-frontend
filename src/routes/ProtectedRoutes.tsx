// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const auth = useAuth();

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
