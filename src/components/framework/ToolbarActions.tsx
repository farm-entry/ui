import { QrCode } from "@mui/icons-material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

function ToolbarActions() {
  const { mode, setMode } = useColorScheme();
  const navigate = useNavigate();

  return (
    <Stack direction="row">
      <IconButton
        sx={{ color: mode === "dark" ? "secondary" : "black" }}
        onClick={() => navigate("qrcode")}
      >
        <QrCode />
      </IconButton>
      <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
        {mode === "dark" ? <LightModeIcon color="secondary" /> : <DarkModeIcon color="primary" />}
      </IconButton>
    </Stack>
  );
}

export default ToolbarActions;
