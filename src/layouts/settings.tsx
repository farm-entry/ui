import {
  Box,
  Card,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  ArrowBack,
  FilterList,
  LockOutlined,
  Logout as LogoutIcon,
  PersonOutline
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import GlobalAlert from "../components/framework/GlobalAlert";

const NAV_ITEMS = [
  { label: "Profile",  icon: <PersonOutline />, path: "/settings/profile"  },
  { label: "Password", icon: <LockOutlined />,  path: "/settings/password" },
  { label: "Filters",  icon: <FilterList />,    path: "/settings/filters"  },
];

export default function SettingsLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const activeIndex = NAV_ITEMS.findIndex(item => pathname.startsWith(item.path));

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>

      {/* ── Top bar ── */}
      <Box
        sx={{
          display: "flex", alignItems: "center", gap: 1.5,
          px: 2, py: 1.5,
          bgcolor: "background.paper",
          borderBottom: 1, borderColor: "divider",
        }}
      >
        <IconButton onClick={() => navigate("/")} aria-label="Back to app" size="small">
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
      </Box>

      {/* ── Body: sidebar + content ── */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ─ Desktop sidebar ─ */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              width: 240, flexShrink: 0,
              bgcolor: "background.paper",
              borderRight: 1, borderColor: "divider",
              display: "flex", flexDirection: "column",
              py: 1,
            }}
          >
            <List disablePadding sx={{ flex: 1 }}>
              {NAV_ITEMS.map(({ label, icon, path }) => (
                <ListItemButton
                  key={path}
                  selected={pathname.startsWith(path)}
                  onClick={() => navigate(path)}
                  sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ mx: 2 }} />

            <List disablePadding sx={{ pb: 1 }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 1, mx: 1, mt: 0.5, color: "error.main",
                  "& .MuiListItemIcon-root": { color: "error.main" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        )}

        {/* ─ Content area ─ */}
        <Box sx={{ flex: 1, overflow: "auto", p: { xs: 2, md: 3 } }}>

          {/* Mobile section tabs */}
          {isMobile && (
            <Tabs
              value={activeIndex === -1 ? 0 : activeIndex}
              onChange={(_, i) => navigate(NAV_ITEMS[i].path)}
              variant="fullWidth"
              sx={{ mb: 2, bgcolor: "background.paper", borderRadius: 1 }}
            >
              {NAV_ITEMS.map(({ label, icon }) => (
                <Tab key={label} label={label} icon={icon} iconPosition="top" />
              ))}
            </Tabs>
          )}

          <GlobalAlert />

          <Card variant="outlined" sx={{ p: 2 }}>
            <Outlet />
          </Card>

          {/* Mobile logout */}
          {isMobile && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 1, color: "error.main", width: "auto",
                  "& .MuiListItemIcon-root": { color: "error.main" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
