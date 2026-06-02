import * as React from "react";
import { useContext } from "react";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";
import { FormAnalyticsContext, trackInputFocus } from "../../analytics";

export interface TextFieldProps extends Omit<MuiTextFieldProps, "variant"> {
  placeholder: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { placeholder, helperText, value, type, slotProps, onFocus, ...rest } = props;
  const { formName } = useContext(FormAnalyticsContext);

  const shouldShrink = value !== undefined && value !== null && value !== "";

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    trackInputFocus(rest.name ?? "unknown", formName, type ?? "text");
    onFocus?.(e);
  };

  const { inputLabel: callerInputLabel, ...restSlotProps } = slotProps ?? {};

  return (
    <>
      <MuiTextField
        ref={ref}
        variant="outlined"
        placeholder={placeholder}
        helperText={helperText}
        fullWidth
        value={value}
        type={type}
        onFocus={handleFocus}
        slotProps={{
          ...restSlotProps,
          inputLabel: {
            shrink: shouldShrink ? true : undefined,
            ...callerInputLabel,
          },
        }}
        {...rest}
      />
    </>
  );
});
