import {
  ArrowBack,
  FilterList,
  Logout as LogoutIcon,
  PersonOutline,
  TuneOutlined
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router";
import GlobalAlert from "../../components/framework/GlobalAlert";
import { useAuth } from "../../hooks/useAuth";
import { useAnalyticsPageView } from "../../analytics";
import { ProfileTab } from "./components/ProfileTab";
import { PasswordTab } from "./components/PasswordTab";

const TABS = [
  { label: "Profile", path: "/settings/profile", icon: <PersonOutline /> },
  { label: "Filters", path: "/settings/filters", icon: <FilterList /> },
  { label: "Preferences", path: "/settings/preferences", icon: <TuneOutlined /> }
] as const;

export function ProfileSettingsTab() {
  return (
    <Stack spacing={3}>
      <ProfileTab />
      <PasswordTab />
    </Stack>
  );
}

export default function SettingsLayout() {
  useAnalyticsPageView();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const activeTab = Math.max(
    0,
    TABS.findIndex((t) => location.pathname.startsWith(t.path))
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar>
          <IconButton edge="start" aria-label="Back to app" onClick={() => navigate("/")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" flexGrow={1} ml={1}>
            Settings
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={(_, i) => navigate(TABS[i].path)}
          variant="fullWidth"
          aria-label="settings tabs"
        >
          {TABS.map((t) => (
            <Tab key={t.path} icon={t.icon} label={t.label} />
          ))}
        </Tabs>
      </AppBar>
      <Box component="main" p={3}>
        <GlobalAlert />
        <Outlet />
      </Box>
    </Box>
  );
}
