import { useColorScheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function ToolbarActions() {
  const { mode, setMode } = useColorScheme();
  return (
    <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}

export default ToolbarActions;
