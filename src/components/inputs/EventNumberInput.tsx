import * as React from "react";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";

export interface EventNumberInputProps extends Omit<MuiTextFieldProps, "variant"> {
  placeholder: string;
  helperText?: string;
  codeRegistration: any;
  quantityRegistration: any;
}

export const EventNumberInput = React.forwardRef<HTMLInputElement, EventNumberInputProps>(
  (props, ref) => {
    const { placeholder, helperText, codeRegistration, quantityRegistration, ...rest } = props;

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
          {...rest}
        />
      </>
    );
  }
);
