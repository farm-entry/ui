import { Stack, SvgIconTypeMap, SxProps, Theme, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface CustomHeaderProps {
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  title: string;
  sx?: SxProps<Theme>;
  iconSx?: SxProps<Theme>;
}

export default function CustomHeader({ icon: Icon, title, sx, iconSx }: CustomHeaderProps) {
  return (
    <Stack direction="row" alignItems={"center"} spacing={2} mb={4} sx={sx}>
      {Icon && <Icon color="primary" sx={{ fontSize: 34, ...iconSx }} />}
      <Typography variant="h4">{title}</Typography>
    </Stack>
  );
}
