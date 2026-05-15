import * as React from "react";
import { useContext } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { FormAnalyticsContext, trackInputFocus } from "../../analytics";

export interface TextAreaProps extends Omit<TextFieldProps, "variant" | "multiline" | "rows"> {
  rows?: number;
  placeholder?: string;
}

export const TextArea = React.forwardRef<HTMLInputElement, TextAreaProps>((props, ref) => {
  const { label, rows = 4, placeholder, value, slotProps, onFocus, ...rest } = props;
  const { formName } = useContext(FormAnalyticsContext);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    trackInputFocus(rest.name ?? "unknown", formName, "textarea");
    onFocus?.(e);
  };

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
      onFocus={handleFocus}
      slotProps={{
        ...slotProps,
      }}
      {...rest}
    />
  );
});
