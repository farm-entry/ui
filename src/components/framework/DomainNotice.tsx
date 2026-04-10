import { Box, Typography } from "@mui/material";
import { useConfigStore } from "../../store/configStore";
import { useUserStore } from "../../store/userStore";

export default function DomainNotice() {
  const { domain } = useUserStore();
  const getDomain = useConfigStore((s) => s.getDomain);

  if (!domain) return null;

  const domainConfig = getDomain(domain);
  const label = domainConfig?.uri ?? domain;

  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        p: 1,
        pb: 0.5,
        // boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
      }}
    >
      <Typography variant="body2" component="div">
        Welcome to {label.toUpperCase()} !
      </Typography>
    </Box>
  );
}
