import { ArrowBack, ExitToAppOutlined, Logout as LogoutIcon } from "@mui/icons-material";
import {
  Box,
  Card,
  Divider,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, useNavigate } from "react-router";
import GlobalAlert from "../../components/framework/GlobalAlert";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/inputs";

function SidebarFooter() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Divider />
      <List disablePadding sx={{ pb: 1, pt: 0.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            mx: 1,
            color: "error.main",
            "& .MuiListItemIcon-root": { color: "error.main" }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </>
  );
}

export default function SettingsLayout() {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      slots={{
        toolbarActions: () => (
          <Button variant="text" onClick={() => navigate("/")} endIcon={<ExitToAppOutlined />}>
            Return
          </Button>
        ),
        toolbarAccount: () => null,
        sidebarFooter: SidebarFooter
      }}
    >
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <GlobalAlert />
        <Outlet />
      </Box>
    </DashboardLayout>
  );
}
