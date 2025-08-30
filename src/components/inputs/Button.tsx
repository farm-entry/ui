import * as React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from "@mui/material";

export interface ButtonProps extends MuiButtonProps {}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  // borderRadius: 8,
  // textTransform: 'none',
  // fontWeight: 600,
  // padding: '8px 16px',
}));

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <StyledButton ref={ref} {...props} />;
});
