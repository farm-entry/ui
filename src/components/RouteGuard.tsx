import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../store/userStore";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoute?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiredRoute }) => {
  const { isAuthenticated } = useAuth();
  const { menuOptions } = useUserStore();

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

  // If a specific route is required, check if user has access
  if (requiredRoute) {
    const hasAccess = menuOptions.some((option: any) => option.segment === requiredRoute && !option.hidden);

    if (!hasAccess) {
      // Redirect to home or show unauthorized message
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;
