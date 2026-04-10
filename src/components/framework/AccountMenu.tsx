import { AccountCircle, Settings, SwapHoriz } from "@mui/icons-material";
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../../store/userStore";

export default function AccountMenu() {
  const { firstName, username, role, domain, domains, switchDomain } = useUserStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [switching, setSwitching] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchDomain = async (target: string) => {
    if (target === domain || switching) return;
    setSwitching(true);
    try {
      await switchDomain(target);
    } finally {
      setSwitching(false);
      handleMenuClose();
    }
  };

  // Domains the user can switch to (exclude current active domain)
  const switchableDomains = domains.filter((d) => d !== domain);

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={anchorEl ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <ListItemText
            primary={firstName || username}
            secondary={
              <>
                <Typography component="span" variant="caption" display="block">
                  {role}
                </Typography>
                {domain && (
                  <Typography
                    component="span"
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {domain}
                  </Typography>
                )}
              </>
            }
          />
        </MenuItem>

        {switchableDomains.length > 0 && <Divider />}

        {switchableDomains.map((d) => (
          <MenuItem key={d} onClick={() => handleSwitchDomain(d)} disabled={switching}>
            <ListItemIcon>
              <SwapHoriz fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={d} secondary="Switch to" />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/settings");
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
