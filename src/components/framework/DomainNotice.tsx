import { Box, Typography } from "@mui/material";
import { useUserStore } from "../../store/userStore";
import { useConfigStore } from "../../store/configStore";

export default function DomainNotice() {
  const { domain } = useUserStore();
  const getDomainColor = useConfigStore((s) => s.getDomainColor);
  const getDomain = useConfigStore((s) => s.getDomain);

  if (!domain) return null;

  const color = getDomainColor(domain);
  const domainConfig = getDomain(domain);
  const label = domainConfig?.uri ?? domain;
  console.log({ domain, color, label });
  return (
    <Box
      sx={{
        backgroundColor: color ?? "warning.light",
        color: color ? "#fff" : "warning.contrastText",
        p: 1,
        pb: 0.5
      }}
    >
      <Typography variant="body2" component="div">
        Farm: {label} {color ? "" : "(No color configured)"}
      </Typography>
    </Box>
  );
}
