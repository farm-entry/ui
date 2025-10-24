import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
// import { userOptionsApi } from "../services/userApi";
import { useUserStore } from "../store/userStore";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoute?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiredRoute }) => {
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);
  const { menuOptions, setUser } = useUserStore();

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        // const userInfo = await userOptionsApi.fetchUserInfo();
        // setUser(userInfo);
        setUserLoaded(true);
      } catch (error) {
        console.error("Failed to load user info:", error);
        // Handle error - could redirect to login or show error
      } finally {
        setLoading(false);
      }
    };

    if (!userLoaded) {
      loadUserInfo();
    } else {
      setLoading(false);
    }
  }, [setUser, userLoaded]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
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
