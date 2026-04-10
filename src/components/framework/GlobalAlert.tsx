import { useEffect } from "react";
import { Alert, AlertTitle, IconButton, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router";
import { useGlobalAlertStore } from "../../store/globalAlertStore";

export default function GlobalAlert() {
  const { open, severity, message, title, clearAlert } = useGlobalAlertStore();
  const location = useLocation();

  useEffect(() => {
    clearAlert();
  }, [location.pathname]);

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={clearAlert}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 0.5 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
}