import * as React from "react";
import { Box } from "@mui/material";

export interface ColorSwatchProps {
  color: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function ColorSwatch({ color, label, selected, onClick }: ColorSwatchProps) {
  return (
    <Box
      component="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: color,
        border: "none",
        padding: 0,
        cursor: "pointer",
        outline: selected ? "3px solid" : "none",
        outlineColor: selected ? "text.primary" : undefined,
        outlineOffset: selected ? "2px" : undefined,
        transition: "transform 0.15s ease",
        "&:hover": {
          transform: "scale(1.15)",
        },
      }}
    />
  );
}
