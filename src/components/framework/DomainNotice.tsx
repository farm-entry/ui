import { Box, Typography } from "@mui/material";
import { getContrastRatio } from "@mui/material/styles";
import { useConfigStore } from "../../store/configStore";
import { useUserStore } from "../../store/userStore";

export default function DomainNotice() {
  const { domain, preferences } = useUserStore();
  const getDomain = useConfigStore((s) => s.getDomain);
  const getDomainColor = useConfigStore((s) => s.getDomainColor);

  if (!domain) return null;

  const domainConfig = getDomain(domain);
  const label = domainConfig?.uri ?? domain;

  const userColor = preferences?.domainColors?.[domain ?? ''];
  const configColor = getDomainColor(domain ?? '');
  const effectiveColor = (userColor && userColor !== '') ? userColor : (configColor ?? undefined);

  let textColor: string | undefined;
  if (effectiveColor) {
    try {
      textColor = getContrastRatio(effectiveColor, '#ffffff') >= 4.5 ? '#ffffff' : '#000000';
    } catch {
      textColor = undefined;
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: effectiveColor ?? 'primary.main',
        color: textColor ?? 'primary.contrastText',
        p: 1,
        pb: 0.5,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Typography variant="body2" component="div">
        Welcome to {label.toUpperCase()} !
      </Typography>
    </Box>
  );
}
