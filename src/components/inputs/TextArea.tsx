import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface TextAreaProps extends Omit<TextFieldProps, "variant" | "multiline" | "rows"> {
  rows?: number;
  placeholder?: string;
}

export const TextArea = React.forwardRef<HTMLInputElement, TextAreaProps>((props, ref) => {
  const { label, rows = 4, placeholder, ...rest } = props;

  return <TextField ref={ref} variant="outlined" placeholder={placeholder} multiline rows={rows} fullWidth {...rest} />;
});
