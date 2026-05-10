import * as React from "react";
import { useContext } from "react";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";
import { FormAnalyticsContext, trackInputFocus } from "../../analytics";

export interface EventNumberInputProps extends Omit<MuiTextFieldProps, "variant"> {
  placeholder: string;
  helperText?: string;
  codeRegistration: any;
  quantityRegistration: any;
}

export const EventNumberInput = React.forwardRef<HTMLInputElement, EventNumberInputProps>(
  (props, ref) => {
    const { placeholder, helperText, codeRegistration, quantityRegistration, value, slotProps, ...rest } = props;

    // Auto-detect if label should shrink based on value presence
    const shouldShrink = value !== undefined && value !== null && value !== "";
    const { formName } = useContext(FormAnalyticsContext);

    return (
      <>
        <input aria-hidden="true" type="hidden" {...codeRegistration} />
        <MuiTextField
          ref={ref}
          {...quantityRegistration}
          variant="outlined"
          placeholder={placeholder}
          helperText={helperText}
          fullWidth
          onFocus={() => trackInputFocus(quantityRegistration.name ?? "unknown", formName, "event-number")}
          slotProps={{
            inputLabel: {
              shrink: shouldShrink || undefined,
              ...slotProps?.inputLabel,
            },
            ...slotProps,
          }}
          {...rest}
        />
      </>
    );
  }
);
