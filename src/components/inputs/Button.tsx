import * as React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from "@mui/material";

export interface ButtonProps extends MuiButtonProps {
  // variant?: "primary" | "secondary" | "tertiary";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  center?: boolean;
  fullWidth?: boolean;
}

const StyledButton = styled(MuiButton)<{ center?: boolean; fullWidth?: boolean }>(({ theme, center, fullWidth }) => ({
  // borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 16px",
  fontSize: "1rem",
  // Center styling
  ...(center && {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  }),
  // Full width styling
  ...(fullWidth && {
    width: "100%",
  }),
  // Primary variant
  "&.variant-contained": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  // Secondary variant
  "&.variant-outlined": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  // Tertiary variant
  "&.variant-text": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  // Disabled state for all variants
  "&.Mui-disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = "primary", children, className, center, fullWidth, ...rest } = props;

  return (
    <StyledButton ref={ref} className={`variant-${variant} ${className || ""}`} center={center} fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
});
