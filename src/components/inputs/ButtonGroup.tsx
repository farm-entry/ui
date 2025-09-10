import * as React from "react";
import {
  ButtonGroup as MuiButtonGroup,
  ButtonGroupProps as MuiButtonGroupProps,
  styled,
} from "@mui/material";

export interface ButtonGroupProps extends Omit<MuiButtonGroupProps, "size"> {
  width?: "auto" | "full" | number;
  align?: "left" | "center" | "right";
}

const StyledButtonGroup = styled(MuiButtonGroup)<{
  $width?: "auto" | "full" | number;
}>(({ theme, $width }) => ({
  // Width handling
  width:
    $width === "full" ? "100%" : $width === "auto" ? "auto" : `${$width}px`,
  // When full width, ensure buttons expand equally
  '&[data-full-width="true"]': {
    "& .MuiButton-root": {
      flex: 1,
    },
  },
}));

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (props, ref) => {
    const { 
      width = 250, 
      align,
      children,
      sx,
      ...rest 
    } = props;

    const alignStyles = align === 'center' 
      ? { alignSelf: 'center' }
      : align === 'right'
      ? { alignSelf: 'flex-end' }
      : {};

    return (
      <StyledButtonGroup
        ref={ref}
        $width={width}
        data-full-width={width === "full"}
        sx={{ ...alignStyles, ...sx }}
        {...rest}
      >
        {children}
      </StyledButtonGroup>
    );
  }
);
