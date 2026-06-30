import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "../types/api";
import { useAuth } from "../contexts/AuthContext";

type RoleRouteProps = {
  allowedRoles: UserRole[];
  fallbackPath: string;
};

export default function RoleRoute({ allowedRoles, fallbackPath }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}
