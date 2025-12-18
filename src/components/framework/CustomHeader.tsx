import { Button, Stack, SvgIconTypeMap, SxProps, Theme, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface CustomHeaderProps {
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  title: string;
  sx?: SxProps<Theme>;
  iconSx?: SxProps<Theme>;
  button?: {
    label: string;
    onClick: () => void;
    variant?: "text" | "outlined" | "contained";
  };
}

export default function CustomHeader({ icon: Icon, button, title, sx, iconSx }: CustomHeaderProps) {
  return (
    <Stack direction="row" alignItems={"center"} spacing={2} mb={4} sx={sx}>
      {Icon && <Icon color="primary" sx={{ fontSize: 34, ...iconSx }} />}
      <Typography variant="h4">{title}</Typography>
      {button && (
        <div style={{ justifyContent: "flex-end", display: "flex", flex: 1 }}>
          <Button size="small" variant={button.variant || "text"} onClick={button.onClick}>
            {button.label}
          </Button>
        </div>
      )}
    </Stack>
  );
}
