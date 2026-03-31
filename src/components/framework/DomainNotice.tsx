import { Box, Typography } from "@mui/material";
import { useUserStore } from "../../store/userStore";

export default function DomainNotice() {
  const { domain } = useUserStore();
  if (!domain) return null;
  return (
    <Box sx={{ backgroundColor: "warning.light", color: "warning.contrastText", p: 1, pb: 0.5 }}>
      <Typography variant="body2" component="div">
        Farm: {domain}
      </Typography>
    </Box>
  );
}
