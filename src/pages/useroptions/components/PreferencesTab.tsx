import { TuneOutlined } from "@mui/icons-material";
import { Card, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export function PreferencesTab() {
  const { mode, setMode } = useColorScheme();

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <TuneOutlined color="primary" sx={{ fontSize: 24 }} />
        <Typography variant="h6">Preferences</Typography>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Appearance
        </Typography>
        <ToggleButtonGroup
          value={mode ?? "system"}
          exclusive
          onChange={(_, val) => { if (val) setMode(val); }}
          aria-label="theme mode"
        >
          <ToggleButton value="light">Light</ToggleButton>
          <ToggleButton value="system">System</ToggleButton>
          <ToggleButton value="dark">Dark</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Card>
  );
}
