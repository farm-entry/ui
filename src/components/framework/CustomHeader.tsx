import { Button, Stack, SxProps, Theme, Typography } from "@mui/material";
import React from "react";

export interface HeaderButton {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
}

interface CustomHeaderProps {
  icon?: React.ElementType;
  title: string;
  sx?: SxProps<Theme>;
  button?: HeaderButton;
}

export default function CustomHeader({ icon: Icon, button, title, sx }: CustomHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} mb={4} sx={sx}>
      {Icon && <Icon color="primary" sx={{ fontSize: 24 }} />}
      <Typography variant="h6">{title}</Typography>
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
