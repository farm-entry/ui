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

  // Auto-detect if label should shrink based on value presence
  const shouldShrink = value !== undefined && value !== null && value !== '';

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
        inputLabel: {
          shrink: shouldShrink,
          ...slotProps?.inputLabel,
        },
        ...slotProps,
      }}
      {...rest}
    />
  );
});
