import * as React from "react";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";
import { watch } from "fs";

export interface TextFieldProps extends Omit<MuiTextFieldProps, "variant"> {
  placeholder: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { placeholder, helperText, value, slotProps, ...rest } = props;

  // Auto-detect if label should shrink based on value presence
  const shouldShrink = value !== undefined && value !== null && value !== "";

  return (
    <>
      <MuiTextField
        ref={ref}
        variant="outlined"
        label={props.label}
        placeholder={placeholder}
        helperText={helperText}
        fullWidth
        value={value} // CRITICAL: Must pass value explicitly after extracting it
        slotProps={slotProps}
        {...rest}
      />
    </>
  );
});
