import * as React from "react";
import { Card, CardProps } from "@mui/material";

export interface CustomCardProps extends CardProps {
  full?: boolean;
}

/**
 * CustomCard - A global card component for consistent dashboard/form styling.
 * @param full - If true, card takes 100% width. Otherwise, uses default width.
 */
export function CustomCard({ full = false, sx, ...props }: CustomCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: full ? "100%" : 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: 2,
        borderRadius: 3,
        ...sx,
      }}
      {...props}
    />
  );
}
