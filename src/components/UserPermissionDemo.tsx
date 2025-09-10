import React from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import { useUserStore } from "../store/userStore";
import DEFAULT_USER from "../mock/userOptions.json";
import LIMITED_USER from "../mock/userOptionsLimited.json";
import { UserInfo } from "../store/userStore";

export const UserPermissionDemo: React.FC = () => {
  const { user, setUser } = useUserStore();

  const handleSetFullAccess = () => {
    setUser(DEFAULT_USER as UserInfo);
  };

  const handleSetLimitedAccess = () => {
    setUser(LIMITED_USER as UserInfo);
  };

  const visibleMenus = user.menuOptions.filter((option) => !option.hidden);
  const hiddenMenus = user.menuOptions.filter((option) => option.hidden);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        User Permission Demo
      </Typography>

      <Typography variant="body1" gutterBottom>
        Current User: <strong>{user.userData.username}</strong>
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={handleSetFullAccess} disabled={user.userData.username === "APP"}>
          Set Full Access User
        </Button>
        <Button variant="outlined" onClick={handleSetLimitedAccess} disabled={user.userData.username === "LIMITED_USER"}>
          Set Limited Access User
        </Button>
      </Stack>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Accessible Routes ({visibleMenus.length})
          </Typography>
          {visibleMenus.map((option) => (
            <Typography key={option.title} variant="body2" sx={{ ml: 1 }}>
              ✅ {option.title} → {option.segment}
            </Typography>
          ))}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Restricted Routes ({hiddenMenus.length})
          </Typography>
          {hiddenMenus.map((option) => (
            <Typography key={option.title} variant="body2" sx={{ ml: 1 }}>
              ❌ {option.title} → {option.segment}
            </Typography>
          ))}
        </Box>
      </Box>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: "block" }}>
        Note: Navigation menu and route access will update automatically when you switch users. Try navigating to restricted routes to see the protection in action.
      </Typography>
    </Paper>
  );
};

export default UserPermissionDemo;
