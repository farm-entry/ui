import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface TextAreaProps extends Omit<TextFieldProps, "variant" | "multiline" | "rows"> {
  rows?: number;
  placeholder?: string;
}

export const TextArea = React.forwardRef<HTMLInputElement, TextAreaProps>((props, ref) => {
  const { label, rows = 4, placeholder, value, slotProps, ...rest } = props;

  // Auto-detect if label should shrink based on value presence
  const shouldShrink = value !== undefined && value !== null && value !== '';

  return (
    <TextField
      ref={ref}
      variant="outlined"
      label={label}
      placeholder={placeholder}
      multiline
      rows={rows}
      fullWidth
      value={value}
      slotProps={{
        inputLabel: {
          shrink: shouldShrink,
          ...slotProps?.inputLabel, // Allow manual override
        },
        ...slotProps,
      }}
      {...rest}
    />
  );
});
