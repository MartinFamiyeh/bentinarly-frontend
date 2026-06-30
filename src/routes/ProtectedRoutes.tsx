import { Navigate, Outlet, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../contexts/AuthContext";
import { PARTICIPANT_LOGIN, RESEARCHER_LOGIN } from "../constants/userRoles";

type ProtectedRouteProps = {
  loginPath?: string;
};

export default function ProtectedRoute({ loginPath = RESEARCHER_LOGIN }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function ParticipantProtectedRoute() {
  return <ProtectedRoute loginPath={PARTICIPANT_LOGIN} />;
}
