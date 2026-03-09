import { Logout } from "@mui/icons-material";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <PageContainer>
      <h1>Welcome to user settings</h1>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </PageContainer>
  );
};
