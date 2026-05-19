import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  FilterList,
  LockOutlined,
  Logout as LogoutIcon,
  PersonOutline
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import CustomPageContainer from "../../components/framework/CustomPageContainer";
import CustomFormsLayout from "../../layouts/forms";
import { ProfileTab } from "./components/ProfileTab";
import { PasswordTab } from "./components/PasswordTab";
import { FiltersTab } from "./components/FiltersTab";

// ── Settings Page ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <CustomPageContainer>
      <CustomFormsLayout>
        <Stack spacing={3}>
          <Card variant="outlined">
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="fullWidth"
              aria-label="Settings tabs"
            >
              <Tab
                icon={<PersonOutline />}
                label="Profile"
                iconPosition={isMobile ? "top" : "start"}
                id="settings-tab-0"
                aria-controls="settings-panel-0"
              />
              <Tab
                icon={<LockOutlined />}
                label="Password"
                iconPosition={isMobile ? "top" : "start"}
                id="settings-tab-1"
                aria-controls="settings-panel-1"
              />
              <Tab
                icon={<FilterList />}
                label="Filters"
                iconPosition={isMobile ? "top" : "start"}
                id="settings-tab-2"
                aria-controls="settings-panel-2"
              />
            </Tabs>

            <Divider />

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box role="tabpanel" id="settings-panel-0" aria-labelledby="settings-tab-0">
                  <ProfileTab />
                </Box>
              )}
              {activeTab === 1 && (
                <Box role="tabpanel" id="settings-panel-1" aria-labelledby="settings-tab-1">
                  <PasswordTab />
                </Box>
              )}
              {activeTab === 2 && (
                <Box role="tabpanel" id="settings-panel-2" aria-labelledby="settings-tab-2">
                  <FiltersTab />
                </Box>
              )}
            </Box>
          </Card>

          <Button
            variant="text"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ alignSelf: "flex-start" }}
          >
            Logout
          </Button>
        </Stack>
      </CustomFormsLayout>
    </CustomPageContainer>
  );
}
