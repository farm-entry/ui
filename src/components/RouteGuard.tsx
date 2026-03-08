import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../store/userStore";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoute?: string;
  requiredRole?: 'admin' | 'app_admin';
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiredRoute, requiredRole }) => {
  const { isAuthenticated } = useAuth();
  const { menuOptions, role } = useUserStore();

  // Skip auth check if env var is set
  if (process.env.FRONTLINE_SKIP_AUTH === "true") {
    return <>{children}</>;
  }

  // Still checking authentication status
  if (isAuthenticated === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated - redirect to login
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access check
  if (requiredRole) {
    const hasRole = role === requiredRole || (requiredRole === 'admin' && role === 'app_admin');
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  // If a specific route is required, check if user has access
  if (requiredRoute) {
    const hasAccess = menuOptions.some((option: any) => option.segment === requiredRoute && !option.hidden);
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;
