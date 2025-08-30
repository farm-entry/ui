import * as React from "react";
import { Button as MuiButton, ButtonGroup, ButtonProps as MuiButtonProps } from "@mui/material";

export type StackedButtonOption = {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
};

export interface StackedButtonProps {
  options: StackedButtonOption[];
  orientation?: "vertical" | "horizontal";
  width?: string | number;
  align?: "centered" | "left" | "right";
  variant?: MuiButtonProps["variant"];
  color?: MuiButtonProps["color"];
  size?: MuiButtonProps["size"];
  className?: string;
}

export const StackedButton: React.FC<StackedButtonProps> = ({
  options,
  orientation = "vertical",
  width,
  align = "left",
  variant = "contained",
  color = "primary",
  size = "medium",
  className,
}) => {
  // MUI ButtonGroup uses 'orientation', 'fullWidth', 'size', 'color', 'variant'
  // Alignment can be handled by a wrapper Box if needed
  let justifyContent: any = undefined;
  if (align === "centered") justifyContent = "center";
  if (align === "right") justifyContent = "flex-end";
  if (align === "left") justifyContent = "flex-start";

  return (
    <div
      style={{
        width: width || undefined,
        display: "flex",
        justifyContent,
      }}
      className={className}
    >
      <ButtonGroup orientation={orientation} variant={variant} color={color} size={size} fullWidth={!!width} sx={width ? { width } : undefined}>
        {options.map((option, idx) => (
          <MuiButton key={option.label + idx} href={option.href} onClick={option.onClick} disabled={option.disabled}>
            {option.label}
          </MuiButton>
        ))}
      </ButtonGroup>
    </div>
  );
};
