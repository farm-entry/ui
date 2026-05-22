import {
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Logout,
  Settings,
  SwapHoriz
} from "@mui/icons-material";
import {
  Avatar,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useConfigStore } from "../../store/configStore";
import { useConfirmationStore } from "../../store/confirmationStore";
import { useUserStore } from "../../store/userStore";

export default function AccountMenu() {
  const { logout } = useAuth();
  const { showConfirmation } = useConfirmationStore();
  const { firstName, username, role, domain, domains, switchDomain } = useUserStore();
  const configDomains = useConfigStore((state) => state.domains);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setDomainsOpen(false);
  };

  const handleSwitchDomain = (target: string) => {
    if (target === domain || switching) return;
    showConfirmation(
      'Switch Domain',
      'Are you sure? Any existing stored data will be lost.',
      async () => {
        setSwitching(true);
        try {
          await switchDomain(target);
        } finally {
          setSwitching(false);
          handleMenuClose();
        }
      }
    );
  };

  const switchableDomains = role === 'app_admin'
    ? configDomains.map((d) => d.name).filter((d) => d !== domain)
    : Object.values(domains).flat().filter((d) => d !== domain);
  const displayName = firstName || username;
  const initials = displayName?.charAt(0).toUpperCase();

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
        slotProps={{ paper: { sx: { width: 240, mt: 0.5 } } }}
      >
        <MenuList dense disablePadding>
          {/* Identity block */}
          <MenuItem disabled sx={{ opacity: "1 !important", py: 1.5, gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
              {initials}
            </Avatar>
            <ListItemText
              primary={displayName}
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
          {switchableDomains.length > 0 && (
            <MenuItem onClick={() => setDomainsOpen((prev) => !prev)}>
              <ListItemIcon>
                <SwapHoriz fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Switch Domain" />
              {domainsOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </MenuItem>
          )}
          <Collapse in={domainsOpen} timeout="auto" unmountOnExit>
            {switchableDomains.map((d) => (
              <MenuItem
                key={d}
                onClick={() => handleSwitchDomain(d)}
                disabled={switching}
                sx={{ pl: 4 }}
              >
                <ListItemText primary={d} slotProps={{ primary: { variant: "body2" } }} />
              </MenuItem>
            ))}
          </Collapse>

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
            <ListItemText primary="Settings" />
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              showConfirmation("Logout", "Are you sure you want to logout?", logout);
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
